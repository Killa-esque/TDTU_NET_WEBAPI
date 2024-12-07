// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Infrastructure.Data;
namespace AirBnBWebApi.Infrastructure.Repository;


public class UserRoleRepository : IUserRoleRepository
{
    private readonly AirBnBDbContext _context;

    public UserRoleRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<UserRole> CreateAsync(UserRole userRole)
    {
        await _context.Set<UserRole>().AddAsync(userRole);
        await _context.SaveChangesAsync();
        return userRole;
    }

    public async Task<List<Role>> GetRolesByUserIdAsync(Guid userId)
    {
        return await _context.Set<UserRole>()
            .Where(ur => ur.UserId == userId)
            .Include(ur => ur.Role)
            .Select(ur => ur.Role)
            .ToListAsync();
    }

    public async Task<bool> RemoveRolesByUserIdAsync(Guid userId)
    {
        var userRoles = _context.UserRoles.Where(ur => ur.UserId == userId);
        _context.UserRoles.RemoveRange(userRoles);

        return await _context.SaveChangesAsync() > 0;

    }

    public async Task<int> AddRolesAsync(IEnumerable<UserRole> userRoles)
    {
        await _context.UserRoles.AddRangeAsync(userRoles);

        return await _context.SaveChangesAsync();
    }
}
