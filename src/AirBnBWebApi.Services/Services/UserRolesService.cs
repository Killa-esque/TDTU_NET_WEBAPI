// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;

public class UserRolesService : IUserRolesService
{
    private readonly IUserRoleRepository _userRoleRepository;
    private readonly IRoleRepository _roleRepository;

    public UserRolesService(IUserRoleRepository userRoleRepository, IRoleRepository roleRepository)
    {
        _userRoleRepository = userRoleRepository;
        _roleRepository = roleRepository;
    }

    public async Task<List<string>> GetUserRolesAsync(Guid userId)
    {
        var roles = await _userRoleRepository.GetRolesByUserIdAsync(userId).ConfigureAwait(false);
        return roles.Select(r => r.Name).ToList();
    }

    public async Task<bool> UpdateRolesForUserAsync(Guid userId, List<string> roles)
    {
        var removeSuccess = await _userRoleRepository.RemoveRolesByUserIdAsync(userId).ConfigureAwait(false);

        if (!removeSuccess)
        {
            return false;
        }
        var rolesInDb = await Task.WhenAll(roles.Select(role => _roleRepository.GetByNameAsync(role))).ConfigureAwait(false);

        var userRoles = rolesInDb.Select(role => new UserRole { UserId = userId, RoleId = role.Id }).ToList();

        var userRoleAddCount = await _userRoleRepository.AddRolesAsync(userRoles).ConfigureAwait(false);

        // Get list roles count
        return userRoleAddCount == roles.Count;
    }
}
