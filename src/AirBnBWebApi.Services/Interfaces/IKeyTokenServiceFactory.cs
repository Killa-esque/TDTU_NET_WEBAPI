// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Services.Interfaces;

public interface IKeyTokenServiceFactory
{
    IKeyTokenService CreateService();
}
