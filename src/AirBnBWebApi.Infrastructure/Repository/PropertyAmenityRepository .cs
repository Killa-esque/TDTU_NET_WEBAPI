// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AirBnBWebApi.Infrastructure.Repository;
public class PropertyAmenityRepository : IPropertyAmenityRepository
{
    private readonly AirBnBDbContext _context;

    public PropertyAmenityRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<List<PropertyAmenity>> GetByPropertyIdAsync(Guid propertyId)
    {
        return await _context.PropertyAmenities
            .Where(pa => pa.PropertyId == propertyId)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<bool> AddAsync(PropertyAmenity propertyAmenity)
    {
        await _context.PropertyAmenities.AddAsync(propertyAmenity).ConfigureAwait(false);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> DeleteAsync(Guid propertyId, Guid amenityId)
    {
        var propertyAmenity = await _context.PropertyAmenities
            .FirstOrDefaultAsync(pa => pa.PropertyId == propertyId && pa.AmenityId == amenityId).ConfigureAwait(false);

        if (propertyAmenity == null)
        {
            return false;
        }

        _context.PropertyAmenities.Remove(propertyAmenity);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }
}

