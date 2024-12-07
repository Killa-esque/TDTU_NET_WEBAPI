// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.DTOs;
using System.Threading.Tasks;

namespace AirBnBWebApi.Services.Interfaces;
public interface IDashboardService
{
    Task<DashBoardResult> GetDashboardDataAsync();
    Task<ReservationResult> GetRecentBookingsAsync();
}
