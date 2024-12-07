// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Service.Interfaces;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace AirBnBWebApi.Service.Jwt;

public class JwtTokenHandler : IJwtTokenHandler
{
    private readonly IConfiguration _configuration;
    private readonly IUserRolesService _userRolesService;
    private readonly IUserRepository _userRepository;

    public JwtTokenHandler(IConfiguration configuration, IUserRolesService userRolesService, IUserRepository userRepository)
    {
        _configuration = configuration;
        _userRolesService = userRolesService;
        _userRepository = userRepository;
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[32];
        using (var rng = RandomNumberGenerator.Create())
        {
            rng.GetBytes(randomNumber);
            return Convert.ToBase64String(randomNumber);
        }
    }

    public string GenerateToken(User user, string role, string privateKey, int expiryMinutes)
    {
        var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email ?? string.Empty),
                new Claim("fullName", user.FullName ?? string.Empty),
                new Claim("role", role ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

        string token;
        var privateKeyBytes = Convert.FromBase64String(privateKey);
        var rsa = RSA.Create();

        try
        {
            rsa.ImportRSAPrivateKey(privateKeyBytes, out _);
            var securityKey = new RsaSecurityKey(rsa);
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.RsaSha256);

            var tokenDescriptor = new JwtSecurityToken(
                issuer: _configuration["JwtSettings:Issuer"],
                audience: _configuration["JwtSettings:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddMinutes(expiryMinutes),
                signingCredentials: credentials);

            token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);


            return token;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to import private key: {ex.Message}");
            return string.Empty;
        }
        // finally
        // {
        //     rsa.Dispose();
        // }
    }

    public Task<string> GeneratePasswordResetTokenAsync(Guid userId, string userEmail, string privateKey)
    {
        var expiry = DateTime.UtcNow.AddMinutes(15);

        var claims = new[]
        {
                new Claim(JwtRegisteredClaimNames.Sub, userId.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, userEmail),
                new Claim("purpose", "reset_password"),
            };

        string token;
        var privateKeyBytes = Convert.FromBase64String(privateKey);
        var rsa = RSA.Create();

        try
        {
            rsa.ImportRSAPrivateKey(privateKeyBytes, out _);
            var credentials = new SigningCredentials(new RsaSecurityKey(rsa), SecurityAlgorithms.RsaSha256);
            var tokenDescriptor = new JwtSecurityToken(
                        issuer: _configuration["JwtSettings:Issuer"],
                        audience: _configuration["JwtSettings:Audience"],
                        claims: claims,
                        expires: expiry,
                        signingCredentials: credentials);

            token = new JwtSecurityTokenHandler().WriteToken(tokenDescriptor);

            return Task.FromResult(token);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Failed to import private key: {ex.Message}");
            return Task.FromResult(string.Empty);
        }
        // finally
        // {
        //     rsa.Dispose();
        // }
    }

    public ClaimsPrincipal ValidateResetPasswordToken(string token, string publicKey)
    {
        Console.WriteLine("Token: " + token);
        Console.WriteLine("PublicKey: " + publicKey);

        var handler = new JwtSecurityTokenHandler();

        Console.WriteLine("Initializing RSA for token validation...");

        var rsa = RSA.Create();

        try
        {
            rsa.ImportRSAPublicKey(Convert.FromBase64String(publicKey), out _);
            Console.WriteLine("Public key successfully imported.");

            var validationParameters = new TokenValidationParameters
            {
                ValidIssuer = _configuration["JwtSettings:Issuer"],
                ValidateIssuer = true,
                ValidAudience = _configuration["JwtSettings:Audience"],
                ValidateAudience = false,
                IssuerSigningKey = new RsaSecurityKey(rsa),
                ValidateIssuerSigningKey = true,
                ValidateLifetime = true,
                ClockSkew = TimeSpan.Zero,
            };

            Console.WriteLine("Token validation parameters set.");

            var principal = handler.ValidateToken(token, validationParameters, out _);

            Console.WriteLine("Token successfully validated. Claims:");

            // Check the claims present in the principal
            foreach (var claim in principal.Claims)
            {
                Console.WriteLine($"Type: {claim.Type}, Value: {claim.Value}");
            }

            if (principal.FindFirst("purpose")?.Value == "reset_password")
            {
                Console.WriteLine("Token purpose is valid.");
                return principal;
            }
            else
            {
                Console.WriteLine("Token purpose is invalid.");
            }
        }
        catch (SecurityTokenException ex)
        {
            Console.WriteLine($"Token validation failed: {ex.Message}");
            return null;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unexpected error during token validation: {ex.Message}");
            return null;
        }
        // finally
        // {
        //     Console.WriteLine("Disposing RSA object...");
        //     rsa.Dispose();
        // }

        return null;
    }

}
