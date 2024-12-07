// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs;

public class UserCreateResult
{
    public bool IsSuccess { get; set; } // Trạng thái tạo mới người dùng
    public string Message { get; set; } // Thông điệp trả về
    public UserResult NewUser { get; set; } // Thông tin người dùng đã tạo
}

