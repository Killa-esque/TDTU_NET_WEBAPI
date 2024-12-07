// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Infrastructure.Interfaces;
using Microsoft.EntityFrameworkCore;

public class ReservationRepository : IReservationRepository
{
    private readonly AirBnBDbContext _context;

    public ReservationRepository(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Reservation>> GetAllReservationsAsync()
    {
        return await _context.Reservations
            .Include(r => r.Property)
            .Include(r => r.User)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<Reservation> GetReservationByIdAsync(Guid reservationId)
    {
        return await _context.Reservations
            .Include(r => r.Property)
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == reservationId)
            .ConfigureAwait(false);
    }

    public async Task<bool> CreateReservationAsync(Reservation reservation)
    {
        await _context.Reservations.AddAsync(reservation).ConfigureAwait(false);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> UpdateReservationAsync(Reservation reservation)
    {
        _context.Reservations.Update(reservation);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<bool> DeleteReservationAsync(Guid reservationId)
    {
        var reservation = await _context.Reservations.FindAsync(reservationId).ConfigureAwait(false);
        if (reservation == null)
        {
            return false;
        }

        _context.Reservations.Remove(reservation);
        return await _context.SaveChangesAsync().ConfigureAwait(false) > 0;
    }

    public async Task<IEnumerable<Reservation>> GetReservationsByPropertyAndDateRangeAsync(Guid propertyId, DateTime startDate, DateTime endDate)
    {
        return await _context.Reservations
            .Where(r => r.PropertyId == propertyId
                && r.CheckOutDate > startDate
                && r.CheckInDate < endDate)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<Reservation>> GetAllReservationByUserIdAsync(Guid userId)
    {
        return await _context.Reservations
            .Include(r => r.Property)
            .Include(r => r.User)
            .Where(r => r.UserId == userId)
            .ToListAsync()
            .ConfigureAwait(false);
    }

    public async Task<IEnumerable<Reservation>> GetAllReservationByHostIdAsync(Guid hostId)
    {
        return await _context.Reservations
            .Include(r => r.Property)
            .Include(r => r.User)
            .Where(r => r.Property.HostId == hostId)
            .ToListAsync()
            .ConfigureAwait(false);
    }

}
