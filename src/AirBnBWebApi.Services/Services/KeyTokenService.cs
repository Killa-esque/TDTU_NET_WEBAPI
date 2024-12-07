// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;  // Thêm interface của repository
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;
public class KeyTokenService : IKeyTokenService
{
    private readonly IKeyTokenRepository _keyTokenRepository;

    public KeyTokenService(IKeyTokenRepository keyTokenRepository)
    {
        _keyTokenRepository = keyTokenRepository;
    }

    // Tạo mới KeyToken
    public async Task<(bool status, int code, KeyToken keyToken)> CreateKeyTokenAsync(Guid userId, string publicKey, string privateKey)
    {
        // Kiểm tra xem đã có KeyToken cho userId này hay chưa
        var existingToken = await _keyTokenRepository.GetByUserIdAsync(userId).ConfigureAwait(false);
        if (existingToken != null)
        {
            return (false, 409, null);
        }

        var token = new KeyToken
        {
            UserId = userId,
            PublicKey = publicKey,
            PrivateKey = privateKey,
            Timestamp = DateTime.UtcNow
        };

        try
        {
            // Thêm vào database qua repository
            var newToken = await _keyTokenRepository.AddAsync(token).ConfigureAwait(false);

            if (newToken != null)
            {
                return (true, 201, newToken);
            }
            else
            {
                return (false, 500, null);
            }
        }
        catch (Exception ex)
        {
            // Bắt ngoại lệ nếu có lỗi xảy ra
            return (false, 500, null);
        }
    }

    // Lấy PublicKey của người dùng
    public async Task<(bool status, string publicKey)> GetUserPublicKeyAsync(Guid userId)
    {
        var keyToken = await _keyTokenRepository.GetByUserIdAsync(userId).ConfigureAwait(false);
        if (keyToken == null)
        {
            return (false, null);
        }

        return (true, keyToken.PublicKey);
    }

    // Lấy PrivateKey của người dùng
    public async Task<(bool status, string privateKey)> GetUserPrivateKeyAsync(Guid userId)
    {
        var keyToken = await _keyTokenRepository.GetByUserIdAsync(userId).ConfigureAwait(false);
        if (keyToken == null)
        {
            return (false, null);
        }

        return (true, keyToken.PrivateKey);
    }
}
