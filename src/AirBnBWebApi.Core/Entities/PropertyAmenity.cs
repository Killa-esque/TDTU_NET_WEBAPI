// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.Entities;

public class PropertyAmenity
{
    public Guid Id { get; set; }

    // Khóa ngoại đến Property
    public Guid PropertyId { get; set; }
    public Property Property { get; set; }

    // Khóa ngoại đến Amenity
    public Guid AmenityId { get; set; }
    public Amenity Amenity { get; set; }
}

