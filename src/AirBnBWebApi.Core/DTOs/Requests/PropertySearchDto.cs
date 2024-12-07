// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class PropertySearchDto
{
    public Guid? LocationId { get; set; }
    public int? GuestCount { get; set; }
    public decimal? MinPrice { get; set; }
    public decimal? MaxPrice { get; set; }
    public List<Guid>? Amenities { get; set; } = new();
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public int? Bathrooms { get; set; }
    public int? Bedrooms { get; set; }
}

