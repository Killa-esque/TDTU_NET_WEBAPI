// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using System.Collections.Generic;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Core.DTOs;
public class AmenityResult
{
    public bool IsSuccess { get; set; } // Để kiểm tra xem xử lý có thành công hay không
    public string Message { get; set; } // Thông báo cho kết quả xử lý
    public string? AmenityId { get; set; } // Id của tiện ích
    public List<string>? AmenityIds { get; set; } // Danh sách Id của tiện ích
    public AmenityDto? Amenity { get; set; } // Tiện ích trả về
    public List<AmenityDto>? Amenities { get; set; } // Danh sách tiện ích trả về
}
