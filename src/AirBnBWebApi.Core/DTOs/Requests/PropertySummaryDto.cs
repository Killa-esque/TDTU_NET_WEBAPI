
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class PropertySummaryDto
{
    public int Id { get; set; }
    public string PropertyName { get; set; }
    public decimal PropertyPricePerNight { get; set; }
    // public string PropertyThumbnailUrl { get; set; }
    public PropertyTypeEnum PropertyType { get; set; }
    public int Guests { get; set; }
    public int Bedrooms { get; set; }
    public int Bathrooms { get; set; }
    public bool IsPublished { get; set; }
}
