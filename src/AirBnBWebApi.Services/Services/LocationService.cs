// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;
public class LocationService : ILocationService
{
    private readonly ILocationRepository _locationRepository;

    public LocationService(ILocationRepository locationRepository)
    {
        _locationRepository = locationRepository;
    }

    public async Task<LocationResult> GetLocationByIdAsync(Guid id)
    {
        var location = await _locationRepository.GetLocationByIdAsync(id).ConfigureAwait(false);
        return BuildResult(location, "Location found", "Location not found");
    }

    public async Task<LocationResult> GetAllLocationsAsync()
    {
        var locations = await _locationRepository.GetAllLocationsAsync().ConfigureAwait(false);
        var locationDtos = locations.Select(ConvertToDto).ToList();
        return new LocationResult
        {
            IsSuccess = true,
            Message = "Locations retrieved successfully",
            Locations = locationDtos
        };
    }

    public async Task<LocationResult> AddLocationAsync(LocationDto locationDto)
    {
        var location = ConvertToEntity(locationDto);
        location.Id = Guid.NewGuid();

        var addedLocation = await _locationRepository.AddLocationAsync(location).ConfigureAwait(false);
        return BuildResult(addedLocation, "Location added successfully", "Failed to add location");
    }

    public async Task<LocationResult> UpdateLocationAsync(Guid id, LocationDto locationDto)
    {
        var existingLocation = await _locationRepository.GetLocationByIdAsync(id).ConfigureAwait(false);
        if (existingLocation == null)
        {
            return NotFoundResult("Location not found");
        }

        UpdateEntity(existingLocation, locationDto);
        var updatedLocation = await _locationRepository.UpdateLocationAsync(existingLocation).ConfigureAwait(false);

        return BuildResult(updatedLocation, "Location updated successfully", "Failed to update location");
    }

    public async Task<LocationResult> DeleteLocationAsync(Guid id)
    {
        // Kiểm tra xem location có được tham thiếu từ property nào hay không
        var location = await _locationRepository.GetLocationByIdAsync(id).ConfigureAwait(false);

        if (location == null)
        {
            return new LocationResult
            {
                IsSuccess = false,
                Message = "Location not found"
            };
        }

        // GetPropertyByLocationIdAsync
        var properties = await _locationRepository.GetPropertyByLocationIdAsync(id).ConfigureAwait(false);

        if (properties.Any())
        {
            return new LocationResult
            {
                IsSuccess = false,
                Message = "Location is being referenced by properties"
            };
        }

        var success = await _locationRepository.DeleteLocationAsync(id).ConfigureAwait(false);
        return new LocationResult
        {
            IsSuccess = success,
            Message = success ? "Location deleted successfully" : "Failed to delete location",
            LocationId = id.ToString()
        };
    }

    public async Task<LocationResult> UpdateLocationImageUrlAsync(Guid locationId, string imageUrl)
    {
        var location = await _locationRepository.GetLocationByIdAsync(locationId).ConfigureAwait(false);
        if (location == null)
        {
            return NotFoundResult("Location not found");
        }

        location.ImageUrl = imageUrl;
        var updatedLocation = await _locationRepository.UpdateLocationAsync(location).ConfigureAwait(false);

        return BuildResult(updatedLocation, "Image URL updated successfully", "Failed to update image URL");
    }

    private LocationResult BuildResult(Location location, string successMessage, string failureMessage)
    {
        return new LocationResult
        {
            IsSuccess = location != null,
            Message = location != null ? successMessage : failureMessage,
            Location = location != null ? ConvertToDto(location) : null,
            LocationId = location?.Id.ToString()
        };
    }

    private static LocationResult NotFoundResult(string message)
    {
        return new LocationResult
        {
            IsSuccess = false,
            Message = message
        };
    }

    // Chuyển đổi từ Location sang LocationDto
    private LocationDto ConvertToDto(Location location) => new LocationDto
    {
        Id = location.Id,
        City = location.City,
        Country = location.Country,
        Latitude = location.Latitude,
        Longitude = location.Longitude,
        GoogleMapsUrl = location.GoogleMapsUrl,
        ImageUrl = location.ImageUrl
    };

    // Chuyển đổi từ LocationDto sang Location
    private static Location ConvertToEntity(LocationDto locationDto) => new Location
    {
        City = locationDto.City,
        Country = locationDto.Country,
        Latitude = locationDto.Latitude ?? default,
        Longitude = locationDto.Longitude ?? default,
        GoogleMapsUrl = locationDto.GoogleMapsUrl
    };

    // Cập nhật một Location từ LocationDto, không bao gồm ImageUrl
    private static void UpdateEntity(Location location, LocationDto locationDto)
    {
        location.City = locationDto.City;
        location.Country = locationDto.Country;
        location.Latitude = locationDto.Latitude ?? default;
        location.Longitude = locationDto.Longitude ?? default;
        location.GoogleMapsUrl = locationDto.GoogleMapsUrl;
    }
}

