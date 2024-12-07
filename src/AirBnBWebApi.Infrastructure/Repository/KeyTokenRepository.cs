// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AirBnBWebApi.Infrastructure.Repository;
public class KeyTokenRepository : IKeyTokenRepository
{
    private readonly AirBnBDbContext _context;

    public KeyTokenRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    // Thêm mới KeyToken và trả về đối tượng đã thêm
    public async Task<KeyToken> AddAsync(KeyToken keyToken)
    {
        await _context.KeyTokens.AddAsync(keyToken);
        await _context.SaveChangesAsync();

        return keyToken;  // Trả về đối tượng đã được thêm
    }

    // Xóa KeyToken theo UserId
    public async Task DeleteAsync(Guid userId)
    {
        var keyToken = await _context.KeyTokens.FirstOrDefaultAsync(kt => kt.UserId == userId);
        if (keyToken != null)
        {
            _context.KeyTokens.Remove(keyToken);
            await _context.SaveChangesAsync();
        }
    }

    // Lấy KeyToken theo UserId
    public async Task<KeyToken> GetByUserIdAsync(Guid userId)
    {
        return await _context.KeyTokens.FirstOrDefaultAsync(kt => kt.UserId == userId);
    }

    // Cập nhật KeyToken và trả về đối tượng đã cập nhật
    public async Task<KeyToken> UpdateAsync(KeyToken keyToken)
    {
        var existingKeyToken = await _context.KeyTokens.FirstOrDefaultAsync(kt => kt.UserId == keyToken.UserId);
        if (existingKeyToken != null)
        {
            _context.Entry(existingKeyToken).CurrentValues.SetValues(keyToken);
            await _context.SaveChangesAsync();

            return existingKeyToken;  // Trả về đối tượng đã cập nhật
        }

        return null;  // Trường hợp không tìm thấy đối tượng
    }
}
