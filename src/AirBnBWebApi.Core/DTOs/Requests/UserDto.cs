// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class UserDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public bool Gender { get; set; }
    public string PhoneNumber { get; set; }
    public string DateOfBirth { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public bool? IsEmailVerified { get; set; }
    public string? Avatar { get; set; }
    public List<string> Roles { get; set; }
}

public class UserCreateDto
{
    public string Password { get; set; }

    public string FullName { get; set; }
    public string Email { get; set; }
    public bool Gender { get; set; }
    public string PhoneNumber { get; set; }
    public string DateOfBirth { get; set; }
    public string Address { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public List<string> Roles { get; set; }
}

public class UserUpdateDto
{
    public Guid? Id { get; set; }
    public string? FullName { get; set; }
    public string? Email { get; set; }
    public bool? Gender { get; set; }
    public string? PhoneNumber { get; set; }
    public string? DateOfBirth { get; set; } // Định dạng: "MM-dd-yyyy"
    public string? Address { get; set; }               // Địa chỉ liên lạc
    public string? City { get; set; }                  // Thành phố
    public string? Country { get; set; }
    public string? AccountLockedUntil { get; set; }

}

public class AdminUpdateUserDto : UserDto
{
    public string AccountLockedUntil { get; set; }
}

