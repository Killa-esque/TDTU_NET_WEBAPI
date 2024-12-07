// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Security.Claims;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Service.Interfaces;
public interface IJwtTokenHandler
{
    string GenerateToken(User user, string role, string privateKey, int expiryMinutes);
    string GenerateRefreshToken();
    Task<string> GeneratePasswordResetTokenAsync(Guid userId, string userEmail, string privateKey);
    ClaimsPrincipal ValidateResetPasswordToken(string token, string publicKey);
}
