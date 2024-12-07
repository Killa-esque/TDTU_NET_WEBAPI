// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Core.DTOs;
public class AuthResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? UserId { get; set; }
    public UserDto? User { get; set; }
    public TokenPairResult? Token { get; set; }
    public RefreshTokenResult? refreshTokenResult { get; set; }
}
