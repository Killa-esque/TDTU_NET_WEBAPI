// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs;

public class PropertyImageResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? ImageId { get; set; }
    public string? ImageUrl { get; set; }
    public string? PropertyId { get; set; }
}

