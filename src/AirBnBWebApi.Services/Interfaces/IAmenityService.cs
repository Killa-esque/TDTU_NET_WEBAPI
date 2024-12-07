// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Services.Interfaces;
public interface IAmenityService
{
    Task<AmenityResult> GetAllAmenitiesAsync();
    Task<AmenityResult> GetAmenityByIdAsync(Guid id);
    Task<AmenityResult> AddAmenityAsync(List<AmenityDto> amenityData);
    Task<AmenityResult> UpdateAmenityAsync(Guid id, AmenityDto amenityData);
    Task<AmenityResult> DeleteAmenityAsync(Guid id);
    Task<AmenityResult> GetAmenityByPropertyIdAsync(Guid propertyId);
}
