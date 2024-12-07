// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Core.DTOs.Requests;

public class RefreshTokenDto
{
    public string RefreshToken { get; set; }
    public string Role { get; set; }
}
