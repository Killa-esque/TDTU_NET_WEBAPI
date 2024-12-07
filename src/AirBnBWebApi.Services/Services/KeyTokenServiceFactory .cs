// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Services.Interfaces;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace AirBnBWebApi.Services.Services;

public class KeyTokenServiceFactory : IKeyTokenServiceFactory
{
    private readonly IServiceProvider _serviceProvider;

    public KeyTokenServiceFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IKeyTokenService CreateService()
    {
        return _serviceProvider.GetRequiredService<IKeyTokenService>();
    }
}
