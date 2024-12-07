// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class CreatePropertyDto
{
    public string PropertyName { get; set; }
    public string PropertyDescription { get; set; }
    public decimal PropertyPricePerNight { get; set; }
    // public string PropertyThumbnailUrl { get; set; }
    public PropertyTypeEnum PropertyType { get; set; }
    public int Guests { get; set; }
    public int Bedrooms { get; set; }
    public int Beds { get; set; }
    public int Bathrooms { get; set; }
    public bool Wifi { get; set; }
    public bool AirConditioning { get; set; }
    public bool Kitchen { get; set; }
    public bool Parking { get; set; }
    public bool SwimmingPool { get; set; }
    public string Address { get; set; }
    public List<Guid> PropertyImageIds { get; set; }
    public Guid PropertyHostId { get; set; }
    public Guid LocationId { get; set; }
}
