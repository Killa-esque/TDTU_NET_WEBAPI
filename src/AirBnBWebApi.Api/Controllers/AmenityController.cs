// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Controllers;
[ApiController]
[Route("api/[controller]")]
public class AmenityController : ControllerBase
{
    private readonly IAmenityService _amenityService;

    public AmenityController(IAmenityService amenityService)
    {
        _amenityService = amenityService;
    }

    // Get all amenities
    [HttpGet]
    public async Task<IActionResult> GetAllAmenities()
    {
        var amenities = await _amenityService.GetAllAmenitiesAsync().ConfigureAwait(false);

        return amenities.IsSuccess
            ? ResponseHelper.Success(amenities.Amenities, amenities.Message)
            : ResponseHelper.NotFound(amenities.Message);
    }

    // Get amenity by ID
    [HttpGet("{id}")]
    public async Task<IActionResult> GetAmenityById([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid amenity ID");
        }

        var amenity = await _amenityService.GetAmenityByIdAsync(id).ConfigureAwait(false);

        return amenity.IsSuccess
            ? ResponseHelper.Success(amenity.Amenity, amenity.Message)
            : ResponseHelper.NotFound(amenity.Message);
    }

    // Get amenities by property ID
    [HttpGet("{propertyId}/property")]
    public async Task<IActionResult> GetAmenitiesByPropertyId([FromRoute] Guid propertyId)
    {
        if (propertyId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid property ID");
        }

        var amenities = await _amenityService.GetAmenityByPropertyIdAsync(propertyId).ConfigureAwait(false);

        return amenities.IsSuccess
            ? ResponseHelper.Success(amenities.Amenities, amenities.Message)
            : ResponseHelper.NotFound(amenities.Message);
    }

    // Create a new amenity
    [HttpPost]
    public async Task<IActionResult> CreateAmenity([FromBody] List<AmenityDto> amenities)
    {
        if (amenities == null)
        {
            return ResponseHelper.BadRequest("Invalid amenity data");
        }

        if (amenities.Count == 0)
        {
            return ResponseHelper.BadRequest("No amenity data provided");
        }

        var result = await _amenityService.AddAmenityAsync(amenities).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Created<object>(null, result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }

    // Update an existing amenity
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateAmenity([FromRoute] Guid id, [FromBody] AmenityDto amenityData)
    {
        if (id == Guid.Empty || amenityData == null)
        {
            return ResponseHelper.BadRequest("Invalid amenity ID or data");
        }

        var result = await _amenityService.UpdateAmenityAsync(id, amenityData).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }

    // Delete an amenity
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteAmenity([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid amenity ID");
        }

        var result = await _amenityService.DeleteAmenityAsync(id).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }
}
