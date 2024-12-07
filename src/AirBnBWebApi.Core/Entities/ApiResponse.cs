// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.Entities;

public class ApiResponse<T>
{
    public bool Status { get; set; }           // True: Thành công, False: Lỗi
    public int StatusCode { get; set; }        // Mã trạng thái HTTP
    public string Message { get; set; }        // Thông điệp hoặc mô tả lỗi
    public T Payload { get; set; }             // Dữ liệu trả về (generic type)
    public DateTime DateTime { get; set; }     // Thời gian server trả về response
    public object Error { get; set; }          // Thông tin lỗi nếu có

    // Constructor Success
    public ApiResponse(bool status, int statusCode, string message, T payload)
    {
        Status = status;
        StatusCode = statusCode;
        Message = message;
        Payload = payload;
        DateTime = DateTime.UtcNow;
        Error = null;
    }

    // Constructor Error
    public ApiResponse(bool status, int statusCode, string message, object error)
    {
        Status = status;
        StatusCode = statusCode;
        Message = message;
        Payload = default;
        DateTime = DateTime.UtcNow;
        Error = error;
    }
}
