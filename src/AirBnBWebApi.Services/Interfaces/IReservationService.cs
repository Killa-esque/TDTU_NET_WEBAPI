// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Services.Interfaces;

public interface IReservationService
{
    Task<ReservationResult> GetAllReservationsAsync();
    Task<ReservationResult> GetReservationByIdAsync(Guid reservationId);
    Task<ReservationResult> CreateReservationAsync(ReservationDto reservationDto);
    Task<ReservationResult> UpdateReservationAsync(Guid reservationId, ReservationDto reservationDto);
    Task<ReservationResult> DeleteReservationAsync(Guid reservationId);
    Task<ReservationResult> CheckAvailabilityAsync(CheckAvailabilityDto request);
    Task<ReservationResult> CancelReservationAsync(CancelReservationDto request);
    Task<ReservationResult> GetCurrentReservationStatus(Guid reservationId);
    // Lấy danh sách các phòng chuẩn bị checkout của host đó
    Task<ReservationResult> GetCheckOutReservationsByHostId(Guid hostId);
    // Hiện đang đón tiếp: Những đặt phòng đang diễn ra trong khoảng thời gian check-in và check-out
    Task<ReservationResult> GetCurrentReservationsByHostId(Guid hostId);
    // Sắp tới: Các đặt phòng tương lai, chưa đến thời gian check-in.
    Task<ReservationResult> GetUpcomingReservationsByHostId(Guid hostId);
    // Lấy danh sách phòng đang đợi host xác nhận
    Task<ReservationResult> GetPendingReservationsByHostId(Guid hostId);
    // Chủ phòng xác nhận đặt phòng
    Task<ReservationResult> ConfirmReservationByHostAsync(ConfirmReservationDto request);
    Task<ReservationResult> GetCompletedReservationsByUserId(Guid userId);
    // GetRevenueByHostId
    Task<ReservationResult> GetRevenueByHostId(Guid hostId);
}
