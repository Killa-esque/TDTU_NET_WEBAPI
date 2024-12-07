// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IPropertyRepository
{
    Task<IEnumerable<Property>> GetAllPropertiesAsync();
    Task<Property> GetPropertyByIdAsync(Guid propertyId);
    Task<IEnumerable<Property>> SearchPropertiesAsync(PropertySearchDto propertySearchDto);
    Task<bool> AddPropertyAsync(Property property);
    Task<bool> UpdatePropertyAsync(Property property);
    Task<bool> DeletePropertyAsync(Guid propertyId);
    Task<IEnumerable<Property>> GetPropertiesByHostIdAsync(Guid hostId);
    Task<IEnumerable<Property>> GetPropertiesByLocationIdAsync(Guid locationId);
    Task<IEnumerable<Property>> GetPropertiesByPriceRangeAsync(decimal minPrice, decimal maxPrice);
    Task<IEnumerable<Property>> GetPropertiesByTypeAsync(PropertyTypeEnum propertyType);
    Task<IEnumerable<Property>> GetPropertiesByStatusAsync(PropertyStatusEnum propertyStatus);
    Task<List<Amenity>> GetAmenitiesByPropertyIdAsync(Guid propertyId);
    Task<List<Amenity>> GetAmenitiesBySlugAsync(string slug);
    Task<bool> AddAmenitiesToPropertyAsync(List<PropertyAmenity> propertyAmenities);
    Task<bool> RemoveAmenityFromPropertyAsync(Guid propertyId, Guid amenityId);
    Task<User> GetHostByPropertyIdAsync(Guid propertyId);
    Task<bool> CheckPropertyAvailabilityAsync(Guid propertyId, DateTime checkInDate, DateTime checkOutDate);
    Task<bool> IsSlugExistsAsync(string slug);
    Task<Property> GetPropertyBySlugAsync(string slug);
    // UpdateAmenitiesForPropertyAsync
    Task<bool> UpdateAmenitiesForPropertyAsync(Guid propertyId, List<PropertyAmenity> propertyAmenities);
    // GetAmenitiesBySlugAsync

}

