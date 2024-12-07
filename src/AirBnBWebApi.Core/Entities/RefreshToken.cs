// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.Entities;

public class RefreshToken
{
    public Guid Id { get; set; }                  // Primary key
    public Guid UserId { get; set; }              // Foreign key trỏ đến bảng User
    public string Token { get; set; }             // RefreshToken string
    public DateTime ExpiryDate { get; set; }      // Expiry date for the refresh token
    public string DeviceInfo { get; set; }        // Thông tin về thiết bị (trình duyệt, IP...)
    public bool IsRevoked { get; set; }           // Đánh dấu nếu token bị thu hồi
    public DateTime CreatedAt { get; set; }       // Thời gian tạo
    public DateTime? RevokedAt { get; set; }      // Thời gian token bị thu hồi (nếu có)

    // Navigation properties
    public virtual User User { get; set; }        // Liên kết với bảng User
}
