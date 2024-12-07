// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs.Requests;

public class ReservationDto
{
    public Guid? ReservationId { get; set; }
    public Guid PropertyId { get; set; }
    public Guid UserId { get; set; }
    public string GuestName { get; set; }
    public string PropertyName { get; set; }
    public string CheckInDate { get; set; }
    public string CheckOutDate { get; set; }
    public int Guests { get; set; }
    public decimal? TotalPrice { get; set; }
    public string? SpecialRequests { get; set; }
    public string? CreatedAt { get; set; }
    public string? UpdatedAt { get; set; }
}

