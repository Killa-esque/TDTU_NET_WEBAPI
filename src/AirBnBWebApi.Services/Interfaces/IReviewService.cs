// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Services.Interfaces;

public interface IReviewService
{
    Task<ReviewResult> GetReviewByIdAsync(Guid reviewId);
    Task<ReviewResult> GetReviewsByPropertyIdAsync(Guid propertyId);
    Task<ReviewResult> CreateReviewAsync(ReviewDto reviewDto);
    Task<ReviewResult> UpdateReviewAsync(Guid reviewId, ReviewDto reviewDto);
    Task<ReviewResult> DeleteReviewAsync(Guid reviewId);
    Task<ReviewResult> GetReviewsByHostIdAsync(Guid hostId);
    Task<ReviewResult> GetAnalyticsByHostId(Guid hostId);
}
