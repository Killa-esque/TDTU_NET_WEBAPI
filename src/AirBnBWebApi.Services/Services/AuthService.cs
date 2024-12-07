// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Service.Interfaces;
using AirBnBWebApi.Service.Security;
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IKeyTokenRepository _keyTokenRepository;
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IJwtTokenHandler _jwtTokenHandler;
    private readonly IRefreshTokenRepository _refreshTokenRepository;
    private readonly IRefreshTokenUsedRepository _refreshTokenUsedRepository;
    private readonly SecurityKeyGenerator _securityKeyGenerator;

    public AuthService(
        IUserRepository userRepository,
        IRoleRepository roleRepository,
        IKeyTokenRepository keyTokenRepository,
        IUserRoleRepository userRoleRepository,
        IJwtTokenHandler jwtTokenHandler,
        IRefreshTokenRepository refreshTokenRepository,
        IRefreshTokenUsedRepository refreshTokenUsedRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _keyTokenRepository = keyTokenRepository;
        _userRoleRepository = userRoleRepository;
        _jwtTokenHandler = jwtTokenHandler;
        _refreshTokenRepository = refreshTokenRepository;
        _refreshTokenUsedRepository = refreshTokenUsedRepository;
        _securityKeyGenerator = new SecurityKeyGenerator();
    }

    public async Task<AuthResult> RegisterAsync(RegisterDto registerDto)
    {
        var existingUser = await _userRepository.GetByEmailAsync(registerDto.Email).ConfigureAwait(false);
        var targetRole = await _roleRepository.GetByNameAsync(registerDto.Role).ConfigureAwait(false);

        if (targetRole == null || targetRole.Name == "Admin")
        {
            return new AuthResult
            {
                IsSuccess = false,
                Message = targetRole == null ? "Invalid role." : "Only admin role can be registered."
            };
        }

        // Nếu user đã tồn tại, thêm role mới vào user

        if (existingUser != null)
        {
            var extendRoleResult = await AddRoleToExistingUser(existingUser, targetRole).ConfigureAwait(false);

            return extendRoleResult.IsSuccess
                ? extendRoleResult
                : new AuthResult
                {
                    IsSuccess = false,
                    Message = extendRoleResult.Message
                };
        }

        var newUser = new User
        {
            FullName = registerDto.FullName,
            Email = registerDto.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
            Gender = registerDto.Gender,
            PhoneNumber = registerDto.PhoneNumber,
            DateOfBirth = DateTime.ParseExact(registerDto.DateOfBirth, "MM-dd-yyyy", CultureInfo.InvariantCulture),
            CreatedAt = DateTime.UtcNow
        };

        var createdUser = await _userRepository.CreateAsync(newUser).ConfigureAwait(false);
        await _userRoleRepository.CreateAsync(new UserRole { UserId = createdUser.Id, RoleId = targetRole.Id }).ConfigureAwait(false);
        await CreateAndSaveSecurityKey(createdUser).ConfigureAwait(false);


        return new AuthResult
        {
            IsSuccess = true,
            Message = "User registered successfully.",
            // User = MapToUserDtoAsync(createdUser).Result,
        };
    }

    private async Task<AuthResult> AddRoleToExistingUser(User existingUser, Role targetRole)
    {
        var existingRoles = await _userRoleRepository.GetRolesByUserIdAsync(existingUser.Id).ConfigureAwait(false);

        if (existingRoles.Any(r => r.Id == targetRole.Id))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Message = "Invalid role or duplicate role assignment."
            };
        }

        await _userRoleRepository.CreateAsync(new UserRole { UserId = existingUser.Id, RoleId = targetRole.Id }).ConfigureAwait(false);

        return new AuthResult
        {
            IsSuccess = true,
            Message = "Your account has been extended new role successfully."
        };
    }

    private async Task<TokenPairResult> RevokeAndGenerateNewTokens(User user)
    {
        var currentRefreshTokens = await _refreshTokenRepository.GetTokensByUserIdAsync(user.Id).ConfigureAwait(false);
        foreach (var token in currentRefreshTokens)
        {
            token.IsRevoked = true;
            token.RevokedAt = DateTime.UtcNow;
            await _refreshTokenRepository.UpdateAsync(token).ConfigureAwait(false);

            await _refreshTokenUsedRepository.CreateAsync(new RefreshTokenUsed
            {
                UserId = user.Id,
                Token = token.Token,
                UsedAt = DateTime.UtcNow,
                DeviceInfo = "Revoked during role update"
            }).ConfigureAwait(false);
        }

        return await GenerateTokenPairForUser(user).ConfigureAwait(false);
    }

    public async Task<AuthResult> LoginAsync(LoginDto loginDto)
    {
        var user = await _userRepository.GetByEmailAsync(loginDto.Email).ConfigureAwait(false);


        if (user == null)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Message = "Your email is incorrect."
            };
        }

        if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
        {
            return new AuthResult
            {
                IsSuccess = false,
                Message = "Your password is incorrect."
            };
        }

        var roles = await _userRoleRepository.GetRolesByUserIdAsync(user.Id).ConfigureAwait(false);

        if (!roles.Any(r => r.Name.Equals(loginDto.Role, StringComparison.OrdinalIgnoreCase)))
        {
            return new AuthResult { IsSuccess = false, Message = "You are not allowed to access this role." };
        }

        var tokenPair = await GenerateTokenPairForUser(user, loginDto.Role).ConfigureAwait(true);

        Console.WriteLine("Login successful." + tokenPair.AccessToken);

        return new AuthResult
        {
            IsSuccess = true,
            Message = "Login successful.",
            User = MapToUserDtoAsync(user).Result,
            Token = tokenPair
        };
    }

    public async Task<AuthResult> RefreshTokenAsync(RefreshTokenDto refreshTokenDto)
    {
        // 1. Tìm RefreshToken trong cơ sở dữ liệu
        var storedRefreshToken = await _refreshTokenRepository.GetByTokenAsync(refreshTokenDto.RefreshToken).ConfigureAwait(false);

        // Calculate the expiry date of the refresh token
        var daysToExpiry = (storedRefreshToken.ExpiryDate - DateTime.UtcNow).TotalDays;

        Console.WriteLine($"RefreshToken expires in {daysToExpiry} days.");

        if (storedRefreshToken == null || storedRefreshToken.IsRevoked || storedRefreshToken.ExpiryDate <= DateTime.UtcNow)
        {
            Console.WriteLine("RefreshToken expired.");
            return new AuthResult
            {
                IsSuccess = false,
                Message = "Invalid or expired refresh token."
            };
        }

        // 2. Lấy thông tin người dùng từ UserId của RefreshToken
        var user = await _userRepository.GetByIdAsync(storedRefreshToken.UserId).ConfigureAwait(false);
        if (user == null)
        {
            return new AuthResult
            {
                IsSuccess = false,
                Message = "User not found."
            };
        }

        // 3. Thu hồi RefreshToken hiện tại và lưu vào RefreshTokenUsed
        storedRefreshToken.IsRevoked = true;
        storedRefreshToken.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepository.UpdateAsync(storedRefreshToken).ConfigureAwait(false);
        Console.WriteLine("Revoked successfully.");

        await _refreshTokenUsedRepository.CreateAsync(new RefreshTokenUsed
        {
            UserId = user.Id,
            Token = storedRefreshToken.Token,
            UsedAt = DateTime.UtcNow,
            DeviceInfo = storedRefreshToken.DeviceInfo
        }).ConfigureAwait(false);

        Console.WriteLine("RefreshToken saved to RefreshTokenUsed.");

        // 4. Tạo AccessToken mới và RefreshToken mới
        var privateKey = (await _keyTokenRepository.GetByUserIdAsync(user.Id).ConfigureAwait(false)).PrivateKey;
        var newAccessToken = _jwtTokenHandler.GenerateToken(user, refreshTokenDto.Role, privateKey, 30); // Thời hạn 30 phút cho AccessToken
        var newRefreshToken = _jwtTokenHandler.GenerateRefreshToken();

        Console.WriteLine("New tokens generated.");

        // 5. Lưu RefreshToken mới vào cơ sở dữ liệu
        var newRefreshTokenEntity = new RefreshToken
        {
            UserId = user.Id,
            Token = newRefreshToken,
            ExpiryDate = DateTime.UtcNow.AddDays(30), // RefreshToken có thời hạn 30 ngày
            CreatedAt = DateTime.UtcNow,
            IsRevoked = false
        };
        await _refreshTokenRepository.CreateAsync(newRefreshTokenEntity).ConfigureAwait(false);

        Console.WriteLine("New RefreshToken saved.");
        // 6. Trả về kết quả thành công cùng với cặp token mới
        return new AuthResult
        {
            IsSuccess = true,
            Message = "Token refreshed successfully.",
            Token = new TokenPairResult { AccessToken = newAccessToken, RefreshToken = newRefreshToken }
        };
    }


    private async Task<TokenPairResult> GenerateTokenPairForUser(User user, string role = "")
    {
        var privateKey = (await _keyTokenRepository.GetByUserIdAsync(user.Id).ConfigureAwait(true)).PrivateKey;

        var accessToken = _jwtTokenHandler.GenerateToken(user, role, privateKey, 30);
        var refreshToken = _jwtTokenHandler.GenerateRefreshToken();

        await _refreshTokenRepository.CreateAsync(new RefreshToken
        {
            UserId = user.Id,
            Token = refreshToken,
            ExpiryDate = DateTime.UtcNow.AddDays(30),
            CreatedAt = DateTime.UtcNow,
            IsRevoked = false
        }).ConfigureAwait(true);

        return new TokenPairResult
        {
            AccessToken = accessToken,
            RefreshToken = refreshToken
        };
    }

    private async Task CreateAndSaveSecurityKey(User user)
    {
        var (privateKey, publicKey) = _securityKeyGenerator.GenerateKeyPair();
        await _keyTokenRepository.AddAsync(new KeyToken
        {
            UserId = user.Id,
            PublicKey = publicKey,
            PrivateKey = privateKey,
            Timestamp = DateTime.UtcNow
        }).ConfigureAwait(true);
    }

    private async Task<UserDto> MapToUserDtoAsync(User user)
    {
        var userRoleList = await _userRoleRepository.GetRolesByUserIdAsync(user.Id).ConfigureAwait(false);
        var roleNamesList = userRoleList.Select(r => r.Name).ToList();

        return new UserDto
        {
            Id = user.Id,
            FullName = user.FullName,
            Email = user.Email,
            Gender = user.Gender,
            PhoneNumber = user.PhoneNumber,
            Address = user.Address,
            City = user.City,
            Country = user.Country,
            DateOfBirth = user.DateOfBirth.ToString("MM-dd-yyyy", CultureInfo.InvariantCulture),
            Avatar = user.Avatar,
            Roles = roleNamesList
        };
    }

    private async Task RevokeAndCreateRefreshToken(RefreshToken storedRefreshToken, User user)
    {
        storedRefreshToken.IsRevoked = true;
        storedRefreshToken.RevokedAt = DateTime.UtcNow;
        await _refreshTokenRepository.UpdateAsync(storedRefreshToken).ConfigureAwait(false);

        await _refreshTokenUsedRepository.CreateAsync(new RefreshTokenUsed
        {
            UserId = user.Id,
            Token = storedRefreshToken.Token,
            UsedAt = DateTime.UtcNow,
            DeviceInfo = "Token refreshed"
        }).ConfigureAwait(false);
    }

}
