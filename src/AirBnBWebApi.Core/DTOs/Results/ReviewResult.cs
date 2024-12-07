// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using System.Collections.Generic;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Core.DTOs;

public class ReviewResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? ReviewId { get; set; }
    public ReviewDto? Review { get; set; } // return this if you are returning a single review
    public List<ReviewDto>? Reviews { get; set; } // return this if you are returning a list of reviews
    public List<ReviewChart>? ReviewsChart { get; set; }
}

