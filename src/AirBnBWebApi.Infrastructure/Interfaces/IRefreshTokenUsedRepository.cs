// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;

public interface IRefreshTokenUsedRepository
{
    Task<RefreshTokenUsed> GetByTokenAsync(string token);
    Task<RefreshTokenUsed> CreateAsync(RefreshTokenUsed token);
    Task<RefreshTokenUsed> UpdateAsync(RefreshTokenUsed token);
    Task<List<RefreshTokenUsed>> GetTokensByUserIdAsync(Guid userId);
    Task DeleteAsync(Guid tokenId, Guid userId);
}
