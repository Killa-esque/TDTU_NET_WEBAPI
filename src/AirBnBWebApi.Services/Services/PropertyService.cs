// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Core.Enums;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Helper;
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;

public class PropertyService : IPropertyService
{
    private readonly IPropertyRepository _propertyRepository;
    private readonly IAmenityRepository _amenityRepository;
    private readonly IHostRepository _hostRepository;
    private readonly ISlugHelper _slugHelper;

    public PropertyService(IPropertyRepository propertyRepository, IAmenityRepository amenityRepository, IHostRepository hostRepository, ISlugHelper slugHelper)
    {
        _propertyRepository = propertyRepository;
        _amenityRepository = amenityRepository;
        _hostRepository = hostRepository;
        _slugHelper = slugHelper;
    }

    public PropertyService(ISlugHelper slugHelper, IPropertyRepository propertyRepository)
    {
        _slugHelper = slugHelper;
        _propertyRepository = propertyRepository;
    }

    public async Task<PropertyResult> AddPropertyAsync(PropertyDto propertyDto)
    {
        var property = ConvertToEntity(propertyDto);

        // Tạo slug cho property từ tên và kiểm tra tính duy nhất của slug
        property.Slug = await _slugHelper.GenerateSlugAsync(property.PropertyName).ConfigureAwait(false);

        property.Id = Guid.NewGuid();
        property.IsDraft = true;
        property.IsPublished = false;
        property.PropertyStatus = PropertyStatusEnum.Available;
        property.CreatedAt = DateTime.UtcNow;
        property.UpdatedAt = DateTime.UtcNow;

        var result = await _propertyRepository.AddPropertyAsync(property).ConfigureAwait(false);
        return result ? new PropertyResult { IsSuccess = true, PropertyId = property.Id.ToString(), Message = "Property added successfully" } :
                        new PropertyResult { IsSuccess = false, Message = "Error adding property" };
    }

    public async Task<PropertyResult> UpdatePropertyAsync(Guid propertyId, PropertyDto propertyDto)
    {
        var property = await _propertyRepository.GetPropertyByIdAsync(propertyId).ConfigureAwait(false);
        if (property == null)
        {
            return new PropertyResult { IsSuccess = false, Message = "Property not found" };
        }

        UpdateEntity(property, propertyDto);
        property.UpdatedAt = DateTime.UtcNow;

        var result = await _propertyRepository.UpdatePropertyAsync(property).ConfigureAwait(false);
        return result ? new PropertyResult { IsSuccess = true, PropertyId = propertyId.ToString(), Message = "Property updated successfully" } :
                        new PropertyResult { IsSuccess = false, Message = "Error updating property" };
    }

    public async Task<PropertyResult> DeletePropertyAsync(Guid propertyId)
    {
        var result = await _propertyRepository.DeletePropertyAsync(propertyId).ConfigureAwait(false);
        return result ? new PropertyResult { IsSuccess = true, PropertyId = propertyId.ToString(), Message = "Property deleted successfully" } :
                        new PropertyResult { IsSuccess = false, Message = "Error deleting property" };
    }

    public async Task<PropertyResult> GetAllPropertiesAsync()
    {
        var properties = await _propertyRepository.GetAllPropertiesAsync().ConfigureAwait(false);
        var propertyDtos = properties.Select(ConvertToDto).ToList();

        return new PropertyResult
        {
            IsSuccess = true,
            Message = "Properties found",
            Properties = propertyDtos
        };
    }

    public async Task<PropertyResult> GetPropertyBySlugAsync(string slug)
    {
        var property = await _propertyRepository.GetPropertyBySlugAsync(slug).ConfigureAwait(false);
        if (property == null)
        {
            return new PropertyResult
            {
                IsSuccess = false,
                Message = "Property not found"
            };
        }

        return new PropertyResult
        {
            IsSuccess = true,
            Message = "Property found",
            Property = ConvertToDto(property)
        };
    }

    public async Task<PropertyResult> GetPropertiesByHostIdAsync(Guid hostId)
    {
        var properties = await _propertyRepository.GetPropertiesByHostIdAsync(hostId).ConfigureAwait(false);
        var propertyDtos = properties.Select(ConvertToDto).ToList();

        return new PropertyResult
        {
            IsSuccess = true,
            Properties = propertyDtos
        };
    }

    public async Task<PropertyResult> GetPropertiesByLocationIdAsync(Guid locationId)
    {
        var properties = await _propertyRepository.GetPropertiesByLocationIdAsync(locationId).ConfigureAwait(false);
        var propertyDtos = properties.Select(ConvertToDto).ToList();

        return new PropertyResult
        {
            IsSuccess = true,
            Properties = propertyDtos
        };
    }

    public async Task<PropertyResult> GetPropertiesByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        var properties = await _propertyRepository.GetPropertiesByPriceRangeAsync(minPrice, maxPrice).ConfigureAwait(false);
        var propertyDtos = properties.Select(ConvertToDto).ToList();

        return new PropertyResult
        {
            IsSuccess = true,
            Properties = propertyDtos
        };
    }

    public async Task<PropertyResult> GetPropertiesByTypeAsync(PropertyTypeEnum propertyType)
    {
        var properties = await _propertyRepository.GetPropertiesByTypeAsync(propertyType).ConfigureAwait(false);
        var propertyDtos = properties.Select(ConvertToDto).ToList();

        return new PropertyResult
        {
            IsSuccess = true,
            Properties = propertyDtos
        };
    }

    public async Task<PropertyResult> GetPropertiesByStatusAsync(PropertyStatusEnum propertyStatus)
    {
        var properties = await _propertyRepository.GetPropertiesByStatusAsync(propertyStatus).ConfigureAwait(false);
        var propertyDtos = properties.Select(ConvertToDto).ToList();

        return new PropertyResult
        {
            IsSuccess = true,
            Properties = propertyDtos
        };
    }

    public async Task<PropertyResult> GetPropertyByIdAsync(Guid propertyId)
    {
        var property = await _propertyRepository.GetPropertyByIdAsync(propertyId).ConfigureAwait(false);
        if (property == null)
        {
            return new PropertyResult
            {
                IsSuccess = false,
                Message = "Property not found"
            };
        }

        return new PropertyResult
        {
            IsSuccess = true,
            Message = "Property found",
            Property = ConvertToDto(property)
        };
    }
    public async Task<PropertyResult> SearchPropertiesAsync(PropertySearchDto searchDto)
    {
        var properties = await _propertyRepository.SearchPropertiesAsync(searchDto).ConfigureAwait(false);

        if (properties == null)
        {
            return new PropertyResult
            {
                IsSuccess = false,
                Message = "No properties found"
            };
        }

        return new PropertyResult
        {
            IsSuccess = true,
            Message = "Properties found",
            Properties = properties.Select(p => new PropertyDto
            {
                Id = p.Id,
                PropertyName = p.PropertyName,
                PropertyPricePerNight = p.PropertyPricePerNight,
                Bathrooms = p.Bathrooms,
                Bedrooms = p.Bedrooms,
                Guests = p.Guests,
                PropertyImageUrls = p.PropertyImages.Select(img => img.ImageUrl).ToList()
            }).ToList()
        };
    }



    // public async Task<PropertyResult> UpdatePropertyAsync(Guid propertyId, UpdatePropertyDto updatedProperty)
    // {
    //     var property = await _propertyRepository.GetPropertyByIdAsync(propertyId).ConfigureAwait(false);
    //     if (property == null)
    //     {
    //         throw new KeyNotFoundException("Property not found");
    //     }

    //     property.PropertyName = updatedProperty.PropertyName;
    //     property.PropertyDescription = updatedProperty.PropertyDescription;
    //     property.PropertyPricePerNight = updatedProperty.PropertyPricePerNight;
    //     property.Guests = updatedProperty.Guests;
    //     property.Bedrooms = updatedProperty.Bedrooms;
    //     property.Beds = updatedProperty.Beds;
    //     property.Bathrooms = updatedProperty.Bathrooms;
    //     property.Address = updatedProperty.Address;
    //     property.PropertyType = updatedProperty.PropertyType;
    //     property.UpdatedAt = DateTime.UtcNow;

    //     var result = await _propertyRepository.UpdatePropertyAsync(property).ConfigureAwait(false);

    //     if (!result)
    //     {
    //         return new PropertyResult
    //         {
    //             IsSuccess = false,
    //             Message = "An error occurred while updating the property",
    //             PropertyId = propertyId.ToString()
    //         };
    //     }

    //     return new PropertyResult
    //     {
    //         IsSuccess = true,
    //         Message = "Property updated successfully",
    //         PropertyId = propertyId.ToString()
    //     };

    // }

    public async Task<PropertyResult> PublishPropertyAsync(string slug)
    {
        var property = await _propertyRepository.GetPropertyBySlugAsync(slug).ConfigureAwait(false);
        if (property == null)
        {
            throw new KeyNotFoundException("Property not found");
        }

        property.IsDraft = false;
        property.IsPublished = true;
        property.UpdatedAt = DateTime.UtcNow;

        var result = await _propertyRepository.UpdatePropertyAsync(property).ConfigureAwait(false);

        if (!result)
        {
            return new PropertyResult
            {
                IsSuccess = false,
                Message = "An error occurred while publishing the property",
                PropertyId = property.Id.ToString()
            };
        }

        return new PropertyResult
        {
            IsSuccess = true,
            Message = "Property published successfully",
            PropertyId = property.Id.ToString()
        };
    }

    public async Task<AmenityResult> GetAmenitiesByPropertyIdAsync(Guid propertyId)
    {
        var amenities = await _propertyRepository.GetAmenitiesByPropertyIdAsync(propertyId).ConfigureAwait(false);


        if (amenities == null)
        {
            Console.WriteLine("No amenities found for this property");
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "No amenities found for this property"
            };
        }

        var amenitiesDto = new List<AmenityDto>();

        foreach (var amenity in amenities)
        {
            var amenityDto = new AmenityDto
            {
                Id = amenity.Id,
                Name = amenity.Name,
                Description = amenity.Description,
                Icon = amenity.Icon
            };

            amenitiesDto.Add(amenityDto);
        }

        return new AmenityResult
        {
            IsSuccess = true,
            Message = "Amenities retrieved successfully",
            Amenities = amenitiesDto
        };
    }
    public async Task<AmenityResult> GetAmenitiesByPropertySlugAsync(string slug)
    {
        var amenities = await _propertyRepository.GetAmenitiesBySlugAsync(slug).ConfigureAwait(false);

        if (amenities == null)
        {
            Console.WriteLine("No amenities found for this property");
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "No amenities found for this property"
            };
        }

        var amenitiesDto = new List<AmenityDto>();

        foreach (var amenity in amenities)
        {
            var amenityDto = new AmenityDto
            {
                Id = amenity.Id,
                Name = amenity.Name,
                Description = amenity.Description,
                Icon = amenity.Icon
            };

            amenitiesDto.Add(amenityDto);
        }

        return new AmenityResult
        {
            IsSuccess = true,
            Message = "Amenities retrieved successfully",
            Amenities = amenitiesDto
        };
    }

    public async Task<AmenityResult> AddAmenitiesToPropertyAsync(Guid propertyId, List<Guid> amenityIds)
    {
        // Lấy danh sách amenities từ propertyId hiện tại để check có amenities nào đã tồn tại không
        var existingAmenities = await _propertyRepository.GetAmenitiesByPropertyIdAsync(propertyId).ConfigureAwait(false);

        if (existingAmenities == null)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "Property not found"
            };
        }

        // Nếu danh sách mới có tồn tại bât kỳ amenities nào trong danh sách cũ thì trả về thông báo lỗi
        if (amenityIds.Any(id => existingAmenities.Any(a => a.Id == id)))
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "One or more amenities already exist for this property"
            };
        }

        var propertyAmenities = amenityIds.Select(amenityId => new PropertyAmenity
        {
            PropertyId = propertyId,
            AmenityId = amenityId,
            Id = Guid.NewGuid()
        }).ToList();

        var result = await _propertyRepository.AddAmenitiesToPropertyAsync(propertyAmenities).ConfigureAwait(false);

        if (!result)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "An error occurred while adding amenities to the property"
            };
        }

        return new AmenityResult
        {
            IsSuccess = true,
            Message = "Amenities added successfully",
            AmenityId = propertyId.ToString()
        };
    }

    public async Task<PropertyResult> PatchPropertyAsync(string slug, UpdatePropertyDto propertyDto)
    {
        var property = await _propertyRepository.GetPropertyBySlugAsync(slug).ConfigureAwait(false);
        if (property == null)
        {
            return new PropertyResult { IsSuccess = false, Message = "Property not found" };
        }

        // Update only provided fields
        if (propertyDto.PropertyName != null)
        {
            property.PropertyName = propertyDto.PropertyName;
        }

        if (propertyDto.PropertyDescription != null)
        {
            property.PropertyDescription = propertyDto.PropertyDescription;
        }

        if (propertyDto.PropertyPricePerNight != null)
        {
            property.PropertyPricePerNight = propertyDto.PropertyPricePerNight.Value;
        }

        if (propertyDto.Guests != null)
        {
            property.Guests = propertyDto.Guests.Value;
        }

        if (propertyDto.Bedrooms != null)
        {
            property.Bedrooms = propertyDto.Bedrooms.Value;
        }

        if (propertyDto.Beds != null)
        {
            property.Beds = propertyDto.Beds.Value;
        }

        if (propertyDto.Bathrooms != null)
        {
            property.Bathrooms = propertyDto.Bathrooms.Value;
        }

        if (propertyDto.Address != null)
        {
            property.Address = propertyDto.Address;
        }

        if (propertyDto.PropertyType != null)
        {
            property.PropertyType = propertyDto.PropertyType.Value;
        }

        if (propertyDto.LocationId != null)
        {
            property.LocationId = propertyDto.LocationId.Value;
        }

        property.UpdatedAt = DateTime.UtcNow;

        var result = await _propertyRepository.UpdatePropertyAsync(property).ConfigureAwait(false);

        return result ? new PropertyResult { IsSuccess = true, PropertyId = property.Id.ToString(), Message = "Property updated successfully" } :
                        new PropertyResult { IsSuccess = false, Message = "Error updating property" };
    }

    public async Task<PropertyResult> UpdateAmenitiesForPropertyAsync(string slug, List<Guid> amenityIds)
    {
        var property = await _propertyRepository.GetPropertyBySlugAsync(slug).ConfigureAwait(false);
        // Lấy danh sách amenities từ propertyId hiện tại để check có amenities nào đã tồn tại không
        var existingAmenities = await _propertyRepository.GetAmenitiesByPropertyIdAsync(property.Id).ConfigureAwait(false);

        if (existingAmenities == null)
        {
            return new PropertyResult
            {
                IsSuccess = false,
                Message = "Property not found"
            };
        }

        //  Lấy danh sách mới đè lại danh sách cũ
        var propertyAmenities = amenityIds.Select(amenityId => new PropertyAmenity
        {
            PropertyId = property.Id,
            AmenityId = amenityId,
            Id = Guid.NewGuid()
        }).ToList();

        var result = await _propertyRepository.UpdateAmenitiesForPropertyAsync(property.Id, propertyAmenities).ConfigureAwait(false);

        if (!result)
        {
            return new PropertyResult
            {
                IsSuccess = false,
                Message = "An error occurred while updating amenities for the property"
            };
        }

        return new PropertyResult
        {
            IsSuccess = true,
            Message = "Amenities updated successfully",
        };
    }

    public async Task<AmenityResult> RemoveAmenityFromPropertyAsync(Guid propertyId, Guid amenityId)
    {
        var property = await _propertyRepository.GetPropertyByIdAsync(propertyId).ConfigureAwait(false);
        if (property == null)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "Property not found"
            };
        }

        var amenity = await _amenityRepository.GetAmenityByIdAsync(amenityId).ConfigureAwait(false);
        if (amenity == null)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "Amenity not found"
            };
        }

        var removeResult = await _propertyRepository.RemoveAmenityFromPropertyAsync(propertyId, amenityId).ConfigureAwait(false);

        if (!removeResult)
        {
            return new AmenityResult
            {
                IsSuccess = false,
                Message = "An error occurred while removing amenity from the property"
            };
        }

        return new AmenityResult
        {
            IsSuccess = true,
            Message = "Amenity removed successfully",
            AmenityId = amenityId.ToString()
        };
    }

    public async Task<HostResult> GetHostDetailsByPropertyIdAsync(Guid propertyId)
    {
        var host = await _propertyRepository.GetHostByPropertyIdAsync(propertyId).ConfigureAwait(false);

        if (host == null)
        {
            return new HostResult
            {
                IsSuccess = false,
                Message = "Host not found for the given property"
            };
        }

        var totalProperties = await _hostRepository.GetTotalPropertiesAsync(host.Id).ConfigureAwait(false);
        var totalReviews = await _hostRepository.GetTotalReviewsAsync(host.Id).ConfigureAwait(false);
        var averageRating = await _hostRepository.GetAverageRatingAsync(host.Id).ConfigureAwait(false);
        var hostExperience = await _hostRepository.GetHostExperienceAsync(host.Id).ConfigureAwait(false);

        return new HostResult
        {
            IsSuccess = true,
            Host = new HostDto
            {
                Id = host.Id,
                FullName = host.FullName,
                Email = host.Email,
                PhoneNumber = host.PhoneNumber,
                Avatar = host.Avatar,
                Experience = hostExperience,
                TotalProperties = totalProperties,
                TotalReviews = totalReviews,
                AverageRating = Math.Round(averageRating ?? 0, 2),
            }
        };
    }

    // public async Task<PropertyResult> CheckPropertyAvailabilityAsync(Guid propertyId, DateTime checkInDate, DateTime checkOutDate)
    // {
    //     var property = await _propertyRepository.GetPropertyByIdAsync(propertyId).ConfigureAwait(false);
    //     if (property == null)
    //     {
    //         return new PropertyResult
    //         {
    //             IsSuccess = false,
    //             Message = "Property not found"
    //         };
    //     }

    //     var result = await _propertyRepository.CheckPropertyAvailabilityAsync(propertyId, checkInDate, checkOutDate).ConfigureAwait(false);

    //     // If result is true, property is available, else it is booked other is Unvaialable

    //     return result ? new PropertyResult { IsSuccess = true, Message = "Property is available", PropertyStatus = PropertyStatusEnum.Available } :
    //                     new PropertyResult { IsSuccess = false, Message = "Property is not available", PropertyStatus = PropertyStatusEnum.Booked };
    // }

    private static PropertyDto ConvertToDto(Property property)
    {
        return new PropertyDto
        {
            Id = property.Id,
            PropertyName = property.PropertyName,
            PropertyDescription = property.PropertyDescription,
            PropertyPricePerNight = property.PropertyPricePerNight,
            PropertyStatus = property.PropertyStatus,
            PropertyType = property.PropertyType,
            Guests = property.Guests,
            Bedrooms = property.Bedrooms,
            Beds = property.Beds,
            Bathrooms = property.Bathrooms,
            Address = property.Address,
            Slug = property.Slug,
            IsDraft = property.IsDraft,
            IsPublished = property.IsPublished,
            CreatedAt = property.CreatedAt,
            UpdatedAt = property.UpdatedAt,
            LocationId = property.LocationId,
            HostId = property.HostId,
            PropertyImageUrls = property.PropertyImages.Select(img => img.ImageUrl).ToList()
        };
    }

    // Chuyển đổi từ PropertyDto sang Property
    private static Property ConvertToEntity(PropertyDto propertyDto)
    {
        return new Property
        {
            Id = propertyDto.Id.GetValueOrDefault(),
            PropertyName = propertyDto.PropertyName,
            PropertyDescription = propertyDto.PropertyDescription,
            PropertyPricePerNight = propertyDto.PropertyPricePerNight,
            // PropertyStatus = propertyDto.PropertyStatus,
            PropertyType = propertyDto.PropertyType,
            Guests = propertyDto.Guests,
            Bedrooms = propertyDto.Bedrooms,
            Beds = propertyDto.Beds,
            Bathrooms = propertyDto.Bathrooms,
            Address = propertyDto.Address,
            IsDraft = propertyDto.IsDraft ?? false,
            IsPublished = propertyDto.IsPublished ?? false,
            LocationId = propertyDto.LocationId,
            HostId = propertyDto.HostId
        };
    }

    // Cập nhật Property entity từ PropertyDto
    private static void UpdateEntity(Property property, PropertyDto propertyDto)
    {
        property.PropertyName = propertyDto.PropertyName;
        property.PropertyDescription = propertyDto.PropertyDescription;
        property.PropertyPricePerNight = propertyDto.PropertyPricePerNight;
        // property.PropertyStatus = propertyDto.PropertyStatus;
        property.PropertyType = propertyDto.PropertyType;
        property.Guests = propertyDto.Guests;
        property.Bedrooms = propertyDto.Bedrooms;
        property.Beds = propertyDto.Beds;
        property.Bathrooms = propertyDto.Bathrooms;
        property.Address = propertyDto.Address;
        // property.IsDraft = propertyDto.IsDraft;
        // property.IsPublished = propertyDto.IsPublished;
        property.LocationId = propertyDto.LocationId;
        property.HostId = propertyDto.HostId;
        property.UpdatedAt = DateTime.UtcNow;
    }
}
