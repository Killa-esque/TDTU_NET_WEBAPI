// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.IdentityModel.Tokens.Jwt;
using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Service.Interfaces;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly IUserService _userService;
    private readonly IJwtTokenHandler _jwtTokenHandler;
    private readonly IKeyTokenService _keyTokenService;

    public AuthController(IAuthService authService, IUserService userService, IJwtTokenHandler jwtTokenHandler, IKeyTokenService keyTokenService)
    {
        _authService = authService;
        _userService = userService;
        _jwtTokenHandler = jwtTokenHandler;
        _keyTokenService = keyTokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var result = await _authService.RegisterAsync(registerDto).ConfigureAwait(false);

        if (!result.IsSuccess)
        {
            return ResponseHelper.BadRequest(result.Message);
        }

        return ResponseHelper.Created<object>(null, result.Message);
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var result = await _authService.LoginAsync(loginDto).ConfigureAwait(false);

        if (!result.IsSuccess)
        {
            return ResponseHelper.BadRequest(result.Message);
        }

        if (result.User == null)
        {
            return ResponseHelper.BadRequest("User information is missing.");
        }

        return ResponseHelper.Success(new
        {
            result.User.Id,
            result.User.Email,
            result.User.FullName,
            result.User.PhoneNumber,
            result.User.Roles,
            result.User.Avatar,
            result.User.DateOfBirth,
            result.User.City,
            result.User.Country,
            result.User.Address,
            result.User.Gender,
            Token = result.Token
        }, result.Message);
    }

    [HttpPost("refresh-token")]
    public async Task<IActionResult> RefreshToken([FromBody] RefreshTokenDto refreshTokenDto)
    {
        Console.WriteLine("RefreshToken >>>" + refreshTokenDto.RefreshToken);
        var result = await _authService.RefreshTokenAsync(refreshTokenDto).ConfigureAwait(false);

        if (!result.IsSuccess)
        {
            return ResponseHelper.BadRequest(result.Message);
        }

        return ResponseHelper.Success(result.Token, result.Message);
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ResetPasswordRequest([FromBody] ForgotPasswordDto forgotPasswordDto)
    {
        if (string.IsNullOrEmpty(forgotPasswordDto.Email))
        {
            return ResponseHelper.BadRequest("Email is required.");
        }

        var result = await _userService.ResetPasswordRequestAsync(forgotPasswordDto.Email).ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Success<object>(null, result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword([FromBody] ResetPasswordDto resetDto)
    {
        if (resetDto.NewPassword != resetDto.ConfirmPassword)
        {
            return ResponseHelper.BadRequest("Password confirmation does not match.");
        }

        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(resetDto.Token);
        var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == JwtRegisteredClaimNames.Sub);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid token.");
        }

        var userPublicKey = await _keyTokenService.GetUserPublicKeyAsync(userId).ConfigureAwait(false);
        var claimsPrincipal = _jwtTokenHandler.ValidateResetPasswordToken(resetDto.Token, userPublicKey.publicKey);

        if (claimsPrincipal == null)
        {
            return ResponseHelper.BadRequest("Invalid or expired token.");
        }

        var result = await _userService.ResetPasswordAsync(userId, resetDto.NewPassword).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success<object>(null, "Password reset successfully.") : ResponseHelper.BadRequest(result.Message);
    }
}
