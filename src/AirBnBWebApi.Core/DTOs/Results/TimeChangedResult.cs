// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Core.DTOs;
public class TimeChangedResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string UpdatedAt { get; set; }
}
