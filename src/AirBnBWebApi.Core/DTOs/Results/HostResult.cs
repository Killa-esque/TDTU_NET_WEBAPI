// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Core.DTOs;
public class HostResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public HostDto Host { get; set; }
}
