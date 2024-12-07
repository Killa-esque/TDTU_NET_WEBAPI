// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class AmenityDto
{
    public Guid? Id { get; set; } // ID của tiện ích
    public string Name { get; set; } // Tên tiện ích
    public string Description { get; set; } // Mô tả tiện ích
    public string Icon { get; set; } // Đường dẫn icon (nếu có)
}
