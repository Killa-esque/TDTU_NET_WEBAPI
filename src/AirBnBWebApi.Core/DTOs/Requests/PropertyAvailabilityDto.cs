// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using System;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class PropertyAvailabilityDto
{
    public DateTime Date { get; set; }
    public bool IsAvailable { get; set; }
}
