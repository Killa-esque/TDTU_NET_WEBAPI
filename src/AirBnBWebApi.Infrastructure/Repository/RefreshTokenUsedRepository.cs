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
public class RefreshTokenUsedRepository : IRefreshTokenUsedRepository
{
    private readonly AirBnBDbContext _context;

    public RefreshTokenUsedRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    // Lấy RefreshTokenUsed theo token string
    public async Task<RefreshTokenUsed> GetByTokenAsync(string token)
    {
        return await _context.Set<RefreshTokenUsed>().FirstOrDefaultAsync(rt => rt.Token == token);
    }

    // Tạo mới một RefreshTokenUsed
    public async Task<RefreshTokenUsed> CreateAsync(RefreshTokenUsed token)
    {
        await _context.Set<RefreshTokenUsed>().AddAsync(token);
        await _context.SaveChangesAsync();
        return token;
    }

    // Cập nhật RefreshTokenUsed
    public async Task<RefreshTokenUsed> UpdateAsync(RefreshTokenUsed token)
    {
        _context.Set<RefreshTokenUsed>().Update(token);
        await _context.SaveChangesAsync();
        return token;
    }

    // Lấy danh sách RefreshTokenUsed theo UserId
    public async Task<List<RefreshTokenUsed>> GetTokensByUserIdAsync(Guid userId)
    {
        return await _context.Set<RefreshTokenUsed>()
            .Where(rt => rt.UserId == userId)
            .ToListAsync();
    }

    // Xóa RefreshTokenUsed theo tokenId và userId
    public async Task DeleteAsync(Guid tokenId, Guid userId)
    {
        var token = await _context.Set<RefreshTokenUsed>().FirstOrDefaultAsync(rt => rt.Id == tokenId && rt.UserId == userId);
        if (token != null)
        {
            _context.Set<RefreshTokenUsed>().Remove(token);
            await _context.SaveChangesAsync();
        }
    }
}
