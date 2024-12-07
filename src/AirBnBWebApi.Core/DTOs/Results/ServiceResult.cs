// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Core.DTOs;
public class ServiceResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }

    public static ServiceResult Success(string message = "") => new ServiceResult { IsSuccess = true, Message = message };
    public static ServiceResult Failed(string message) => new ServiceResult { IsSuccess = false, Message = message };
}
