// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Globalization;
using System.Security.Claims;
using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Enums;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Controllers; [ApiController]
[Route("api/[controller]")]
public class ReservationController : ControllerBase
{
    private readonly IReservationService _reservationService;

    public ReservationController(IReservationService reservationService)
    {
        _reservationService = reservationService;
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetReservations()
    {
        var result = await _reservationService.GetAllReservationsAsync().ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.Reservations, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [Authorize]
    [HttpGet("{id}")]
    public async Task<IActionResult> GetReservationById([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Invalid reservation ID");
        }

        var result = await _reservationService.GetReservationByIdAsync(id).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.Reservation, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> CreateReservation([FromBody] ReservationDto reservationDto)
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        if (!Guid.TryParse(reservationDto.UserId.ToString(), out var reservationUserId) || userId != reservationUserId)
        {
            return ResponseHelper.Forbidden("User is not authorized to create reservation for another user.");
        }

        if (reservationDto == null)
        {
            return ResponseHelper.BadRequest("Invalid reservation data");
        }

        var result = await _reservationService.CreateReservationAsync(reservationDto).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Created(result.ReservationId, result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [Authorize]
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReservation([FromRoute] Guid id, [FromBody] ReservationDto reservationDto)
    {
        if (id == Guid.Empty || reservationDto == null)
        {
            return BadRequest("Invalid reservation data");
        }

        var result = await _reservationService.UpdateReservationAsync(id, reservationDto).ConfigureAwait(false);
        return result.IsSuccess ? Ok(result.Message) : BadRequest(result.Message);
    }

    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReservation([FromRoute] Guid id)
    {
        if (id == Guid.Empty)
        {
            return BadRequest("Invalid reservation ID");
        }

        var result = await _reservationService.DeleteReservationAsync(id).ConfigureAwait(false);
        return result.IsSuccess ? Ok(result.Message) : BadRequest(result.Message);
    }

    [HttpPost("check-availability")]
    public async Task<IActionResult> CheckPropertyAvailability([FromBody] CheckAvailabilityDto request)
    {
        if (request == null || request.PropertyId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid request data.");
        }

        if (!DateTime.TryParse(request.StartDate.ToString(CultureInfo.InvariantCulture), out _) || !DateTime.TryParse(request.EndDate.ToString(CultureInfo.InvariantCulture), out _))
        {
            return ResponseHelper.BadRequest("Invalid date format.");
        }

        if (request.EndDate <= request.StartDate)
        {
            return ResponseHelper.BadRequest("End date must be later than start date.");
        }

        var result = await _reservationService.CheckAvailabilityAsync(request).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Availability, result.Message)
            : ResponseHelper.Success(result.Availability, result.Message);
    }

    [HttpPost("cancel-reservation")]
    [Authorize]
    public async Task<IActionResult> CancelReservation([FromBody] CancelReservationDto request)
    {
        if (request == null || request.ReservationId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid request data.");
        }

        var reservation = await _reservationService.GetReservationByIdAsync(request.ReservationId).ConfigureAwait(false);

        if (!reservation.IsSuccess)
        {
            return ResponseHelper.NotFound("Reservation not found.");
        }

        var currentStatus = await _reservationService.GetCurrentReservationStatus(request.ReservationId).ConfigureAwait(false);

        if (currentStatus.IsSuccess && currentStatus.ReservationStatus != ReservationStatusEnum.Pending)
        {
            return ResponseHelper.BadRequest("Only pending reservation can be canceled.");
        }

        var result = await _reservationService.CancelReservationAsync(request).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }

    [HttpGet("check-out")]
    [Authorize]
    public async Task<IActionResult> GetCheckOutReservations()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        // Get role from token
        // new Claim("role", role ?? string.Empty),
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        Console.WriteLine("Role >>>" + role);

        if (role != "Host")
        {
            return ResponseHelper.Forbidden("User is not authorized to access this resource.");
        }

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _reservationService.GetCheckOutReservationsByHostId(userId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Reservations, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    // Hiện đang đón tiếp: Những đặt phòng đang diễn ra trong khoảng thời gian check-in và check-out
    [HttpGet("current")]
    [Authorize]
    public async Task<IActionResult> GetCurrentReservations()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var hostId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _reservationService.GetCurrentReservationsByHostId(hostId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Reservations, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    // Sắp tới: Các đặt phòng tương lai, chưa đến thời gian check-in.
    [HttpGet("upcoming")]
    [Authorize]
    public async Task<IActionResult> GetUpcomingReservations()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var hostId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _reservationService.GetUpcomingReservationsByHostId(hostId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Reservations, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    // Lấy danh sách phòng đang đợi host xác nhận
    [HttpGet("pending")]
    [Authorize]
    public async Task<IActionResult> GetPendingReservations()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var hostId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _reservationService.GetPendingReservationsByHostId(hostId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Reservations, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    // Chủ phòng xác nhận đặt phòng
    [HttpPost("confirm-reservation")]
    [Authorize]
    public async Task<IActionResult> ConfirmReservation([FromBody] ConfirmReservationDto request)
    {
        if (request == null || request.ReservationId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid request data.");
        }

        var result = await _reservationService.ConfirmReservationByHostAsync(request).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Message)
            : ResponseHelper.BadRequest(result.Message);
    }

    // Lấy danh sách các phone đã hoàn thành của người dùng
    [HttpGet("completed")]
    [Authorize]
    public async Task<IActionResult> GetCompletedReservations()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var userId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _reservationService.GetCompletedReservationsByUserId(userId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Reservations, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

    // Get Revenue by Host
    [HttpGet("revenue")]
    [Authorize]
    public async Task<IActionResult> GetRevenueByHost()
    {
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var hostId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _reservationService.GetRevenueByHostId(hostId).ConfigureAwait(false);

        return result.IsSuccess
            ? ResponseHelper.Success(result.Revenue, result.Message)
            : ResponseHelper.NotFound(result.Message);
    }

}
