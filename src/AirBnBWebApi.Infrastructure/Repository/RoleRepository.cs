// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Infrastructure.Data;
using System.Collections.Generic;

namespace AirBnBWebApi.Infrastructure.Repository;
public class RoleRepository : IRoleRepository
{
    private readonly AirBnBDbContext _context;

    public RoleRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<Role> GetByIdAsync(Guid roleId)
    {
        return await _context.Set<Role>().FindAsync(roleId).ConfigureAwait(false);
    }

    public async Task<Role> GetByNameAsync(string roleName)
    {
        return await _context.Set<Role>().FirstOrDefaultAsync(r => r.Name == roleName).ConfigureAwait(false);
    }

    public async Task<IEnumerable<Role>> GetAllAsync()
    {
        return await _context.Set<Role>().ToListAsync().ConfigureAwait(false);
    }
}
