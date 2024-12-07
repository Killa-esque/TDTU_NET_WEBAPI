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

public class PropertyImageRepository : IPropertyImageRepository
{
    private readonly AirBnBDbContext _context;

    public PropertyImageRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task AddPropertyImagesAsync(IEnumerable<PropertyImage> propertyImages)
    {
        await _context.PropertyImages.AddRangeAsync(propertyImages).ConfigureAwait(false);
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task UpdatePropertyImagesAsync(IEnumerable<PropertyImage> propertyImages)
    {
        _context.PropertyImages.UpdateRange(propertyImages);
        await _context.SaveChangesAsync().ConfigureAwait(false);
    }

    public async Task<IEnumerable<PropertyImage>> GetPropertyImagesByPropertyIdAsync(Guid propertyId)
    {
        return await _context.PropertyImages
            .Where(pi => pi.PropertyId == propertyId)
            .ToListAsync().ConfigureAwait(false);
    }

    public async Task<PropertyImage> GetPropertyImageAsync(Guid propertyId, Guid imageId)
    {
        return await _context.PropertyImages
            .FirstOrDefaultAsync(img => img.PropertyId == propertyId && img.Id == imageId)
            .ConfigureAwait(false);
    }

    public async Task<bool> DeletePropertyImageAsync(PropertyImage image)
    {
        _context.PropertyImages.Remove(image);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }
}
