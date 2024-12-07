// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Core.Enums;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Infrastructure.Redis;
using AirBnBWebApi.Service.Interfaces;
using AirBnBWebApi.Services.Helper;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;

namespace AirBnBWebApi.Services.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IRoleRepository _roleRepository;
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IUserRolesService _userRoleService;
    private readonly IJwtTokenHandler _jwtTokenHandler;
    private readonly IRedisService _redisService;
    private readonly EmailHelper _emailHelper;
    private readonly IKeyTokenService _keyTokenService;
    private readonly IConfiguration _configuration;
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyImageRepository _propertyImageRepository;

    public UserService(IUserRepository userRepository, IRoleRepository roleRepository, IUserRoleRepository userRoleRepository, IUserRolesService userRoleService, IJwtTokenHandler jwtTokenHandler, IRedisService redisService, EmailHelper emailHelper, IKeyTokenService keyTokenService, IConfiguration configuration, IReservationRepository reservationRepository, IPropertyImageRepository propertyImageRepository)
    {
        _userRepository = userRepository;
        _roleRepository = roleRepository;
        _userRoleRepository = userRoleRepository;
        _userRoleService = userRoleService;
        _jwtTokenHandler = jwtTokenHandler;
        _redisService = redisService;
        _emailHelper = emailHelper;
        _keyTokenService = keyTokenService;
        _configuration = configuration;
        _reservationRepository = reservationRepository;
        _propertyImageRepository = propertyImageRepository;
    }

    public async Task<UserResult> CreateUserAsync(UserCreateDto userCreateDto)
    {
        try
        {
            var passwordHash = BCrypt.Net.BCrypt.HashPassword(userCreateDto.Password);
            userCreateDto.Password = passwordHash;

            var isUserExist = await _userRepository.GetByEmailAsync(userCreateDto.Email).ConfigureAwait(false);

            if (isUserExist != null)
            {
                return new UserResult
                {
                    IsSuccess = false,
                    Message = "Email already exists."
                };
            }

            var roleEntities = new List<Role>();

            foreach (var roleId in userCreateDto.Roles)
            {
                var isGuid = Guid.TryParse(roleId, out var guidRoleId);

                var roleEntity = await _roleRepository.GetByIdAsync(guidRoleId).ConfigureAwait(false);
                if (roleEntity == null)
                {
                    throw new ArgumentException("Some roles are invalid or do not exist.");
                }

                roleEntities.Add(roleEntity);
            }

            if (roleEntities == null || roleEntities.Count == 0)
            {
                throw new ArgumentException("Some roles are invalid or do not exist.");
            }

            Console.WriteLine("Email: " + userCreateDto.Email);

            var user = new User
            {
                FullName = userCreateDto.FullName,
                Email = userCreateDto.Email,
                PasswordHash = userCreateDto.Password,
                PhoneNumber = userCreateDto.PhoneNumber,
                Address = userCreateDto.Address,
                City = userCreateDto.City,
                Country = userCreateDto.Country,
                DateOfBirth = DateTime.ParseExact(userCreateDto.DateOfBirth, new string[] { "MM.dd.yyyy", "MM-dd-yyyy", "MM/dd/yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None),
                Gender = userCreateDto.Gender,
                CreatedAt = DateTime.UtcNow,
                IsDeleted = false,
                IsEmailVerified = false

            };

            var newUser = await _userRepository.CreateAsync(user).ConfigureAwait(false);

            foreach (var role in roleEntities)
            {
                await _userRoleRepository.CreateAsync(new UserRole
                {
                    UserId = newUser.Id,
                    RoleId = role.Id
                }).ConfigureAwait(false);
            }

            return new UserResult
            {
                IsSuccess = true,
                Message = "User created successfully."
            };
        }
        catch (Exception ex)
        {
            // Log the error (can use your logging framework like Serilog, NLog, etc.)
            Console.WriteLine($"Error: {ex.Message}");
            Console.WriteLine($"Stack Trace: {ex.StackTrace}");

            return new UserResult
            {
                IsSuccess = false,
                Message = "An error occurred while creating the user. Please try again later."
            };
        }
    }

    public async Task<UserResult> GetUserByEmailAsync(string email)
    {
        var user = await _userRepository.GetByEmailAsync(email).ConfigureAwait(false);

        if (user == null)
        {
            return null;
        }

        return new UserResult
        {
            IsSuccess = true,
            Message = "User retrieved successfully.",
            User = await ConvertToDtoAsync(user).ConfigureAwait(false)
        };
    }

    public async Task<UserResult> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);

        Console.WriteLine("User: " + user.Id.ToString());

        if (user == null)
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "User not found."
            };
        }

        return new UserResult
        {
            IsSuccess = true,
            Message = "User retrieved successfully.",
            User = await ConvertToDtoAsync(user).ConfigureAwait(false)
        };
    }

    public async Task<UserResult> UpdateUserAsync(Guid userId, UserDto userDto)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);
        if (user == null)
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "User not found."
            };
        }

        // Check email
        if (!string.IsNullOrEmpty(userDto.Email) && userDto.Email != user.Email)
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "Your email is invalid.",
                UserId = null
            };
        }

        user.FullName = userDto.FullName;
        user.PhoneNumber = userDto.PhoneNumber;
        user.Address = userDto.Address;
        user.City = userDto.City;
        user.Country = userDto.Country;
        user.DateOfBirth = DateTime.ParseExact(userDto.DateOfBirth, new string[] { "MM.dd.yyyy", "MM-dd-yyyy", "MM/dd/yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None);
        user.Gender = userDto.Gender;
        user.UpdatedAt = DateTime.UtcNow;

        var updatedUser = await _userRepository.UpdateAsync(user).ConfigureAwait(false);

        if (updatedUser == null)
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "User update failed.",
            };
        }

        return new UserResult
        {
            IsSuccess = true,
            Message = "User updated successfully.",
            UserId = updatedUser.Id.ToString()
        };
    }

    public async Task<UserResult> PatchUserAsync(Guid userId, UserUpdateDto userPatchDto)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);

        if (user == null)
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "User not found."
            };
        }

        // Update only provided fields
        if (!string.IsNullOrEmpty(userPatchDto.FullName))
        {
            user.FullName = userPatchDto.FullName;
        }

        if (!string.IsNullOrEmpty(userPatchDto.PhoneNumber))
        {
            user.PhoneNumber = userPatchDto.PhoneNumber;
        }

        if (!string.IsNullOrEmpty(userPatchDto.Address))
        {
            user.Address = userPatchDto.Address;
        }

        if (!string.IsNullOrEmpty(userPatchDto.City))
        {
            user.City = userPatchDto.City;
        }

        if (!string.IsNullOrEmpty(userPatchDto.Country))
        {
            user.Country = userPatchDto.Country;
        }

        if (userPatchDto.Gender != null)
        {
            user.Gender = userPatchDto.Gender ?? default;
        }

        // AccountLockedUntil
        // if (!string.IsNullOrEmpty(userPatchDto.AccountLockedUntil))
        // {
        //     if (DateTime.TryParse(userPatchDto.AccountLockedUntil, out var lockedUntil))
        //     {
        //         user.AccountLockedUntil = lockedUntil;
        //     }
        //     else
        //     {
        //         return new UserResult
        //         {
        //             IsSuccess = false,
        //             Message = "Invalid date format for AccountLockedUntil. Use MM-dd-yyyy."
        //         };
        //     }
        // }

        if (!string.IsNullOrEmpty(userPatchDto.DateOfBirth))
        {
            if (DateTime.TryParseExact(
                    userPatchDto.DateOfBirth,
                    "MM-dd-yyyy",
                    CultureInfo.InvariantCulture,
                    DateTimeStyles.None,
                    out var parsedDate))
            {
                user.DateOfBirth = parsedDate;
            }
            else
            {
                return new UserResult
                {
                    IsSuccess = false,
                    Message = "Invalid date format for DateOfBirth. Use MM-dd-yyyy."
                };
            }
        }



        user.UpdatedAt = DateTime.UtcNow;

        var updatedUser = await _userRepository.UpdateAsync(user).ConfigureAwait(false);

        if (updatedUser == null)
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "User update failed."
            };
        }

        return new UserResult
        {
            IsSuccess = true,
            Message = "User updated successfully.",
            UserId = updatedUser.Id.ToString()
        };
    }

    public async Task<UserResult> UpdateUserAsAdminAsync(Guid userId, AdminUpdateUserDto adminUpdateUserDto)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);
        if (user == null)
        {
            return new UserResult { IsSuccess = false, Message = "User not found." };
        }

        user.FullName = adminUpdateUserDto.FullName;
        user.Email = user.Email;
        user.PhoneNumber = adminUpdateUserDto.PhoneNumber;
        user.DateOfBirth = DateTime.ParseExact(adminUpdateUserDto.DateOfBirth, new string[] { "MM.dd.yyyy", "MM-dd-yyyy", "MM/dd/yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None);
        user.Address = adminUpdateUserDto.Address;
        user.City = adminUpdateUserDto.City;
        user.Country = adminUpdateUserDto.Country;

        if (adminUpdateUserDto.AccountLockedUntil != null && DateTime.TryParse(adminUpdateUserDto.AccountLockedUntil, out var lockedUntil))
        {
            user.AccountLockedUntil = lockedUntil;
        }

        user.UpdatedAt = DateTime.UtcNow;

        if (adminUpdateUserDto.Roles != null && adminUpdateUserDto.Roles.Any())
        {
            var isUpdatedSuccess = await _userRoleService.UpdateRolesForUserAsync(userId, adminUpdateUserDto.Roles).ConfigureAwait(false);

            if (!isUpdatedSuccess)
            {
                return new UserResult { IsSuccess = false, Message = "User roles update failed." };
            }
        }

        var updatedUser = await _userRepository.UpdateAsync(user).ConfigureAwait(false);

        if (updatedUser == null)
        {
            return new UserResult { IsSuccess = false, Message = "User update failed." };
        }

        return new UserResult { IsSuccess = true, Message = "User updated successfully.", UserId = updatedUser.Id.ToString() };

    }

    public async Task<UserResult> DeleteUserAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);
        if (user == null)
        {
            return new UserResult { IsSuccess = false, Message = "User not found." };
        }

        user.IsDeleted = true;
        await _userRepository.UpdateAsync(user).ConfigureAwait(false);

        return new UserResult { IsSuccess = true, Message = "User deleted successfully.", UserId = user.Id.ToString() };
    }

    public async Task<UserResult> UpdateAvatarAsync(Guid userId, string avatarUrl)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);
        if (user == null)
        {
            return new UserResult { IsSuccess = false, Message = "User not found." };
        }

        user.Avatar = avatarUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _userRepository.UpdateAsync(user).ConfigureAwait(false);
        return new UserResult
        {
            IsSuccess = true,
            Message = "Avatar updated successfully.",
            UserId = user.Id.ToString()
        };
    }

    public async Task<UserResult> GetAllUsersAsync(int? pageNumber, int? pageSize)
    {
        if (pageNumber == 0 || pageSize == 0 || pageNumber == null || pageSize == null)
        {
            var usersList = await _userRepository.GetAllAsync(0, 0).ConfigureAwait(false);

            var userResults = new List<UserDto>();
            foreach (var user in usersList)
            {
                // Lấy danh sách vai trò cho từng người dùng
                var userRoleList = await _userRoleRepository.GetRolesByUserIdAsync(user.Id).ConfigureAwait(false);
                var roleNamesList = userRoleList.Select(r => r.Name).ToList();

                userResults.Add(ConvertToDtoAsync(user).Result);
            }

            var usersResponse = new PaginatedResult<UserDto>
            {
                Items = userResults,
                TotalCount = userResults.Count,
                PageIndex = 1,
                PageSize = userResults.Count
            };

            return new UserResult
            {
                IsSuccess = true,
                Message = "All users retrieved successfully.",
                PaginatedUsers = usersResponse
            };
        }

        var users = await _userRepository.GetAllAsync(pageNumber.Value, pageSize.Value).ConfigureAwait(false);
        var totalUsersCount = await _userRepository.GetTotalCountAsync().ConfigureAwait(false);

        var userPaginatedResults = new List<UserDto>();
        foreach (var user in users)
        {
            userPaginatedResults.Add(ConvertToDtoAsync(user).Result);
        }

        var paginationResult = new PaginatedResult<UserDto>
        {
            Items = userPaginatedResults,
            TotalCount = totalUsersCount,
            PageIndex = pageNumber.Value,
            PageSize = pageSize.Value
        };

        return new UserResult
        {
            IsSuccess = true,
            Message = "Users retrieved with pagination.",
            PaginatedUsers = paginationResult
        };
    }

    public async Task<UserResult> UpdateAvatarUrlAsync(Guid userId, string avatarUrl)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);

        if (user == null)
        {
            return new UserResult { IsSuccess = false, Message = "User not found." };
        }

        user.Avatar = avatarUrl;
        user.UpdatedAt = DateTime.UtcNow;

        var updatedUser = await _userRepository.UpdateAsync(user).ConfigureAwait(false);

        if (updatedUser == null)
        {
            return new UserResult { IsSuccess = false, Message = "Failed to update avatar." };
        }

        return new UserResult
        {
            IsSuccess = true,
            Message = "Avatar updated successfully.",
            UserId = user.Id.ToString()
        };
    }

    public async Task<string> GeneratePasswordResetTokenAsync(Guid userId, string userEmail, string privateKey)
    {
        return await _jwtTokenHandler.GeneratePasswordResetTokenAsync(userId, userEmail, privateKey).ConfigureAwait(true);
    }

    public async Task<ServiceResult> ResetPasswordRequestAsync(string email)
    {
        var user = await GetUserByEmailAsync(email).ConfigureAwait(false);
        if (user == null)
        {
            return new ServiceResult { IsSuccess = false, Message = "Email is not found." };
        }

        var userPrivateKey = await _keyTokenService.GetUserPrivateKeyAsync(user.User.Id).ConfigureAwait(false);

        if (!userPrivateKey.status || string.IsNullOrEmpty(userPrivateKey.privateKey))
        {
            return new ServiceResult { IsSuccess = false, Message = "Unable to get user privsate key." };
        }

        var resetToken = await GeneratePasswordResetTokenAsync(user.User.Id, user.User.Email, userPrivateKey.privateKey).ConfigureAwait(true);

        if (string.IsNullOrEmpty(resetToken))
        {
            return new ServiceResult { IsSuccess = false, Message = "Unable to generate reset token." };
        }

        var placeholders = new Dictionary<string, string>
        {
            { "Subject", "Reset Your Password" },
            { "UserName", user.User.FullName },
            { "MessageBody", "You have requested to reset your password. Please click below to proceed." },
            { "ActionUrl", $"{_configuration["AppSettings:ClientUrl"]}/reset-password?token={resetToken}" },
            { "ActionText", "Reset Password" }
        };

        var emailContent = _emailHelper.GetEmailTemplate("StandardEmailTemplate", placeholders);
        var emailSent = await _emailHelper.SendEmailAsync(user.User.Email, "Password Reset Request", emailContent).ConfigureAwait(false);

        if (!emailSent)
        {
            return new ServiceResult { IsSuccess = false, Message = "Failed to send email." };
        }

        return new ServiceResult { IsSuccess = true, Message = "Password reset request has been sent. Please check your email." };
    }

    public async Task<ServiceResult> ResetPasswordAsync(Guid userId, string newPassword)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);
        if (user == null)
        {
            return new ServiceResult { IsSuccess = false, Message = "User not found." };
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
        await _userRepository.UpdateAsync(user).ConfigureAwait(false);

        return new ServiceResult { IsSuccess = true, Message = "Password reset successfully." };
    }

    public async Task<ServiceResult> SendVerificationEmailAsync(SendVerificationDto sendVerificationDto)
    {
        var verificationCode = GenerateVerificationCode();
        var cacheKey = $"email_verification:{sendVerificationDto.Email}";

        // Lưu mã xác nhận vào Redis với thời hạn 15 phút
        await _redisService.SetAsync(cacheKey, verificationCode, TimeSpan.FromMinutes(15)).ConfigureAwait(false);

        var placeholders = new Dictionary<string, string>
        {
            { "UserName", sendVerificationDto.Email },
            { "VerificationCode", verificationCode }
        };

        var emailContent = _emailHelper.GetEmailTemplate("VerificationEmailTemplate", placeholders);
        await _emailHelper.SendEmailAsync(sendVerificationDto.Email, "Xác nhận email của bạn", emailContent).ConfigureAwait(false);

        return new ServiceResult
        {
            IsSuccess = true,
            Message = "Verification email has been sent."
        };
    }

    public async Task<ServiceResult> VerifyEmailAsync(VerifyEmailDto verifyEmailDto)
    {
        var cacheKey = $"email_verification:{verifyEmailDto.Email}";
        var cachedCode = await _redisService.GetAsync(cacheKey).ConfigureAwait(false);

        if (cachedCode == null)
        {
            return new ServiceResult
            {
                IsSuccess = false,
                Message = "Verification code has expired or is invalid."
            };
        }

        if (cachedCode != verifyEmailDto.VerificationCode)
        {
            return new ServiceResult
            {
                IsSuccess = false,
                Message = "Invalid verification code."
            };
        }

        // Xác minh email thành công, xóa mã khỏi Redis
        await _redisService.RemoveAsync(cacheKey).ConfigureAwait(false);

        // Thực hiện cập nhật trạng thái xác minh email trong CSDL
        var user = await _userRepository.GetByEmailAsync(verifyEmailDto.Email).ConfigureAwait(false);
        user.IsEmailVerified = true;
        await _userRepository.UpdateAsync(user).ConfigureAwait(false);

        return new ServiceResult
        {
            IsSuccess = true,
            Message = "Email has been successfully verified."
        };
    }

    private static string GenerateVerificationCode()
    {
        // Sinh mã xác nhận ngẫu nhiên (ví dụ: 6 chữ số)
        return new Random().Next(100000, 999999).ToString(CultureInfo.InvariantCulture);
    }

    public async Task<UserSearchResult> SearchUsersAsync(string query)
    {
        if (string.IsNullOrWhiteSpace(query))
        {
            return new UserSearchResult
            {
                IsSuccess = false,
                Message = "Query is required.",
                Users = null
            };
        }

        var users = await _userRepository.SearchUsersAsync(query).ConfigureAwait(false);

        if (users == null || !users.Any())
        {
            return new UserSearchResult
            {
                IsSuccess = false,
                Message = "No users found.",
                Users = null
            };
        }

        var userResults = new List<UserSearchDto>();

        foreach (var user in users)
        {
            var userRoleList = await _userRoleRepository.GetRolesByUserIdAsync(user.Id).ConfigureAwait(false);
            var roleNamesList = userRoleList.Select(r => r.Name).ToList();

            userResults.Add(new UserSearchDto
            {
                Id = user.Id.ToString(),
                FullName = user.FullName,
                Email = user.Email,
                PhoneNumber = user.PhoneNumber,
                Address = user.Address,
                City = user.City,
                Country = user.Country,
                DateOfBirth = user.DateOfBirth.ToString("MM-dd-yyyy", CultureInfo.InvariantCulture),
                Roles = roleNamesList
            });
        }

        return new UserSearchResult
        {
            IsSuccess = true,
            Message = "Users found.",
            Users = userResults
        };
    }

    public async Task<ServiceResult> CheckPasswordAsync(Guid userId, string password)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);
        if (user == null)
        {
            return new ServiceResult { IsSuccess = false, Message = "User not found." };
        }

        if (!BCrypt.Net.BCrypt.Verify(password, user.PasswordHash))
        {
            return new ServiceResult { IsSuccess = false, Message = "Invalid password." };
        }

        return new ServiceResult { IsSuccess = true, Message = "Password is correct." };
    }

    public async Task<TimeChangedResult> GetTimeChangedPasswordAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId).ConfigureAwait(false);

        if (user == null)
        {
            return new TimeChangedResult
            {
                IsSuccess = false,
                Message = "User not found."
            };
        }

        return new TimeChangedResult
        {
            IsSuccess = true,
            Message = "Time changed password retrieved successfully.",
            // Trả về thời gian cập nhật mật khẩu cuối cùng có cả phút giây
            UpdatedAt = user.UpdatedAt.ToString("MM-dd-yyyy HH:mm:ss", CultureInfo.InvariantCulture)
        };
    }

    public async Task<UserResult> GetBookingHistoryAsync(Guid userId)
    {
        // Lấy các reservation mà người dùng đặt
        var reservations = await _reservationRepository.GetAllReservationByUserIdAsync(userId).ConfigureAwait(false);

        if (reservations == null || !reservations.Any())
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "No reservations found for the given user.",
                PropertyReservation = new List<PropertyReservationDto>()
            };
        }

        // Use PropertyReservationDto
        var propertyReservations = new List<PropertyReservationDto>();

        foreach (var reservation in reservations)
        {
            // Lấy propertyImage từ PropertyImage Enity
            var propertyImages = await _propertyImageRepository.GetPropertyImagesByPropertyIdAsync(reservation.PropertyId).ConfigureAwait(false);


            propertyReservations.Add(new PropertyReservationDto
            {
                ReservationId = reservation.Id,
                PropertyId = reservation.PropertyId,
                PropertyName = reservation.Property.PropertyName,
                CheckInDate = reservation.CheckInDate.ToString("MM-dd-yyyy", CultureInfo.InvariantCulture) ?? "N/A",
                CheckOutDate = reservation.CheckOutDate.ToString("MM-dd-yyyy", CultureInfo.InvariantCulture) ?? "N/A",
                TotalPrice = reservation.TotalPrice,
                Guests = reservation.Guests,
                PropertyPricePerNight = reservation.Property?.PropertyPricePerNight ?? 0,
                PropertyImageUrls = propertyImages.Select(p => p.ImageUrl).ToList(),
                Status = Enum.IsDefined(typeof(ReservationStatusEnum), reservation.Status)
                    ? Enum.GetName(typeof(ReservationStatusEnum), reservation.Status)
                    : "Unknown",
                BookingDate = reservation.CreatedAt.ToString("MM-dd-yyyy", CultureInfo.InvariantCulture),
                UserId = reservation.UserId
            });
        }

        return new UserResult
        {
            IsSuccess = true,
            Message = "Booking history retrieved successfully.",
            PropertyReservation = propertyReservations
        };
    }


    public async Task<UserResult> GetAllRoles()
    {
        var roles = await _roleRepository.GetAllAsync().ConfigureAwait(false);

        if (roles == null)
        {
            return new UserResult
            {
                IsSuccess = false,
                Message = "No roles found.",
                Roles = null
            };
        }

        var roleResults = new List<RoleDto>();

        foreach (var role in roles)
        {
            roleResults.Add(new RoleDto
            {
                Id = role.Id,
                Name = role.Name,
                Description = role.Description
            });
        }

        return new UserResult
        {
            IsSuccess = true,
            Message = "Roles retrieved successfully.",
            Roles = roleResults
        };
    }

    private async Task<UserDto> ConvertToDtoAsync(User user)
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
            IsEmailVerified = user.IsEmailVerified,
            Roles = roleNamesList
        };
    }

    // Chuyển đổi từ PropertyDto sang Property
    private static User ConvertToEntity(UserDto userDto)
    {
        return new User
        {
            Id = userDto.Id,
            FullName = userDto.FullName,
            Email = userDto.Email,
            Gender = userDto.Gender,
            PhoneNumber = userDto.PhoneNumber,
            Address = userDto.Address,
            City = userDto.City,
            Country = userDto.Country,
            DateOfBirth = DateTime.ParseExact(userDto.DateOfBirth, new string[] { "MM.dd.yyyy", "MM-dd-yyyy", "MM/dd/yyyy" }, CultureInfo.InvariantCulture, DateTimeStyles.None),
            Avatar = userDto.Avatar
        };
    }

}

