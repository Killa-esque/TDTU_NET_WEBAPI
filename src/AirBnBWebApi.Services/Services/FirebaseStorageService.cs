// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Services.Interfaces;
using System;
using System.IO;
using System.Threading.Tasks;
using Google.Cloud.Storage.V1;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace AirBnBWebApi.Services.Services;

public class FirebaseStorageService : IFirebaseStorageService
{
    private readonly IConfiguration _configuration;
    private readonly StorageClient _storageClient;
    private readonly string _bucketName;

    public FirebaseStorageService(IConfiguration configuration)
    {
        _configuration = configuration;
        _bucketName = _configuration["Firebase:Bucket"];

        // StorageClient không cần khởi tạo FirebaseApp nữa
        _storageClient = StorageClient.Create();
    }

    public async Task<string> UploadFileAsync(IFormFile file, string fileName)
    {
        using var stream = file.OpenReadStream();
        var storageObject = await _storageClient.UploadObjectAsync(_bucketName, fileName, null, stream).ConfigureAwait(false);
        return $"https://storage.googleapis.com/{_bucketName}/{storageObject.Name}";
    }

    public async Task<bool> DeleteFileAsync(string fileName)
    {
        await _storageClient.DeleteObjectAsync(_bucketName, fileName).ConfigureAwait(false);
        return true;
    }

    public Task<string> GetFileUrlAsync(string fileName)
    {
        return Task.FromResult($"https://storage.googleapis.com/{_bucketName}/{fileName}");
    }
}
