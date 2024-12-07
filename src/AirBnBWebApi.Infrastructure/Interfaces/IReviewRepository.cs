// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;

public interface IReviewRepository
{
    Task<Review> GetReviewByIdAsync(Guid reviewId);
    Task<IEnumerable<Review>> GetReviewsByPropertyIdAsync(Guid propertyId);
    Task<bool> CreateReviewAsync(Review review);
    Task<bool> UpdateReviewAsync(Review review);
    Task<bool> DeleteReviewAsync(Guid reviewId);
    Task<Review> GetReviewByUserIdAndPropertyIdAsync(Guid userId, Guid propertyId);
    // GetReviewsByHostIdAsync
    Task<IEnumerable<Review>> GetReviewsByHostIdAsync(Guid hostId);
}
