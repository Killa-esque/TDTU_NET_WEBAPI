// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.DTOs.Requests;

public class ReviewDto
{
    public Guid? ReviewId { get; set; }
    public Guid PropertyId { get; set; }
    public Guid UserId { get; set; }
    public string? Avatar { get; set; }
    public string? FullName { get; set; }
    public string Comment { get; set; }
    public double Rating { get; set; }
    public string? CreatedAt { get; set; }
    public string? UpdatedAt { get; set; }
}

public class ReviewChart
{
    public string Date { get; set; }   // Ngày có định dạng yyyy-MM-dd
    public double AverageRating { get; set; }
    public int ReviewsCount { get; set; }
}
