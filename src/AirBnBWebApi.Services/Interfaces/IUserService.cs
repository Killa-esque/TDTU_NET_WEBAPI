// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Services.Interfaces;

public interface IUserService
{
    Task<UserResult> GetAllUsersAsync(int? pageNumber, int? pageSize);
    Task<UserResult> CreateUserAsync(UserCreateDto userCreateDto);
    Task<UserResult> DeleteUserAsync(Guid id);
    Task<UserResult> GetUserByIdAsync(Guid id);
    Task<UserResult> GetUserByEmailAsync(string email);
    Task<UserResult> UpdateUserAsync(Guid id, UserDto updatedUser);
    Task<UserResult> PatchUserAsync(Guid userId, UserUpdateDto userPatchDto);
    Task<UserResult> UpdateUserAsAdminAsync(Guid userId, AdminUpdateUserDto updatedUser);
    Task<UserSearchResult> SearchUsersAsync(string query);
    Task<UserResult> UpdateAvatarUrlAsync(Guid userId, string avatarUrl);
    Task<string> GeneratePasswordResetTokenAsync(Guid userId, string userEmail, string privateKey);
    Task<ServiceResult> ResetPasswordRequestAsync(string email);
    Task<ServiceResult> ResetPasswordAsync(Guid userId, string newPassword);
    Task<ServiceResult> SendVerificationEmailAsync(SendVerificationDto sendVerificationDto);
    Task<ServiceResult> VerifyEmailAsync(VerifyEmailDto verifyEmailDto);
    Task<ServiceResult> CheckPasswordAsync(Guid userId, string password);
    Task<TimeChangedResult> GetTimeChangedPasswordAsync(Guid userId);
    // GetBookingHistoryAsync
    Task<UserResult> GetBookingHistoryAsync(Guid userId);
    // GetAllRoles
    Task<UserResult> GetAllRoles();

}

