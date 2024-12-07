// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IPropertyImageRepository
{
    Task AddPropertyImagesAsync(IEnumerable<PropertyImage> propertyImages);
    Task UpdatePropertyImagesAsync(IEnumerable<PropertyImage> propertyImages);
    Task<IEnumerable<PropertyImage>> GetPropertyImagesByPropertyIdAsync(Guid propertyId);
    Task<PropertyImage> GetPropertyImageAsync(Guid propertyId, Guid imageId);
    Task<bool> DeletePropertyImageAsync(PropertyImage image);
}
