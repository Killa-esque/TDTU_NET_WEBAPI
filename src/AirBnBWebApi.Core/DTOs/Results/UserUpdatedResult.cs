// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs;

public class UserUpdateResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? UserId { get; set; }
}
