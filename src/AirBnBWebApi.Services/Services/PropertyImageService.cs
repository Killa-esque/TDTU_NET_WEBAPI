// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Http;

namespace AirBnBWebApi.Services.Services;

public class PropertyImageService : IPropertyImageService
{
    private readonly IPropertyImageRepository _propertyImageRepository;

    public PropertyImageService(IPropertyImageRepository propertyImageRepository)
    {
        _propertyImageRepository = propertyImageRepository;
    }

    public async Task<List<string>> UploadPropertyImagesAsync(Guid propertyId, IFormFileCollection images)
    {
        var propertyFolderPath = Path.Combine("wwwroot", "properties", propertyId.ToString());

        if (!Directory.Exists(propertyFolderPath))
        {
            Directory.CreateDirectory(propertyFolderPath);
        }

        var allowedExtensions = new[] { ".jpg", ".jpeg", ".png", ".webp", ".avif" };
        var imageUrls = new List<string>();
        var propertyImages = new List<PropertyImage>();

        foreach (var image in images)
        {
            if (image.Length > 0)
            {
                var extension = Path.GetExtension(image.FileName).ToLower();

                if (!allowedExtensions.Contains(extension))
                {
                    throw new NotSupportedException($"File type {extension} is not supported. Allowed extensions are: {string.Join(", ", allowedExtensions)}.");
                }

                var fileName = Guid.NewGuid() + extension;
                var filePath = Path.Combine(propertyFolderPath, fileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream).ConfigureAwait(false);
                }

                var imageUrl = $"/properties/{propertyId}/{fileName}";
                imageUrls.Add(imageUrl);

                propertyImages.Add(new PropertyImage
                {
                    Id = Guid.NewGuid(),
                    PropertyId = propertyId,
                    ImageUrl = imageUrl,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                });
            }
        }

        await _propertyImageRepository.AddPropertyImagesAsync(propertyImages).ConfigureAwait(false);

        return imageUrls;
    }

    public async Task<PropertyImageResult> DeletePropertyImageByUrlAsync(Guid propertyId, string imageUrl)
    {
        var images = await _propertyImageRepository.GetPropertyImagesByPropertyIdAsync(propertyId).ConfigureAwait(false);

        var image = images.FirstOrDefault(i => i.ImageUrl == imageUrl);

        if (image == null)
        {
            return new PropertyImageResult { IsSuccess = false, Message = "Image does not exist or does not belong to the specified property." };
        }

        var filePath = Path.Combine("wwwroot", imageUrl.TrimStart('/'));
        if (File.Exists(filePath))
        {
            try
            {
                File.Delete(filePath);
            }
            catch (Exception ex)
            {
                return new PropertyImageResult { IsSuccess = false, Message = $"Failed to delete the file: {ex.Message}" };
            }
        }

        var result = await _propertyImageRepository.DeletePropertyImageAsync(image).ConfigureAwait(false);

        return result
            ? new PropertyImageResult { IsSuccess = true, Message = "Image deleted successfully." }
            : new PropertyImageResult { IsSuccess = false, Message = "Error deleting image." };
    }

    public async Task UpdatePropertyImagesAsync(Guid propertyId, List<string> imageUrls)
    {
        var existingImages = (await _propertyImageRepository.GetPropertyImagesByPropertyIdAsync(propertyId).ConfigureAwait(false)).ToList();

        foreach (var image in existingImages)
        {
            if (imageUrls.Contains(image.ImageUrl))
            {
                image.UpdatedAt = DateTime.UtcNow;
            }
        }

        await _propertyImageRepository.UpdatePropertyImagesAsync(existingImages).ConfigureAwait(false);
    }

    public async Task<(bool IsSuccess, string Message)> DeletePropertyImageAsync(Guid propertyId, Guid imageId)
    {
        // Kiểm tra xem ảnh có tồn tại hay không
        var image = await _propertyImageRepository.GetPropertyImageAsync(propertyId, imageId).ConfigureAwait(false);
        if (image == null)
        {
            return (false, "Image does not exist or does not belong to the specified property.");
        }

        // Xóa file ảnh khỏi hệ thống tệp (nếu tồn tại)
        var filePath = Path.Combine("wwwroot", image.ImageUrl.TrimStart('/'));
        if (File.Exists(filePath))
        {
            try
            {
                File.Delete(filePath);
            }
            catch (Exception ex)
            {
                return (false, $"Failed to delete the file: {ex.Message}");
            }
        }

        // Xóa ảnh khỏi cơ sở dữ liệu
        await _propertyImageRepository.DeletePropertyImageAsync(image).ConfigureAwait(false);

        return (true, "Image deleted successfully.");
    }

}
