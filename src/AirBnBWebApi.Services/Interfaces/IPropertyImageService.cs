// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using Microsoft.AspNetCore.Http;

namespace AirBnBWebApi.Services.Interfaces;

public interface IPropertyImageService
{
    Task<List<string>> UploadPropertyImagesAsync(Guid propertyId, IFormFileCollection images);
    Task UpdatePropertyImagesAsync(Guid propertyId, List<string> imageUrls);
    // DeletePropertyImageByUrlAsync
    Task<PropertyImageResult> DeletePropertyImageByUrlAsync(Guid propertyId, string imageUrl);
}
