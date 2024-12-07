// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;
using System.Threading.Tasks;
using System;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IKeyTokenRepository
{
    Task<KeyToken> AddAsync(KeyToken keyToken);
    Task<KeyToken> GetByUserIdAsync(Guid userId);
    Task<KeyToken> UpdateAsync(KeyToken keyToken);
    Task DeleteAsync(Guid userId);
}
