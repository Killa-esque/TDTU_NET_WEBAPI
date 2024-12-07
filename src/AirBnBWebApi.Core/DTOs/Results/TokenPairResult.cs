// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Core.DTOs;
public class TokenPairResult
{
    public string AccessToken { get; set; }            // JWT
    public string RefreshToken { get; set; }     // Refresh token
}
