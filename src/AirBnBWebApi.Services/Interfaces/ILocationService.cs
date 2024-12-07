// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Services.Interfaces;
public interface ILocationService
{
    Task<LocationResult> GetLocationByIdAsync(Guid id);
    Task<LocationResult> GetAllLocationsAsync();
    Task<LocationResult> AddLocationAsync(LocationDto locationDto);
    Task<LocationResult> UpdateLocationAsync(Guid id, LocationDto locationDto);
    Task<LocationResult> DeleteLocationAsync(Guid id);
    Task<LocationResult> UpdateLocationImageUrlAsync(Guid locationId, string imageUrl);
}
