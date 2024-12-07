// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using System.Collections.Generic;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.DTOs;

public class PropertyResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? PropertyId { get; set; }
    public PropertyDto? Property { get; set; }
    public List<PropertyDto>? Properties { get; set; }
    // Property Status
    public PropertyStatusEnum? PropertyStatus { get; set; }

}

