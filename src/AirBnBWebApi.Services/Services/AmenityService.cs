// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;
public class AmenityService : IAmenityService
{
    private readonly IAmenityRepository _amenityRepository;

    public AmenityService(IAmenityRepository amenityRepository)
    {
        _amenityRepository = amenityRepository;
    }

    public async Task<AmenityResult> GetAllAmenitiesAsync()
    {
        var amenities = await _amenityRepository.GetAllAmenitiesAsync().ConfigureAwait(false);

        if (amenities == null || !amenities.Any())
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "No amenities found"
            };
        }

        var amenityDtos = amenities.Select(ConvertToDto).ToList();

        return new AmenityResult
        {
            IsSuccess = true,
            Message = "Amenities retrieved successfully",
            Amenities = amenityDtos
        };
    }

    public async Task<AmenityResult> GetAmenityByPropertyIdAsync(Guid propertyId)
    {
        var amenities = await _amenityRepository.GetPropertyAmenityByPropertyIdAsync(propertyId).ConfigureAwait(false);

        if (amenities == null || !amenities.Any())
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "No amenities found"
            };
        }

        var amenityDtos = amenities.Select(ConvertToDto).ToList();

        return new AmenityResult
        {
            IsSuccess = true,
            Message = "Amenities retrieved successfully",
            Amenities = amenityDtos
        };
    }

    public async Task<AmenityResult> GetAmenityByIdAsync(Guid id)
    {
        var amenity = await _amenityRepository.GetAmenityByIdAsync(id).ConfigureAwait(false);

        if (amenity == null)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "Amenity not found"
            };
        }

        return new AmenityResult
        {
            IsSuccess = true,
            Message = "Amenity retrieved successfully",
            Amenity = ConvertToDto(amenity)
        };
    }

    public async Task<AmenityResult> AddAmenityAsync(List<AmenityDto> amenityData)
    {
        // Lấy danh sách amenities từ Amenities hiện tại để check có amenity icon nào đã tồn tại không
        var amenities = await _amenityRepository.GetAllAmenitiesAsync().ConfigureAwait(false);

        // Lấy danh sách icon của amenities hiện tại
        var existingIcons = amenities.Select(a => a.Icon).ToList();

        // Kiểm tra xem có icon nào trùng không
        var duplicateIcons = amenityData.Select(a => a.Icon).Intersect(existingIcons).ToList();

        if (duplicateIcons.Any())
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = $"Amenity icon(s) {string.Join(", ", duplicateIcons)} already exists"
            };
        }

        // Chuyển đổi từ List<AmenityDto> sang List<Amenity>
        var amenitiesToAdd = amenityData.Select(amenity => new Amenity
        {
            Name = amenity.Name,
            Description = amenity.Description,
            Icon = amenity.Icon,
            Id = Guid.NewGuid()
        }).ToList();

        var result = await _amenityRepository.AddAmenityAsync(amenitiesToAdd).ConfigureAwait(false);

        return result
            ? new AmenityResult { IsSuccess = true, Message = "Amenities added successfully", AmenityIds = amenitiesToAdd.Select(a => a.Id.ToString()).ToList() }
            : new AmenityResult { IsSuccess = false, Message = "Failed to add amenities" };

    }

    public async Task<AmenityResult> UpdateAmenityAsync(Guid id, AmenityDto amenityData)
    {
        var amenity = await _amenityRepository.GetAmenityByIdAsync(id).ConfigureAwait(false);

        if (amenity == null)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "Amenity not found"
            };
        }

        amenity.Name = amenityData.Name;
        amenity.Description = amenityData.Description;
        amenity.Icon = amenityData.Icon;

        var result = await _amenityRepository.UpdateAmenityAsync(amenity).ConfigureAwait(false);

        return result
            ? new AmenityResult { IsSuccess = true, Message = "Amenity updated successfully", AmenityId = amenity.Id.ToString() }
            : new AmenityResult { IsSuccess = false, Message = "Failed to update amenity" };
    }

    public async Task<AmenityResult> DeleteAmenityAsync(Guid id)
    {
        var amenity = await _amenityRepository.GetAmenityByIdAsync(id).ConfigureAwait(false);

        if (amenity == null)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "Amenity not found"
            };
        }

        var result = await _amenityRepository.DeleteAmenityAsync(id).ConfigureAwait(false);

        return result
            ? new AmenityResult { IsSuccess = true, Message = "Amenity deleted successfully" }
            : new AmenityResult { IsSuccess = false, Message = "Failed to delete amenity" };
    }

    // Chuyển đổi từ Amenity sang AmenityDto
    private AmenityDto ConvertToDto(Amenity amenity) => new AmenityDto
    {
        Id = amenity.Id,
        Name = amenity.Name,
        Description = amenity.Description,
        Icon = amenity.Icon
    };

    // Chuyển đổi từ AmenityDto sang Amenity
    private static Amenity ConvertToEntity(AmenityDto amenityDto) => new Amenity
    {
        Name = amenityDto.Name,
        Description = amenityDto.Description,
        Icon = amenityDto.Icon
    };
}
