// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using Microsoft.AspNetCore.Mvc;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Core.DTOs.Requests;
using System.Security.Claims;

namespace AirBnBWebApi.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly IWebHostEnvironment _environment;
    public UserController(IUserService userService, IWebHostEnvironment environment, IConfiguration configuration)
    {
        _userService = userService;
        _environment = environment;
    }

    [HttpGet]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> GetAllUsers([FromQuery] int? pageNumber, [FromQuery] int? pageSize)
    {
        // Check pageNumber and pageSize are null
        var result = await _userService.GetAllUsersAsync(pageNumber, pageSize).ConfigureAwait(false);
        return result != null ? ResponseHelper.Success(result.PaginatedUsers, result.Message) : ResponseHelper.NotFound();
    }

    [HttpPost]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> CreateUser([FromBody] UserCreateDto userCreateDto)
    {
        var result = await _userService.CreateUserAsync(userCreateDto).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Created(result.UserId ?? string.Empty, result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpDelete("{id}")]
    [Authorize]
    public async Task<IActionResult> DeleteUser([FromRoute] Guid userId)
    {
        Console.WriteLine("Delete user >>" + userId.ToString());
        var result = await _userService.DeleteUserAsync(userId).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success<object>(result.UserId ?? string.Empty, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpGet("{id}")]
    [Authorize]
    public async Task<IActionResult> GetUserById([FromRoute] Guid id)
    {
        var result = await _userService.GetUserByIdAsync(id).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.User, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpPut("update-user/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateUserAsAdmin([FromRoute] Guid userId, [FromBody] AdminUpdateUserDto adminUpdateUserDto)
    {
        var result = await _userService.UpdateUserAsAdminAsync(userId, adminUpdateUserDto).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.UserId, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpDelete("delete-user/{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> DeleteUserAdmin([FromRoute] Guid id)
    {
        Console.WriteLine("Delete user >>" + id.ToString());
        var result = await _userService.DeleteUserAsync(id).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success<object>(result.UserId ?? string.Empty, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpPut]
    [Authorize]
    public async Task<IActionResult> UpdateUser([FromBody] UserDto userUpdateDto)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _userService.UpdateUserAsync(userId, userUpdateDto).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.UserId, result.Message) : ResponseHelper.NotFound(result.Message);
    }


    [HttpPatch("{id}")]
    [Authorize]
    public async Task<IActionResult> PatchUser([FromRoute] Guid id, [FromBody] UserUpdateDto userPatchDto)
    {
        if (userPatchDto == null)
        {
            return ResponseHelper.BadRequest("Invalid user data.");
        }

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        Console.WriteLine("Current user ID: " + User.IsInRole("Admin"));


        // Chỉ có admin và chính người dùng đó mới được phép update thông tin của chính mình
        if (string.IsNullOrEmpty(currentUserId) || (id.ToString() != currentUserId && !User.IsInRole("Admin")))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _userService.PatchUserAsync(id, userPatchDto).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.UserId, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [Authorize]
    [HttpPost("upload-avatar")]
    public async Task<IActionResult> UploadAvatar(IFormFile avatarFile)
    {
        Console.WriteLine("Upload avatar");
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        if (avatarFile == null || avatarFile.Length == 0)
        {
            return ResponseHelper.BadRequest("Please upload a valid image file.");
        }

        var userFolder = Path.Combine(_environment.WebRootPath, "avatars", userId.ToString());

        if (!Directory.Exists(userFolder))
        {
            Directory.CreateDirectory(userFolder);
        }

        var existingFiles = Directory.GetFiles(userFolder);
        foreach (var file in existingFiles)
        {
            System.IO.File.Delete(file); // Xóa ảnh cũ
        }

        var uniqueFileName = $"{Guid.NewGuid()}_{Path.GetFileName(avatarFile.FileName)}";
        var filePath = Path.Combine(userFolder, uniqueFileName);

        // Lưu ảnh mới
        using (var fileStream = new FileStream(filePath, FileMode.Create))
        {
            await avatarFile.CopyToAsync(fileStream).ConfigureAwait(false);
        }

        var avatarUrl = $"/avatars/{userId}/{uniqueFileName}";
        var result = await _userService.UpdateAvatarUrlAsync(userId, avatarUrl).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.UserId, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> GetCurrentUser()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        var user = await _userService.GetUserByIdAsync(Guid.Parse(userId)).ConfigureAwait(false);
        if (user == null)
        {
            return ResponseHelper.NotFound("User not found.");
        }

        return ResponseHelper.Success(user.User, "User information retrieved successfully.");
    }

    [HttpPost("send-verification-email")]
    [Authorize(Roles = "User, Host")]
    public async Task<IActionResult> ResendVerificationEmail([FromBody] SendVerificationDto sendVerificationDto)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var user = await _userService.GetUserByIdAsync(userId).ConfigureAwait(false);

        if (user == null)
        {
            return ResponseHelper.NotFound("User not found.");
        }


        if (user.User == null || user.User.Email != sendVerificationDto.Email)
        {
            return ResponseHelper.BadRequest("Invalid email.");
        }

        var result = await _userService.SendVerificationEmailAsync(sendVerificationDto).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success<object>(null, result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpPost("verify-email")]
    [Authorize(Roles = "User, Host")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var user = await _userService.GetUserByIdAsync(userId).ConfigureAwait(false);

        if (user == null)
        {
            return ResponseHelper.NotFound("User not found.");
        }

        if (user.User == null || user.User.Email != verifyEmailDto.Email)
        {
            return ResponseHelper.BadRequest("Invalid email.");
        }

        var result = await _userService.VerifyEmailAsync(verifyEmailDto).ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Success<object>(null, result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }

    [HttpGet("search")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> SearchUsers([FromQuery] string query)
    {
        var result = await _userService.SearchUsersAsync(query).ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Success(result.Users, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    [HttpPost("update-password")]
    [Authorize]
    public async Task<IActionResult> UpdatePassword([FromBody] UpdatePasswordDto modelDto)
    {
        if (!ModelState.IsValid)
        {
            var errors = string.Join("; ", ModelState.Values
                .SelectMany(x => x.Errors)
                .Select(x => x.ErrorMessage));
            return ResponseHelper.BadRequest(errors);
        }

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var user = await _userService.GetUserByIdAsync(userId).ConfigureAwait(false);

        if (user == null)
        {
            return ResponseHelper.NotFound("User not found.");
        }

        // Check if current password is valid
        var isCurrentPasswordValid = await _userService.CheckPasswordAsync(userId, modelDto.CurrentPassword).ConfigureAwait(false);

        if (!isCurrentPasswordValid.IsSuccess)
        {
            return ResponseHelper.BadRequest(isCurrentPasswordValid.Message);
        }

        var result = await _userService.ResetPasswordAsync(userId, modelDto.NewPassword).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    // Get Time Has Changed Password By User
    [HttpGet("time-changed-password")]
    [Authorize]
    public async Task<IActionResult> GetTimeChangedPassword()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _userService.GetTimeChangedPasswordAsync(userId).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.UpdatedAt, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpGet("booking-history")]
    [Authorize]
    public async Task<IActionResult> GetBookingHistory()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _userService.GetBookingHistoryAsync(userId).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.PropertyReservation, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpGet("roles")]
    [Authorize(Policy = "AdminPolicy")]
    public async Task<IActionResult> GetAllRoles()
    {
        var result = await _userService.GetAllRoles().ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.Roles, result.Message) : ResponseHelper.NotFound(result.Message);
    }

}

