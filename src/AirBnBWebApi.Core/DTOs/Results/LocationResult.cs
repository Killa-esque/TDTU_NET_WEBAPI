// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Collections.Generic;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Core.DTOs;
public class LocationResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? LocationId { get; set; }
    public LocationDto? Location { get; set; }
    public List<LocationDto>? Locations { get; set; }
}
