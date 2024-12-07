// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IAmenityRepository
{
    Task<List<Amenity>> GetAllAmenitiesAsync();
    Task<Amenity> GetAmenityByIdAsync(Guid id);
    Task<bool> AddAmenityAsync(List<Amenity> amenity);
    Task<bool> UpdateAmenityAsync(Amenity amenity);
    Task<bool> DeleteAmenityAsync(Guid id);
    Task<IEnumerable<Amenity>> GetPropertyAmenityByPropertyIdAsync(Guid propertyId);
}
