
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class PropertyReservationDto
{
    public Guid PropertyId { get; set; }
    public Guid UserId { get; set; }
    public Guid ReservationId { get; set; }
    public List<string> PropertyImageUrls { get; set; }
    public string PropertyName { get; set; }
    public int Guests { get; set; }
    public decimal PropertyPricePerNight { get; set; }
    public decimal TotalPrice { get; set; }
    public string BookingDate { get; set; }
    public string CheckInDate { get; set; }
    public string CheckOutDate { get; set; }
    public string Status { get; set; }
}
