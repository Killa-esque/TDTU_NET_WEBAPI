// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Security.Cryptography;

namespace AirBnBWebApi.Service.Security;

public class SecurityKeyGenerator
{
    public (string PublicKey, string PrivateKey) GenerateKeyPair()
    {
        var rsa = RSA.Create();
        var publicKey = Convert.ToBase64String(rsa.ExportRSAPublicKey());
        var privateKey = Convert.ToBase64String(rsa.ExportRSAPrivateKey());

        return (privateKey, publicKey);
    }
}
