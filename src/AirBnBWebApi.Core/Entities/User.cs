// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Core.Entities;

public class User
{
    public Guid Id { get; set; }                      // ID duy nhất của người dùng
    public string FullName { get; set; }              // Họ và tên đầy đủ
    public string Email { get; set; }                 // Email (username để đăng nhập)
    public string PasswordHash { get; set; }          // Mật khẩu đã được mã hóa
    public string PhoneNumber { get; set; }          // Số điện thoại liên lạc
    public string Address { get; set; }               // Địa chỉ liên lạc
    public string City { get; set; }                  // Thành phố
    public string Country { get; set; }               // Quốc gia
    public bool Gender { get; set; }                  // Giới tính (Nam: true, Nữ: false)
    public DateTime DateOfBirth { get; set; }         // Ngày sinh
    public string Avatar { get; set; }                // URL của ảnh đại diện
    public bool IsEmailVerified { get; set; }         // Đánh dấu nếu email đã được xác thực
    public bool IsDeleted { get; set; }               // Đánh dấu nếu tài khoản bị xóa hoặc vô hiệu hóa
    public DateTime CreatedAt { get; set; }           // Thời gian tạo tài khoản
    public DateTime UpdatedAt { get; set; }           // Thời gian cập nhật thông tin gần nhất
    public DateTime? LastLogin { get; set; }          // Lần đăng nhập cuối cùng
    public int FailedLoginAttempts { get; set; }      // Số lần đăng nhập thất bại liên tiếp
    public DateTime? AccountLockedUntil { get; set; } // Thời điểm tài khoản bị khóa tạm thời do nhiều lần đăng nhập thất bại
    // Navigation properties
    public virtual KeyToken KeyToken { get; set; }
    public virtual ICollection<RefreshToken> RefreshTokens { get; set; }
    public virtual ICollection<UserRole> UserRoles { get; set; }
    public virtual ICollection<UserMetadata> Metadata { get; set; }
    public virtual ICollection<RefreshTokenUsed> RefreshTokensUsed { get; set; }
    public virtual ICollection<Review> Reviews { get; set; }
    public virtual ICollection<Reservation> Reservations { get; set; }
}

