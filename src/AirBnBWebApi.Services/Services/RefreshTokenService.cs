// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Interfaces;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace AirBnBWebApi.Services.Services;

public class RefreshTokenService : IRefreshTokenService
{
    private readonly IRefreshTokenUsedRepository _refreshTokenUsedRepository;
    private readonly IRefreshTokenRepository _refreshTokenRepository;

    public RefreshTokenService(IRefreshTokenUsedRepository refreshTokenUsedRepository)
    {
        _refreshTokenUsedRepository = refreshTokenUsedRepository;
    }
    public async Task MoveRefreshTokenToUsedAsync(RefreshToken refreshToken)
    {
        // Thêm RefreshToken hết hạn hoặc đã dùng vào bảng RefreshTokenUsed
        var refreshTokenUsed = new RefreshTokenUsed
        {
            UserId = refreshToken.UserId,
            Token = refreshToken.Token,
            UsedAt = DateTime.UtcNow,
            DeviceInfo = refreshToken.DeviceInfo
        };
        await _refreshTokenUsedRepository.CreateAsync(refreshTokenUsed).ConfigureAwait(false);

        // Xóa RefreshToken khỏi bảng RefreshToken
        await _refreshTokenRepository.DeleteAsync(refreshToken).ConfigureAwait(false);
    }

}

