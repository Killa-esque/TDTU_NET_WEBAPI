// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs.Requests;

public class HostDto
{
    public Guid Id { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public string Avatar { get; set; }
    public bool Gender { get; set; }
    public decimal Experience { get; set; }
    public decimal ResponseRate { get; set; }
    public int TotalProperties { get; set; }
    public int TotalReviews { get; set; }
    // public int TotalGuests { get; set; }
    // public int TotalBookings { get; set; }
    public double AverageRating { get; set; }
}

