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
public class LocationRepository : ILocationRepository
{
    private readonly AirBnBDbContext _context;

    public LocationRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<Location?> GetLocationByIdAsync(Guid id)
    {
        return await _context.Locations.FindAsync(id).ConfigureAwait(false);
    }

    public async Task<IEnumerable<Location>> GetAllLocationsAsync()
    {
        return await _context.Locations.ToListAsync().ConfigureAwait(false);
    }

    public async Task<Location> AddLocationAsync(Location location)
    {
        _context.Locations.Add(location);
        await _context.SaveChangesAsync().ConfigureAwait(false);
        return location;
    }

    public async Task<Location?> UpdateLocationAsync(Location location)
    {
        var existingLocation = await _context.Locations.FindAsync(location.Id).ConfigureAwait(false);
        if (existingLocation == null)
        {
            return null;
        }

        _context.Entry(existingLocation).CurrentValues.SetValues(location);
        await _context.SaveChangesAsync().ConfigureAwait(false);
        return existingLocation;
    }

    public async Task<bool> DeleteLocationAsync(Guid id)
    {
        var location = await _context.Locations.FindAsync(id).ConfigureAwait(false);
        if (location == null)
        {
            return false;
        }

        _context.Locations.Remove(location);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<IEnumerable<Property>> GetPropertyByLocationIdAsync(Guid locationId)
    {
        return await _context.Properties.Where(p => p.LocationId == locationId).ToListAsync().ConfigureAwait(false);
    }
}
