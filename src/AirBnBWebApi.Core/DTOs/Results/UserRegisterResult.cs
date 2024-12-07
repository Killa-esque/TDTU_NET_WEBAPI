// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs;

public class UserRegisterResult
{
    public string Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }          // Số điện thoại liên lạc
    public bool Gender { get; set; }                  // Giới tính (Nam: true, Nữ: false)
    public string DateOfBirth { get; set; }         // Ngày sinh
    public List<string> Roles { get; set; }            // Vai trò của người dùng (User, Host, Admin)
    public string CreatedAt { get; set; }           // Thời gian tạo tài khoản
    public TokenPairResult Token { get; set; }
}
