// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Core.DTOs.Requests;
public class DashboardDataDto
{
    public int TotalUsers { get; set; }
    public int TotalBookings { get; set; }
    public decimal TotalRevenue { get; set; }
    public int UsersComparedToLastMonth { get; set; }
    public int BookingsComparedToLastMonth { get; set; }
}
