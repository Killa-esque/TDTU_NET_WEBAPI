// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.DTOs;
public class ReservationResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? ReservationId { get; set; }
    public ReservationDto? Reservation { get; set; }
    public List<ReservationDto>? Reservations { get; set; }
    public ReservationStatusEnum? ReservationStatus { get; set; }
    public AvailabilityResponseDto? Availability { get; set; }
    public RevenueDto? Revenue { get; set; }

}

public class AvailabilityResponseDto
{
    public string PropertyId { get; set; }
    public bool IsAvailable { get; set; } // Phòng có trống không
    public decimal TotalPrice { get; set; } // Tổng giá
}

