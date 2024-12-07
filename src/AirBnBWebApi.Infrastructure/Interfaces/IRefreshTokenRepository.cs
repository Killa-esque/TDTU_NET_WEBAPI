// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;

public interface IRefreshTokenRepository
{
    Task<RefreshToken> GetByTokenAsync(string token);
    Task<RefreshToken> CreateAsync(RefreshToken token);
    Task<RefreshToken> UpdateAsync(RefreshToken token);
    Task<List<RefreshToken>> GetTokensByUserIdAsync(Guid userId);
    Task DeleteAsync(RefreshToken token);
}
