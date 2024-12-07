// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.Entities;

public class UserMetadata
{
    public Guid Id { get; set; }                      // ID duy nhất của metadata
    public Guid UserId { get; set; }                  // Foreign key trỏ đến User
    public string Key { get; set; }                   // Tên của metadata (ví dụ: "PreferredLanguage", "LastSearchQuery")
    public string Value { get; set; }                 // Giá trị của metadata (ví dụ: "en", "New York Apartments")
    public DateTime CreatedAt { get; set; }           // Thời gian tạo metadata
    public DateTime UpdatedAt { get; set; }           // Thời gian cập nhật metadata lần cuối

    // Navigation properties
    public virtual User User { get; set; }
}
