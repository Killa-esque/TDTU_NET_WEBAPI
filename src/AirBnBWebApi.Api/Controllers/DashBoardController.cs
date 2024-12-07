// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class DashBoardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashBoardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    // Phương thức GET trả về dữ liệu thống kê
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetDashboardData()
    {
        var result = await _dashboardService.GetDashboardDataAsync().ConfigureAwait(false);
        return result != null
            ? ResponseHelper.Success(result.DashboardData, "Dashboard data retrieved successfully")
            : ResponseHelper.NotFound("No data found");
    }

    // Recent Booking
    [HttpGet("recent-booking")]
    [Authorize]
    public async Task<IActionResult> GetRecentBooking()
    {
        var result = await _dashboardService.GetRecentBookingsAsync().ConfigureAwait(false);
        return result != null
            ? ResponseHelper.Success(result.Reservations, "Recent booking retrieved successfully")
            : ResponseHelper.NotFound("No data found");
    }
}
