// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Core.Enums;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AirBnBWebApi.Infrastructure.Repository;

public class PropertyRepository : IPropertyRepository
{
    private readonly AirBnBDbContext _context;

    public PropertyRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Property>> GetAllPropertiesAsync()
    {
        // return properties with property images and isPublished = true and isDraft = false
        return await _context.Properties
            .Where(p => p.IsPublished && !p.IsDraft)
            .Include(p => p.PropertyImages)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<Property> GetPropertyByIdAsync(Guid propertyId)
    {
        return await _context.Properties
            .Include(p => p.PropertyImages)
            .FirstOrDefaultAsync(p => p.Id == propertyId).ConfigureAwait(false);
    }

    public async Task<IEnumerable<Property>> SearchPropertiesAsync(PropertySearchDto searchDto)
    {
        var query = _context.Properties
            .Include(p => p.PropertyImages)
            .Include(p => p.PropertyAmenities)
                .ThenInclude(pa => pa.Amenity)
            .AsQueryable();

        // Filter by location
        if (searchDto.LocationId != Guid.Empty)
        {
            query = query.Where(p => p.LocationId == searchDto.LocationId);
        }

        // Filter by guest count
        if (searchDto.GuestCount > 0)
        {
            query = query.Where(p => p.Guests >= searchDto.GuestCount);
        }

        // Filter by price range
        if (searchDto.MinPrice > 0 || searchDto.MaxPrice > 0)
        {
            query = query.Where(p => p.PropertyPricePerNight >= searchDto.MinPrice
                                     && p.PropertyPricePerNight <= searchDto.MaxPrice);
        }

        // Filter by number of bathrooms and bedrooms
        if (searchDto.Bathrooms > 0)
        {
            query = query.Where(p => p.Bathrooms >= searchDto.Bathrooms);
        }
        if (searchDto.Bedrooms > 0)
        {
            query = query.Where(p => p.Bedrooms >= searchDto.Bedrooms);
        }

        // Filter by amenities
        if (searchDto.Amenities.Any())
        {
            query = query.Where(p => p.PropertyAmenities
                .Any(pa => searchDto.Amenities.Contains(pa.AmenityId)));
        }

        // Filter by availability (start and end date)
        if (searchDto.StartDate != DateTime.MinValue && searchDto.EndDate != DateTime.MinValue)
        {
            query = query.Where(p => !_context.Reservations
                .Any(r => r.PropertyId == p.Id &&
                          ((r.CheckInDate >= searchDto.StartDate && r.CheckInDate <= searchDto.EndDate) ||
                           (r.CheckOutDate >= searchDto.StartDate && r.CheckOutDate <= searchDto.EndDate))));
        }

        return await query.ToListAsync().ConfigureAwait(false);
    }

    public async Task<bool> AddPropertyAsync(Property property)
    {
        await _context.Properties.AddAsync(property).ConfigureAwait(false);

        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> UpdatePropertyAsync(Property property)
    {
        _context.Properties.Update(property);

        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;

    }

    public async Task<bool> DeletePropertyAsync(Guid propertyId)
    {
        var property = await _context.Properties.FindAsync(propertyId).ConfigureAwait(false);
        if (property != null)
        {
            _context.Properties.Remove(property);
            return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
        }
        return false;
    }

    public async Task<IEnumerable<Property>> GetPropertiesByHostIdAsync(Guid hostId)
    {
        return await _context.Properties
            .Where(p => p.HostId == hostId)
            .Include(p => p.PropertyImages)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<Property>> GetPropertiesByLocationIdAsync(Guid locationId)
    {
        return await _context.Properties
            .Where(p => p.LocationId == locationId)
            .Include(p => p.PropertyImages)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<Property>> GetPropertiesByPriceRangeAsync(decimal minPrice, decimal maxPrice)
    {
        return await _context.Properties
            .Where(p => p.PropertyPricePerNight >= minPrice && p.PropertyPricePerNight <= maxPrice)
            .Include(p => p.PropertyImages)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<Property>> GetPropertiesByTypeAsync(PropertyTypeEnum propertyType)
    {
        return await _context.Properties
            .Where(p => p.PropertyType == propertyType)
            .Include(p => p.PropertyImages)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<Property>> GetPropertiesByStatusAsync(PropertyStatusEnum propertyStatus)
    {
        return await _context.Properties
            .Where(p => p.PropertyStatus == propertyStatus)
            .Include(p => p.PropertyImages)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<List<Amenity>> GetAmenitiesByPropertyIdAsync(Guid propertyId)
    {
        return await _context.PropertyAmenities
            .Where(pa => pa.PropertyId == propertyId)
            .Select(pa => pa.Amenity)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<bool> AddAmenitiesToPropertyAsync(List<PropertyAmenity> propertyAmenities)
    {
        await _context.PropertyAmenities.AddRangeAsync(propertyAmenities).ConfigureAwait(false);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> RemoveAmenityFromPropertyAsync(Guid propertyId, Guid amenityId)
    {
        var propertyAmenity = await _context.PropertyAmenities
            .FirstOrDefaultAsync(pa => pa.PropertyId == propertyId && pa.AmenityId == amenityId)
            .ConfigureAwait(false);

        if (propertyAmenity == null)
        {
            return false;
        }

        _context.PropertyAmenities.Remove(propertyAmenity);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<User> GetHostByPropertyIdAsync(Guid propertyId)
    {
        var property = await _context.Properties
            .Where(p => p.Id == propertyId)
            .Select(p => p.HostId) // Lấy HostId từ Property
            .FirstOrDefaultAsync()
            .ConfigureAwait(false);

        if (property == Guid.Empty)
        {
            return null;
        }

        return await _context.Users
            .FirstOrDefaultAsync(u => u.Id == property)
            .ConfigureAwait(false);
    }

    public async Task<bool> CheckPropertyAvailabilityAsync(Guid propertyId, DateTime checkInDate, DateTime checkOutDate)
    {
        return await _context.Reservations
            .AnyAsync(b => b.PropertyId == propertyId &&
                           ((checkInDate >= b.CheckInDate && checkInDate <= b.CheckOutDate) ||
                            (checkOutDate >= b.CheckInDate && checkOutDate <= b.CheckOutDate)))
            .ConfigureAwait(false);
    }

    public async Task<bool> IsSlugExistsAsync(string slug)
    {
        return await _context.Properties
            .AnyAsync(p => p.Slug == slug).ConfigureAwait(false); // Kiểm tra xem có bất kỳ Property nào có slug trùng không
    }

    public async Task<Property> GetPropertyBySlugAsync(string slug)
    {
        return await _context.Properties
            .Include(p => p.PropertyImages)
            .FirstOrDefaultAsync(p => p.Slug == slug).ConfigureAwait(false);
    }

    public async Task<List<Amenity>> GetAmenitiesBySlugAsync(string slug)
    {
        return await _context.PropertyAmenities
            .Where(pa => pa.Property.Slug == slug)
            .Select(pa => pa.Amenity)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<bool> UpdateAmenitiesForPropertyAsync(Guid propertyId, List<PropertyAmenity> propertyAmenities)
    {
        var existingPropertyAmenities = await _context.PropertyAmenities
            .Where(pa => pa.PropertyId == propertyId)
            .ToListAsync()
            .ConfigureAwait(false);

        _context.PropertyAmenities.RemoveRange(existingPropertyAmenities);
        await _context.PropertyAmenities.AddRangeAsync(propertyAmenities).ConfigureAwait(false);

        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }
}
