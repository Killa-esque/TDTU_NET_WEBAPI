// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;

public interface IUserRoleRepository
{
    Task<UserRole> CreateAsync(UserRole userRole);
    Task<List<Role>> GetRolesByUserIdAsync(Guid userId);
    Task<bool> RemoveRolesByUserIdAsync(Guid userId);
    Task<int> AddRolesAsync(IEnumerable<UserRole> userRoles);
}
