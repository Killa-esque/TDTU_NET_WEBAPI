// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class PropertyDto
{
    public Guid? Id { get; set; }
    public string Slug { get; set; }
    public string PropertyName { get; set; }
    public string PropertyDescription { get; set; }
    public decimal PropertyPricePerNight { get; set; }
    // public string? PropertyThumbnailUrl { get; set; }
    public PropertyStatusEnum? PropertyStatus { get; set; }
    public PropertyTypeEnum PropertyType { get; set; }
    public int Guests { get; set; }
    public int Bedrooms { get; set; }
    public int Beds { get; set; }
    public int Bathrooms { get; set; }
    public string Address { get; set; }
    public List<string>? PropertyImageUrls { get; set; } = new();
    public bool? IsDraft { get; set; }
    public bool? IsPublished { get; set; }
    public DateTime? CreatedAt { get; set; }
    public DateTime? UpdatedAt { get; set; }
    public Guid LocationId { get; set; }
    public Guid HostId { get; set; }
}

public class UpdatePropertyDto
{
    public string? PropertyName { get; set; }
    public string? PropertyDescription { get; set; }
    public decimal? PropertyPricePerNight { get; set; }
    public PropertyStatusEnum? PropertyStatus { get; set; }
    public PropertyTypeEnum? PropertyType { get; set; }
    public int? Guests { get; set; }
    public int? Bedrooms { get; set; }
    public int? Beds { get; set; }
    public int? Bathrooms { get; set; }
    public string? Address { get; set; }
    public Guid? LocationId { get; set; }

}
