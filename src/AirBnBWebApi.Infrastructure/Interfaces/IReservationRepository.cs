// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IReservationRepository
{
    Task<IEnumerable<Reservation>> GetAllReservationsAsync();
    Task<Reservation> GetReservationByIdAsync(Guid reservationId);
    Task<bool> CreateReservationAsync(Reservation reservation);
    Task<bool> UpdateReservationAsync(Reservation reservation);
    Task<bool> DeleteReservationAsync(Guid reservationId);
    Task<IEnumerable<Reservation>> GetReservationsByPropertyAndDateRangeAsync(Guid propertyId, DateTime startDate, DateTime endDate);
    Task<IEnumerable<Reservation>> GetAllReservationByUserIdAsync(Guid userId);
    Task<IEnumerable<Reservation>> GetAllReservationByHostIdAsync(Guid hostId);
}
