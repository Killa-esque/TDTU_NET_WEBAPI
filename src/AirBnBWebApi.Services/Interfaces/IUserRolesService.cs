// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirBnBWebApi.Services.Interfaces;

public interface IUserRolesService
{
    Task<List<string>> GetUserRolesAsync(Guid userId);
    Task<bool> UpdateRolesForUserAsync(Guid userId, List<string> roles);
}
