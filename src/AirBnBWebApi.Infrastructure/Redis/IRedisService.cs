// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;

namespace AirBnBWebApi.Infrastructure.Redis;
public interface IRedisService
{
    Task SetAsync(string key, string value, TimeSpan expiry);
    Task<string> GetAsync(string key);
    Task RemoveAsync(string key);
}
