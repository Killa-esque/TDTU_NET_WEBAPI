// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.Entities;

public class Property
{
    public Guid Id { get; set; }
    public string PropertyName { get; set; }
    public string PropertyDescription { get; set; }
    public decimal PropertyPricePerNight { get; set; }
    public Guid HostId { get; set; }
    public PropertyStatusEnum PropertyStatus { get; set; }
    public PropertyTypeEnum PropertyType { get; set; }
    public int Guests { get; set; }
    public int Bedrooms { get; set; }
    public int Beds { get; set; }
    public int Bathrooms { get; set; }
    public string Address { get; set; }
    public bool IsDraft { get; set; }
    public bool IsPublished { get; set; }
    public bool IsArchived { get; set; }
    public Guid LocationId { get; set; }
    // Slug
    public string Slug { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Quan hệ với Location
    public Location Location { get; set; }

    // Quan hệ với PropertyImage
    public virtual ICollection<PropertyImage> PropertyImages { get; set; }

    // Quan hệ với Review
    public virtual ICollection<Review> Reviews { get; set; }

    // Quan hệ nhiều-nhiều với Amenities
    public virtual ICollection<PropertyAmenity> PropertyAmenities { get; set; }
    public virtual ICollection<Reservation> Reservations { get; set; }
}
