// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;

public interface IRoleRepository
{
    Task<Role> GetByIdAsync(Guid roleId);
    Task<Role> GetByNameAsync(string roleName);
    Task<IEnumerable<Role>> GetAllAsync();
}
