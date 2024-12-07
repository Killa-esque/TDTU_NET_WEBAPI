// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;


namespace AirBnBWebApi.Infrastructure.Repository;
public class UserRepository : IUserRepository
{
    private readonly AirBnBDbContext _context;

    public UserRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<List<User>> GetAllAsync(int pageNumber, int pageSize)
    {
        if (pageNumber == 0 && pageSize == 0)
        {
            // Trả về tất cả người dùng khi không yêu cầu phân trang
            return await _context.Users.ToListAsync().ConfigureAwait(false);
        }

        // Lấy user mà isDeleted = false
        return await _context.Users
            .Where(u => u.IsDeleted == false)
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<int> GetTotalCountAsync()
    {
        return await _context.Users.CountAsync();
    }

    public async Task<User> GetByEmailAsync(string email)
    {
        return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
    }

    public Task<User> GetByIdAsync(Guid userId)
    {
        return _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
    }

    public async Task<User> CreateAsync(User user)
    {
        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<User> UpdateAsync(User user)
    {
        _context.Users.Update(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<bool> DeleteAsync(Guid userId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        _context.Users.Remove(user);
        var result = await _context.SaveChangesAsync();
        return result > 0;
    }

    public async Task<List<User>> SearchUsersAsync(string query)
    {
        return await _context.Users
            .Where(u => u.Email.Contains(query) || u.FullName.Contains(query) || u.PhoneNumber.Contains(query))
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<List<User>> GetUsersByIdsAsync(List<Guid> userIds)
    {
        return await _context.Users
            .Where(u => userIds.Contains(u.Id))
            .ToListAsync()
            .ConfigureAwait(false);
    }

}
