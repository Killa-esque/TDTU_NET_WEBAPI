// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Services.Interfaces;

public interface IRefreshTokenService
{
    Task MoveRefreshTokenToUsedAsync(RefreshToken refreshToken);

}
