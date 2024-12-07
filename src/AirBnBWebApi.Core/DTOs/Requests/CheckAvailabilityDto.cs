// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class CheckAvailabilityDto
{
    public Guid PropertyId { get; set; } // ID của phòng
    public DateTime StartDate { get; set; } // Ngày bắt đầu
    public DateTime EndDate { get; set; } // Ngày kết thúc
    public int Guests { get; set; } // Số lượng khách
}
