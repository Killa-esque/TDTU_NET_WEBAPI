// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Core.DTOs;

public class UserGetResult
{
    public bool IsSuccess { get; set; } // Trạng thái tạo mới người dùng
    public string Message { get; set; } // Thông điệp trả về
    public UserResult User { get; set; } // Thông tin người dùng đã tạo
}

