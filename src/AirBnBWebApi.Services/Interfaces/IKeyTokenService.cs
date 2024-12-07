// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Services.Interfaces;

public interface IKeyTokenService
{
    Task<(bool status, int code, KeyToken keyToken)> CreateKeyTokenAsync(Guid userId, string publicKey, string privateKey);
    Task<(bool status, string publicKey)> GetUserPublicKeyAsync(Guid userId);
    Task<(bool status, string privateKey)> GetUserPrivateKeyAsync(Guid userId);

}
