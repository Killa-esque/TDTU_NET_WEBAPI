// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs;

public class UserSearchResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public List<UserSearchDto> Users { get; set; }
}
