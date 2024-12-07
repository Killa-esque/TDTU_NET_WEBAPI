// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class LocationController : ControllerBase
{
    private readonly ILocationService _locationService;

    public LocationController(ILocationService locationService)
    {
        _locationService = locationService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllLocations()
    {
        var result = await _locationService.GetAllLocationsAsync().ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Success(result.Locations, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetLocationById([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid location ID");
        }

        var result = await _locationService.GetLocationByIdAsync(id).ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Success(result.Location, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    [HttpPost]
    public async Task<IActionResult> CreateLocation([FromBody] LocationDto locationDto)
    {
        if (locationDto == null)
        {
            return ResponseHelper.BadRequest("Invalid location data");
        }

        var result = await _locationService.AddLocationAsync(locationDto).ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Created(result.LocationId, result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateLocation([FromRoute] Guid id, [FromBody] LocationDto locationDto)
    {
        if (locationDto == null || id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid location data or ID");
        }

        var result = await _locationService.UpdateLocationAsync(id, locationDto).ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Success(result.Location, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteLocation([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid location ID");
        }

        var result = await _locationService.DeleteLocationAsync(id).ConfigureAwait(false);
        return result.IsSuccess
            ? ResponseHelper.Success(result.LocationId, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    [HttpPost("{id}/upload-image")]
    public async Task<IActionResult> UploadImage([FromRoute] Guid id, [FromForm] IFormFile image)
    {
        if (id == Guid.Empty || image == null || image.Length == 0)
        {
            return ResponseHelper.BadRequest("Invalid location ID or image file.");
        }

        // Kiểm tra Location tồn tại
        var locationResult = await _locationService.GetLocationByIdAsync(id).ConfigureAwait(false);
        if (!locationResult.IsSuccess)
        {
            return ResponseHelper.NotFound("Location not found.");
        }

        var location = locationResult.Location;
        var uploadsFolderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "images", "locations");

        // Xóa ảnh cũ nếu tồn tại
        if (location != null && !string.IsNullOrEmpty(location.ImageUrl))
        {
            var oldImagePath = Path.Combine(uploadsFolderPath, Path.GetFileName(location.ImageUrl));
            if (System.IO.File.Exists(oldImagePath))
            {
                System.IO.File.Delete(oldImagePath);
            }
        }

        // Đảm bảo thư mục lưu trữ tồn tại
        if (!Directory.Exists(uploadsFolderPath))
        {
            Directory.CreateDirectory(uploadsFolderPath);
        }

        // Lưu ảnh mới lên server
        var fileName = $"{Guid.NewGuid()}{Path.GetExtension(image.FileName)}";
        var filePath = Path.Combine(uploadsFolderPath, fileName);

        using (var stream = new FileStream(filePath, FileMode.Create))
        {
            await image.CopyToAsync(stream).ConfigureAwait(false);
        }

        // Cập nhật ImageUrl trong cơ sở dữ liệu
        var imageUrl = $"/images/locations/{fileName}";
        var updateResult = await _locationService.UpdateLocationImageUrlAsync(id, imageUrl).ConfigureAwait(false);

        return updateResult.IsSuccess
            ? ResponseHelper.Success(new { ImageUrl = imageUrl }, "Image uploaded and updated successfully.")
            : StatusCode(500, "An error occurred while saving the image.");
    }
}
