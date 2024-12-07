// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs.Requests;

public class LocationDto
{
    public Guid Id { get; set; }
    public string City { get; set; }
    public string Country { get; set; }
    public double? Latitude { get; set; }
    public double? Longitude { get; set; }
    public string? GoogleMapsUrl { get; set; }
    public string? ImageUrl { get; set; }
}

