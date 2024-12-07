// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Security.Claims;
using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Enums;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Controllers;
[Route("api/[controller]")]
[ApiController]
public class PropertyController : ControllerBase
{
    private readonly IPropertyService _propertyService;
    private readonly IReviewService _reviewService;
    private readonly IPropertyImageService _propertyImageService;
    public PropertyController(IPropertyService propertyService, IReviewService reviewService, IPropertyImageService propertyImageService)
    {
        _propertyService = propertyService;
        _reviewService = reviewService;
        _propertyImageService = propertyImageService;
    }

    [HttpGet]
    public async Task<IActionResult> GetProperties()
    {
        var properties = await _propertyService.GetAllPropertiesAsync().ConfigureAwait(false);

        // Use ResponseHelper
        return properties.IsSuccess ? ResponseHelper.Success(properties.Properties, properties.Message) : ResponseHelper.NotFound(properties.Message);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetPropertyById([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid property id");
        }

        var property = await _propertyService.GetPropertyByIdAsync(id).ConfigureAwait(false);

        return property.IsSuccess ? ResponseHelper.Success(property.Property, property.Message) : ResponseHelper.NotFound(property.Message);
    }

    [HttpGet("{slug}/slug")]
    public async Task<IActionResult> GetPropertyBySlug([FromRoute] string slug)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return ResponseHelper.BadRequest("Invalid property slug");
        }

        var property = await _propertyService.GetPropertyBySlugAsync(slug).ConfigureAwait(false);

        return property.IsSuccess ? ResponseHelper.Success(property.Property, property.Message) : ResponseHelper.NotFound(property.Message);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProperty([FromBody] PropertyDto propertyData)
    {
        if (propertyData == null)
        {
            return ResponseHelper.BadRequest("Invalid property data");
        }

        var property = await _propertyService.AddPropertyAsync(propertyData).ConfigureAwait(false);

        return property.IsSuccess ? ResponseHelper.Created(property.PropertyId, property.Message) : ResponseHelper.BadRequest(property.Message);

    }

    // [HttpPut("{id}")]
    // public async Task<IActionResult> UpdateProperty([FromRoute] Guid id, [FromBody] PropertyDto propertyData)
    // {
    //     var updateResult = await _propertyService.UpdatePropertyAsync(id, propertyData).ConfigureAwait(false);

    //     return updateResult.IsSuccess ? ResponseHelper.Success(updateResult.PropertyId, updateResult.Message) : ResponseHelper.BadRequest(updateResult.Message);
    // }

    [HttpPatch("{slug}")]
    public async Task<IActionResult> PatchProperty([FromRoute] string slug, [FromBody] UpdatePropertyDto propertyData)
    {
        if (propertyData == null)
        {
            return BadRequest("Invalid property data.");
        }

        var result = await _propertyService.PatchPropertyAsync(slug, propertyData).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.PropertyId, result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteProperty([FromRoute] Guid id)
    {
        var deleteResult = await _propertyService.DeletePropertyAsync(id).ConfigureAwait(false);

        return deleteResult.IsSuccess ? ResponseHelper.Success(deleteResult.PropertyId, deleteResult.Message) : ResponseHelper.BadRequest(deleteResult.Message);
    }

    [HttpPost("search")]
    public async Task<IActionResult> SearchProperties([FromBody] PropertySearchDto searchRequest)
    {
        if (searchRequest == null)
        {
            return ResponseHelper.BadRequest("Invalid search request data");
        }

        var result = await _propertyService.SearchPropertiesAsync(searchRequest).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Properties, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }


    [HttpGet("{propertyId}/reviews")]
    public async Task<IActionResult> GetPropertyReviews([FromRoute] Guid propertyId)
    {
        var reviews = await _reviewService.GetReviewsByPropertyIdAsync(propertyId).ConfigureAwait(false);

        return reviews.IsSuccess ? ResponseHelper.Success(reviews.Reviews, reviews.Message) : ResponseHelper.NotFound(reviews.Message);
    }

    [Authorize]
    [HttpPost("reviews")]
    public async Task<IActionResult> CreatePropertyReview([FromBody] ReviewDto reviewData)
    {
        if (reviewData == null)
        {
            return ResponseHelper.BadRequest("Invalid review data");
        }

        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        if (userId != reviewData.UserId)
        {
            return ResponseHelper.Unauthorized("User is not authorized to create review for another user.");
        }

        var result = await _reviewService.CreateReviewAsync(reviewData).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Created(result.ReviewId, result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpGet("{id}/status")]
    public async Task<IActionResult> GetPropertyStatus([FromRoute] Guid propertyId, [FromQuery] PropertyStatusEnum status)
    {
        var propertiesByStatus = await _propertyService.GetPropertiesByStatusAsync(status).ConfigureAwait(false);

        return propertiesByStatus.IsSuccess ? ResponseHelper.Success(propertiesByStatus.Properties, propertiesByStatus.Message) : ResponseHelper.NotFound(propertiesByStatus.Message);

    }

    [HttpPost("{id}/images")]
    // [FromBody] List<string> imageUrls = null
    public async Task<IActionResult> ManagePropertyImages([FromRoute] Guid id, [FromForm] IFormFileCollection images)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid property ID");
        }

        Console.WriteLine("Property ID: " + id);

        if (images != null && images.Any())
        {
            Console.WriteLine("Images count: " + images.Count);
            var uploadedUrls = await _propertyImageService.UploadPropertyImagesAsync(id, images).ConfigureAwait(false);
            return ResponseHelper.Success(uploadedUrls, "Images uploaded successfully.");
        }

        return ResponseHelper.BadRequest("No images or image URLs provided.");
    }

    // [HttpDelete("{propertyId}/images/{imageId}")]
    // public async Task<IActionResult> DeletePropertyImage([FromRoute] Guid propertyId, [FromRoute] Guid imageId)
    // {
    //     if (propertyId == Guid.Empty || imageId == Guid.Empty)
    //     {
    //         return ResponseHelper.BadRequest("No images or image URLs provided.");
    //     }

    //     var result = await _propertyImageService.DeletePropertyImageAsync(propertyId, imageId).ConfigureAwait(false);

    //     if (!result.IsSuccess)
    //     {
    //         return ResponseHelper.BadRequest(result.Message);
    //     }

    //     return ResponseHelper.Success(result.Message);
    // }

    [HttpPatch("publish/{slug}")]
    public async Task<IActionResult> PublishProperty([FromRoute] string slug)
    {
        var result = await _propertyService.PublishPropertyAsync(slug).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.PropertyId, result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    // [HttpGet("{id}/amenities")]
    // public async Task<IActionResult> GetPropertyAmenities([FromRoute] Guid id)
    // {
    //     if (id == Guid.Empty)
    //     {
    //         return ResponseHelper.BadRequest("Invalid property ID");
    //     }

    //     var amenities = await _propertyService.GetAmenitiesByPropertyIdAsync(id).ConfigureAwait(false);

    //     return amenities.IsSuccess ? ResponseHelper.Success(amenities.Amenities ?? new List<AmenityDto>(), amenities.Message) : ResponseHelper.NotFound(amenities.Message);
    // }

    [HttpGet("{slug}/amenities")]
    public async Task<IActionResult> GetPropertyAmenitiesBySlug([FromRoute] string slug)
    {
        if (string.IsNullOrEmpty(slug))
        {
            return ResponseHelper.BadRequest("Invalid property slug");
        }

        var amenities = await _propertyService.GetAmenitiesByPropertySlugAsync(slug).ConfigureAwait(false);

        return amenities.IsSuccess ? ResponseHelper.Success(amenities.Amenities ?? new List<AmenityDto>(), amenities.Message) : ResponseHelper.NotFound(amenities.Message);
    }

    [HttpPost("{id}/amenities")]
    public async Task<IActionResult> AddAmenitiesToProperty([FromRoute] Guid id, [FromBody] List<Guid> amenityIds)
    {
        if (id == Guid.Empty || amenityIds == null || !amenityIds.Any())
        {
            return ResponseHelper.BadRequest("Invalid property ID or amenity IDs");
        }

        var result = await _propertyService.AddAmenitiesToPropertyAsync(id, amenityIds).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpPut("{slug}/amenities")]
    public async Task<IActionResult> UpdateAmenitiesForProperty([FromRoute] string slug, [FromBody] List<Guid> amenityIds)
    {
        if (string.IsNullOrEmpty(slug) || amenityIds == null || !amenityIds.Any())
        {
            return ResponseHelper.BadRequest("Invalid property slug or amenity IDs");
        }

        var result = await _propertyService.UpdateAmenitiesForPropertyAsync(slug, amenityIds).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpDelete("{propertyId}/amenities/{amenityId}")]
    public async Task<IActionResult> RemoveAmenityFromProperty([FromRoute] Guid propertyId, [FromRoute] Guid amenityId)
    {
        if (propertyId == Guid.Empty || amenityId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid property or amenity ID");
        }

        var result = await _propertyService.RemoveAmenityFromPropertyAsync(propertyId, amenityId).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpGet("{propertyId}/host")]
    public async Task<IActionResult> GetHostByPropertyId([FromRoute] Guid propertyId)
    {
        if (propertyId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid property ID");
        }

        var result = await _propertyService.GetHostDetailsByPropertyIdAsync(propertyId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Host, "Host information retrieved successfully")
            : ResponseHelper.NotFound(result.Message);
    }


    [HttpGet("host/{hostId}")]
    public async Task<IActionResult> GetPropertiesByHostId([FromRoute] Guid hostId)
    {
        if (hostId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid host ID");
        }

        var result = await _propertyService.GetPropertiesByHostIdAsync(hostId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Properties, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    // Get property type from PropertyTypeEnum
    [HttpGet("types")]
    public IActionResult GetPropertyTypes()
    {
        var propertyTypes = Enum.GetValues(typeof(PropertyTypeEnum)).Cast<PropertyTypeEnum>().Select(p => new { Id = (int)p, Name = p.ToString() }).ToList();

        return ResponseHelper.Success(propertyTypes, "Property types retrieved successfully");
    }

    // Xóa hình ảnh của property by PropertyImageUrl
    [HttpPost("{propertyId}/images/delete")]
    public async Task<IActionResult> DeletePropertyImages([FromRoute] Guid propertyId, [FromBody] DeletePropertyImageDto deletePropertyImageDto)
    {
        if (propertyId == Guid.Empty || string.IsNullOrEmpty(deletePropertyImageDto.ImageUrl))
        {
            return ResponseHelper.BadRequest("Invalid property ID or image URL");
        }

        var result = await _propertyImageService.DeletePropertyImageByUrlAsync(propertyId, deletePropertyImageDto.ImageUrl).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.Message) : ResponseHelper.BadRequest(result.Message);
    }
}
