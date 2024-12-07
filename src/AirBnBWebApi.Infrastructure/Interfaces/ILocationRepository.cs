// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface ILocationRepository
{
    Task<Location?> GetLocationByIdAsync(Guid id);           // Trả về Location hoặc null nếu không tìm thấy
    Task<IEnumerable<Location>> GetAllLocationsAsync();      // Trả về danh sách Location
    Task<Location> AddLocationAsync(Location location);      // Trả về Location sau khi thêm thành công
    Task<Location?> UpdateLocationAsync(Location location);  // Trả về Location sau khi cập nhật thành công, hoặc null nếu thất bại
    Task<bool> DeleteLocationAsync(Guid id);                 // Trả về true nếu xóa thành công, false nếu thất bại
    Task<IEnumerable<Property>> GetPropertyByLocationIdAsync(Guid locationId); // Trả về Property hoặc null nếu không tìm thấy
}

