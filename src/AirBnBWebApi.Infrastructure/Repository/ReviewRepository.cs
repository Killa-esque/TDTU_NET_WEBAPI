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

public class ReviewRepository : IReviewRepository
{
    private readonly AirBnBDbContext _context;

    public ReviewRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<Review> GetReviewByIdAsync(Guid reviewId)
    {
        return await _context.Reviews
            .FirstOrDefaultAsync(r => r.Id == reviewId)
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<Review>> GetReviewsByPropertyIdAsync(Guid propertyId)
    {
        return await _context.Reviews
            .Where(r => r.PropertyId == propertyId)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<bool> CreateReviewAsync(Review review)
    {
        await _context.Reviews.AddAsync(review).ConfigureAwait(false);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> UpdateReviewAsync(Review review)
    {
        _context.Reviews.Update(review);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> DeleteReviewAsync(Guid reviewId)
    {
        var review = await _context.Reviews.FindAsync(reviewId).ConfigureAwait(false);
        if (review == null)
        {
            return false;
        }

        _context.Reviews.Remove(review);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public Task<Review> GetReviewByUserIdAndPropertyIdAsync(Guid userId, Guid propertyId)
    {
        return _context.Reviews
            .FirstOrDefaultAsync(r => r.UserId == userId && r.PropertyId == propertyId);
    }

    public async Task<IEnumerable<Review>> GetReviewsByHostIdAsync(Guid hostId)
    {
        return await _context.Reviews
            .Where(r => r.Property.HostId == hostId)
            .ToListAsync()
            .ConfigureAwait(false);
    }
}
