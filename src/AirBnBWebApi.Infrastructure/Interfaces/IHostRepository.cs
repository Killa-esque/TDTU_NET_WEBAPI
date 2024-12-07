// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Threading.Tasks;
using System;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IHostRepository
{
    Task<int> GetTotalPropertiesAsync(Guid hostId);
    Task<int> GetTotalReviewsAsync(Guid hostId);
    Task<double?> GetAverageRatingAsync(Guid hostId);
    Task<int> GetHostExperienceAsync(Guid hostId);
    // Task<int> GetTotalGuestsAsync(Guid hostId);
    // Task<int> GetTotalBookingsAsync(Guid hostId);
}
