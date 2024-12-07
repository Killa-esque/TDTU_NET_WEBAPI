// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Services.Interfaces;
public interface IPropertyService
{
    Task<PropertyResult> GetAllPropertiesAsync();
    Task<PropertyResult> GetPropertyByIdAsync(Guid propertyId);
    Task<PropertyResult> SearchPropertiesAsync(PropertySearchDto propertySearchDto);
    Task<PropertyResult> AddPropertyAsync(PropertyDto newProperty);
    // Task<PropertyResult> UpdatePropertyAsync(Guid propertyId, PropertyDto updatedProperty);
    Task<PropertyResult> DeletePropertyAsync(Guid propertyId);
    Task<PropertyResult> GetPropertiesByHostIdAsync(Guid hostId);
    Task<PropertyResult> GetPropertiesByLocationIdAsync(Guid locationId);
    Task<PropertyResult> GetPropertiesByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    Task<PropertyResult> GetPropertiesByTypeAsync(PropertyTypeEnum propertyType);
    Task<PropertyResult> GetPropertiesByStatusAsync(PropertyStatusEnum propertyStatus);
    Task<PropertyResult> PublishPropertyAsync(string slug);
    Task<AmenityResult> GetAmenitiesByPropertyIdAsync(Guid propertyId);
    Task<AmenityResult> GetAmenitiesByPropertySlugAsync(string slug);
    Task<AmenityResult> AddAmenitiesToPropertyAsync(Guid propertyId, List<Guid> amenityIds);
    Task<AmenityResult> RemoveAmenityFromPropertyAsync(Guid propertyId, Guid amenityId);
    Task<HostResult> GetHostDetailsByPropertyIdAsync(Guid propertyId);
    Task<PropertyResult> GetPropertyBySlugAsync(string slug);
    // PatchPropertyAsync
    Task<PropertyResult> PatchPropertyAsync(string slud, UpdatePropertyDto propertyDto);
    // UpdateAmenitiesForPropertyAsync
    Task<PropertyResult> UpdateAmenitiesForPropertyAsync(string slug, List<Guid> amenityIds);
    // Task<PropertyResult> CheckPropertyAvailabilityAsync(Guid propertyId, DateTime checkInDate, DateTime checkOutDate);
}
