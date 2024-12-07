// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Core.DTOs.Requests;
public class VerifyEmailDto
{
    public string Email { get; set; }
    public string VerificationCode { get; set; }
}
