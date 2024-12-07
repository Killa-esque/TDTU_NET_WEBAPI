
// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs.Requests;
public class PropertyReviewDto
{
    public Guid PropertyId { get; set; }
    public string ReviewerName { get; set; }
    public string Review { get; set; }
    public int Rating { get; set; }
}
