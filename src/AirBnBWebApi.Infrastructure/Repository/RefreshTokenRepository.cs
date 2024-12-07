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
public class RefreshTokenRepository : IRefreshTokenRepository
{
    private readonly AirBnBDbContext _context;

    public RefreshTokenRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<RefreshToken> GetByTokenAsync(string token)
    {
        return await _context.Set<RefreshToken>().FirstOrDefaultAsync(rt => rt.Token == token);
    }

    public async Task<RefreshToken> CreateAsync(RefreshToken token)
    {
        await _context.Set<RefreshToken>().AddAsync(token);
        await _context.SaveChangesAsync();
        return token;
    }

    public async Task<RefreshToken> UpdateAsync(RefreshToken token)
    {
        _context.Set<RefreshToken>().Update(token);
        await _context.SaveChangesAsync();
        return token;
    }

    public async Task<List<RefreshToken>> GetTokensByUserIdAsync(Guid userId)
    {
        return await _context.Set<RefreshToken>()
            .Where(rt => rt.UserId == userId)
            .ToListAsync();
    }

    public async Task DeleteAsync(RefreshToken token)
    {
        _context.RefreshTokens.Remove(token);
        await _context.SaveChangesAsync();
    }
}
