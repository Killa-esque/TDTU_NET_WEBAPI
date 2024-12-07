// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IPropertyAmenityRepository
{
    Task<List<PropertyAmenity>> GetByPropertyIdAsync(Guid propertyId);
    Task<bool> AddAsync(PropertyAmenity propertyAmenity);
    Task<bool> DeleteAsync(Guid propertyId, Guid amenityId);
}

