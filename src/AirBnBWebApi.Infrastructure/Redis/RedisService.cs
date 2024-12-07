// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using StackExchange.Redis;

namespace AirBnBWebApi.Infrastructure.Redis;

public class RedisService : IRedisService
{
    private readonly IConnectionMultiplexer _connectionMultiplexer;

    public RedisService(IConnectionMultiplexer connectionMultiplexer)
    {
        _connectionMultiplexer = connectionMultiplexer;
    }

    public async Task SetAsync(string key, string value, TimeSpan expiry)
    {
        var db = _connectionMultiplexer.GetDatabase();
        await db.StringSetAsync(key, value, expiry).ConfigureAwait(false);
    }

    public async Task<string> GetAsync(string key)
    {
        var db = _connectionMultiplexer.GetDatabase();
        return await db.StringGetAsync(key).ConfigureAwait(false);
    }

    public async Task RemoveAsync(string key)
    {
        var db = _connectionMultiplexer.GetDatabase();
        await db.KeyDeleteAsync(key).ConfigureAwait(false);
    }
}
