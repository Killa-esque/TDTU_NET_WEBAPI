// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Threading.Tasks;
using System;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace AirBnBWebApi.Infrastructure.Repository;
public class HostRepository : IHostRepository
{
    private readonly AirBnBDbContext _context;

    public HostRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<int> GetTotalPropertiesAsync(Guid hostId)
    {
        return await _context.Properties
            .CountAsync(p => p.HostId == hostId)
            .ConfigureAwait(false);
    }

    public async Task<int> GetTotalReviewsAsync(Guid hostId)
    {
        return await _context.Reviews
            .Where(r => r.Property.HostId == hostId)
            .CountAsync()
            .ConfigureAwait(false);
    }

    public async Task<double?> GetAverageRatingAsync(Guid hostId)
    {
        return await _context.Reviews
            .Where(r => r.Property.HostId == hostId)
            .AverageAsync(r => (double?)r.Rating)
            .ConfigureAwait(false);
    }

    public async Task<int> GetHostExperienceAsync(Guid hostId)
    {
        var host = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == hostId)
            .ConfigureAwait(false) ?? throw new InvalidOperationException("Host not found");
        return DateTime.UtcNow.Year - host.CreatedAt.Year;
    }

    // public async Task<int> GetTotalGuestsAsync(Guid hostId)
    // {
    //     return await _context.Ress
    //         .Where(b => b.Property.HostId == hostId)
    //         .SumAsync(b => b.Guests)
    //         .ConfigureAwait(false);
    // }
}
