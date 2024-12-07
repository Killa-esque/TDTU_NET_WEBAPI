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
public class AmenityRepository : IAmenityRepository
{
    private readonly AirBnBDbContext _context;

    public AmenityRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<List<Amenity>> GetAllAmenitiesAsync()
    {
        return await _context.Amenities.ToListAsync().ConfigureAwait(false);
    }

    public async Task<Amenity> GetAmenityByIdAsync(Guid id)
    {
        return await _context.Amenities.FirstOrDefaultAsync(a => a.Id == id).ConfigureAwait(false);
    }

    public async Task<IEnumerable<Amenity>> GetPropertyAmenityByPropertyIdAsync(Guid propertyId)
    {
        return await _context.PropertyAmenities
            .Where(pa => pa.PropertyId == propertyId)
            .Select(pa => pa.Amenity)
            .ToListAsync().ConfigureAwait(false);
    }

    public async Task<bool> AddAmenityAsync(List<Amenity> amenity)
    {
        await _context.Amenities.AddRangeAsync(amenity).ConfigureAwait(false);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> UpdateAmenityAsync(Amenity amenity)
    {
        _context.Amenities.Update(amenity);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> DeleteAmenityAsync(Guid id)
    {
        var amenity = await _context.Amenities.FindAsync(id).ConfigureAwait(false);
        if (amenity == null)
        {
            return false;
        }

        _context.Amenities.Remove(amenity);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }
}
