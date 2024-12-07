// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.
using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Core.Enums;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;
public class ReservationService : IReservationService
{
    private readonly IReservationRepository _reservationRepository;
    private readonly IPropertyRepository _propertyRepository;
    private readonly IUserRepository _userRepository;

    public ReservationService(IReservationRepository reservationRepository, IPropertyRepository propertyRepository, IUserRepository userRepository)
    {
        _reservationRepository = reservationRepository;
        _propertyRepository = propertyRepository;
        _userRepository = userRepository;
    }

    public async Task<ReservationResult> GetAllReservationsAsync()
    {
        var reservations = await _reservationRepository.GetAllReservationsAsync().ConfigureAwait(false);
        if (reservations == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservations not found."
            };
        }

        var reservationDtos = reservations.Select(ConvertToDto).ToList();

        return new ReservationResult
        {
            IsSuccess = true,
            Reservations = reservationDtos,
            Message = "Reservations retrieved successfully."
        };
    }

    public async Task<ReservationResult> GetReservationByIdAsync(Guid reservationId)
    {
        var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId).ConfigureAwait(false);
        if (reservation == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservation not found."
            };
        }

        return new ReservationResult
        {
            IsSuccess = true,
            Reservation = ConvertToDto(reservation),
            Message = "Reservation retrieved successfully."
        };
    }

    public async Task<ReservationResult> CreateReservationAsync(ReservationDto reservationDto)
    {

        // Kiểm tra user đặt phòng tài khoản họ đã xác thực email chưa
        if (reservationDto.UserId == Guid.Empty)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "User not found."
            };
        }

        var user = await _userRepository.GetByIdAsync(reservationDto.UserId).ConfigureAwait(false);

        if (user == null || !user.IsEmailVerified)
        {
            return new ReservationResult
            {
                IsSuccess = true,
                Message = "Your email need to be verified before booking."
            };
        }

        var reservation = ConvertToEntity(reservationDto);
        reservation.Id = Guid.NewGuid();
        reservation.CreatedAt = DateTime.UtcNow;
        reservation.UpdatedAt = DateTime.UtcNow;

        // Check if a reservation already exists for the same property and date range
        var existingReservations = await _reservationRepository
            .GetReservationsByPropertyAndDateRangeAsync(reservation.PropertyId, reservation.CheckInDate, reservation.CheckOutDate)
            .ConfigureAwait(false);

        if (existingReservations.Any())
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Property is not available for the selected dates."
            };
        }

        // Tính toán giá tiền
        var property = await _propertyRepository.GetPropertyByIdAsync(reservation.PropertyId).ConfigureAwait(false);
        if (property == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Property not found."
            };
        }

        var days = (reservation.CheckOutDate - reservation.CheckInDate).Days;
        var basePrice = property.PropertyPricePerNight * days;

        decimal extraGuestFee = 0;

        if (reservation.Guests > property.Guests)
        {
            extraGuestFee = (reservation.Guests - property.Guests) * 20;
        }

        reservation.TotalPrice = basePrice + extraGuestFee;

        // Update Property Status
        property.PropertyStatus = PropertyStatusEnum.Booked;

        var propertyUpdateSuccess = await _propertyRepository.UpdatePropertyAsync(property).ConfigureAwait(false);
        var success = await _reservationRepository.CreateReservationAsync(reservation).ConfigureAwait(false);

        if (!success && !propertyUpdateSuccess)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Failed to create reservation."
            };
        }

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Reservation created successfully.",
            ReservationId = reservation.Id.ToString()
        };
    }

    public async Task<ReservationResult> UpdateReservationAsync(Guid reservationId, ReservationDto reservationDto)
    {
        var existingReservation = await _reservationRepository.GetReservationByIdAsync(reservationId).ConfigureAwait(false);
        if (existingReservation == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservation not found."
            };
        }

        existingReservation.CheckInDate = DateTime.Parse(reservationDto.CheckInDate, CultureInfo.InvariantCulture);
        existingReservation.CheckOutDate = DateTime.Parse(reservationDto.CheckOutDate, CultureInfo.InvariantCulture);
        existingReservation.Guests = reservationDto.Guests;
        existingReservation.SpecialRequests = reservationDto.SpecialRequests;
        existingReservation.UpdatedAt = DateTime.UtcNow;

        var success = await _reservationRepository.UpdateReservationAsync(existingReservation).ConfigureAwait(false);
        if (!success)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Failed to update reservation."
            };
        }

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Reservation updated successfully."
        };
    }

    public async Task<ReservationResult> DeleteReservationAsync(Guid reservationId)
    {
        var success = await _reservationRepository.DeleteReservationAsync(reservationId).ConfigureAwait(false);
        if (!success)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Failed to delete reservation."
            };
        }

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Reservation deleted successfully."
        };
    }

    public async Task<ReservationResult> CheckAvailabilityAsync(CheckAvailabilityDto request)
    {
        // Kiểm tra nếu có phòng đã được đặt trong khoảng thời gian
        var existingReservations = await _reservationRepository
            .GetReservationsByPropertyAndDateRangeAsync(request.PropertyId, request.StartDate, request.EndDate)
            .ConfigureAwait(false);

        if (existingReservations.Any())
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Property is not available for the selected dates.",
                Availability = new AvailabilityResponseDto
                {
                    IsAvailable = false,
                    PropertyId = request.PropertyId.ToString(),
                }
            };
        }

        // Lấy thông tin phòng
        var property = await _propertyRepository.GetPropertyByIdAsync(request.PropertyId).ConfigureAwait(false);
        if (property == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Property not found."
            };
        }

        // Tính giá
        var days = (request.EndDate - request.StartDate).Days;
        var basePrice = property.PropertyPricePerNight * days;

        // Kiểm tra số lượng khách
        decimal extraGuestFee = 0;
        if (request.Guests > property.Guests)
        {
            extraGuestFee = (request.Guests - property.Guests) * 20; // Phí phụ thêm 20$ cho mỗi khách vượt quá giới hạn
        }

        var totalPrice = basePrice + extraGuestFee;

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Property is available for the selected dates.",
            Availability = new AvailabilityResponseDto
            {
                IsAvailable = true,
                TotalPrice = totalPrice,
                PropertyId = request.PropertyId.ToString(),
            }
        };
    }

    public async Task<ReservationResult> CancelReservationAsync(CancelReservationDto request)
    {
        var reservation = await _reservationRepository.GetReservationByIdAsync(request.ReservationId).ConfigureAwait(false);

        if (reservation == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservation not found."
            };
        }
        // Update Reservation Status
        reservation.Status = ReservationStatusEnum.Cancelled;
        var success = await _reservationRepository.UpdateReservationAsync(reservation).ConfigureAwait(false);

        if (!success)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Failed to cancel reservation."
            };
        }

        // Update Property Status
        var property = await _propertyRepository.GetPropertyByIdAsync(reservation.PropertyId).ConfigureAwait(false);
        if (property == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Property not found."
            };
        }

        property.PropertyStatus = PropertyStatusEnum.Available;
        var propertyUpdateSuccess = await _propertyRepository.UpdatePropertyAsync(property).ConfigureAwait(false);

        // Chỉ cần cập nhật status, không cần xóa dữ liệu
        if (!propertyUpdateSuccess)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Failed to cancel reservation."
            };
        }

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Reservation cancelled successfully."
        };
    }

    // Get Current Reservation Status
    public async Task<ReservationResult> GetCurrentReservationStatus(Guid reservationId)
    {
        var reservation = await _reservationRepository.GetReservationByIdAsync(reservationId).ConfigureAwait(false);
        if (reservation == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservation not found."
            };
        }

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Reservation status retrieved successfully.",
            ReservationStatus = reservation.Status
        };
    }

    public async Task<ReservationResult> GetCheckOutReservationsByHostId(Guid hostId)
    {
        // Lấy danh sách tất cả các phòng của Host đó dựa trên hostId
        var reservations = await _reservationRepository.GetAllReservationByHostIdAsync(hostId).ConfigureAwait(false);
        // Lọc ra các phòng có trạng thái là "Confirmed" và ngày check-out là hôm nay
        var checkOutReservations = reservations.Where(r => r.Status == ReservationStatusEnum.Confirmed && r.CheckOutDate.Date == DateTime.UtcNow.Date).ToList();
        // Trả về danh sách các phòng sắp check-out
        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Check-out reservations retrieved successfully.",
            Reservations = checkOutReservations.Select(ConvertToDto).ToList()
        };
    }

    public async Task<ReservationResult> GetCurrentReservationsByHostId(Guid hostId)
    {
        // Lấy danh sách tất cả các phòng của Host đó dựa trên hostId
        var reservations = await _reservationRepository.GetAllReservationByHostIdAsync(hostId).ConfigureAwait(false);
        // Lọc ra các phòng có trạng thái là "Confirmed" và ngày check-in và check-out nằm trong khoảng thời gian hiện tạiq
        var currentReservations = reservations.Where(r => r.Status == ReservationStatusEnum.Confirmed && r.CheckInDate.Date <= DateTime.UtcNow.Date && r.CheckOutDate.Date >= DateTime.UtcNow.Date).ToList();
        // Trả về danh sách các phòng đang diễn ra
        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Current reservations retrieved successfully.",
            Reservations = currentReservations.Select(ConvertToDto).ToList()
        };

    }

    public async Task<ReservationResult> GetUpcomingReservationsByHostId(Guid hostId)
    {
        // Lấy danh sách tất cả các phòng của Host đó dựa trên hostId
        var reservations = await _reservationRepository.GetAllReservationByHostIdAsync(hostId).ConfigureAwait(false);
        // Lọc ra các phòng có trạng thái là "Confirmed" và ngày check-in lớn hơn ngày hiện tại
        var upcomingReservations = reservations.Where(r => r.Status == ReservationStatusEnum.Confirmed && r.CheckInDate.Date > DateTime.UtcNow.Date).ToList();
        // Trả về danh sách các phòng sắp tới
        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Upcoming reservations retrieved successfully.",
            Reservations = upcomingReservations.Select(ConvertToDto).ToList()
        };
    }

    public async Task<ReservationResult> GetPendingReservationsByHostId(Guid hostId)
    {
        // Lấy danh sách tất cả các phòng của Host đó dựa trên hostId
        var reservations = await _reservationRepository.GetAllReservationByHostIdAsync(hostId).ConfigureAwait(false);
        // Lọc ra các phòng có trạng thái là "Pending"
        var pendingReservations = reservations.Where(r => r.Status == ReservationStatusEnum.Pending).ToList();
        // Trả về danh sách các phòng đang đợi xác nhận
        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Pending reservations retrieved successfully.",
            Reservations = pendingReservations.Select(ConvertToDto).ToList()
        };
    }

    public async Task<ReservationResult> ConfirmReservationByHostAsync(ConfirmReservationDto request)
    {
        // Cập nhật trạng thái của đặt phòng từ "Pending" sang "Confirmed"
        var reservation = await _reservationRepository.GetReservationByIdAsync(request.ReservationId).ConfigureAwait(false);

        var property = await _propertyRepository.GetPropertyByIdAsync(reservation.PropertyId).ConfigureAwait(false);

        if (reservation == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservation not found."
            };
        }

        if (property == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Property not found."
            };
        }

        property.PropertyStatus = PropertyStatusEnum.Booked;
        var propertyUpdateSuccess = await _propertyRepository.UpdatePropertyAsync(property).ConfigureAwait(false);

        reservation.Status = ReservationStatusEnum.Confirmed;
        var success = await _reservationRepository.UpdateReservationAsync(reservation).ConfigureAwait(false);

        if (!success && !propertyUpdateSuccess)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Failed to confirm reservation."
            };
        }

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Reservation confirmed successfully."
        };
    }
    public async Task<ReservationResult> GetCompletedReservationsByUserId(Guid userId)
    {
        var reservations = await _reservationRepository.GetAllReservationsAsync().ConfigureAwait(false);

        if (reservations == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservations not found."
            };
        }

        foreach (var reservation in reservations)
        {
            if (reservation.Status == ReservationStatusEnum.Confirmed && reservation.CheckOutDate.Date < DateTime.UtcNow.Date)
            {
                reservation.Status = ReservationStatusEnum.Completed;
                await _reservationRepository.UpdateReservationAsync(reservation).ConfigureAwait(false);
            }
        }

        var userReservations = reservations.Where(r => r.UserId == userId).ToList();

        if (userReservations == null)
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservations not found."
            };
        }

        var completedReservations = userReservations.Where(r => r.Status == ReservationStatusEnum.Completed).ToList();
        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Completed reservations retrieved successfully.",
            Reservations = completedReservations.Select(ConvertToDto).ToList()
        };

    }

    public async Task<ReservationResult> GetRevenueByHostId(Guid hostId)
    {
        var reservations = await _reservationRepository.GetAllReservationByHostIdAsync(hostId).ConfigureAwait(false);
        if (reservations == null || !reservations.Any())
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "Reservations not found."
            };
        }

        var chartDatas = new List<ChartData>();

        // Lọc chỉ các reservation có trạng thái "Completed"
        var completedReservations = reservations.Where(r => r.Status == ReservationStatusEnum.Completed).ToList();

        if (!completedReservations.Any())
        {
            return new ReservationResult
            {
                IsSuccess = false,
                Message = "No completed reservations found."
            };
        }

        // Tính doanh thu theo ngày cho những reservation có trạng thái "Completed"
        var revenueByDate = completedReservations
            .GroupBy(r => r.CheckInDate.Date) // Group theo ngày (chỉ lấy phần ngày)
            .Select(g => new ChartData
            {
                Date = g.Key.ToString("yyyy-MM-dd", CultureInfo.InvariantCulture), // Chuyển ngày về định dạng yyyy-MM-dd
                Income = g.Sum(r => r.TotalPrice) // Tổng doanh thu cho ngày đó
            })
            .OrderBy(d => d.Date) // Sắp xếp theo ngày
            .ToList();

        // Lấy doanh thu của tháng hiện tại với trạng thái "Completed"
        var currentMonthIncome = completedReservations
            .Where(r => r.CheckInDate.Month == DateTime.UtcNow.Month)
            .Sum(r => r.TotalPrice);

        // Return RevenueDto
        var revenue = new RevenueDto
        {
            CurrentMonthIncome = currentMonthIncome,
            ChartDatas = revenueByDate
        };

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Revenue retrieved successfully.",
            Revenue = revenue
        };
    }

    // Convert Reservation entity to ReservationDto
    private static ReservationDto ConvertToDto(Reservation reservation)
    {
        return new ReservationDto
        {
            ReservationId = reservation.Id,
            PropertyId = reservation.PropertyId,
            UserId = reservation.UserId,
            TotalPrice = reservation.TotalPrice,
            GuestName = reservation.GuestName,
            PropertyName = reservation.PropertyName,
            CheckInDate = reservation.CheckInDate.ToString("o", CultureInfo.InvariantCulture),
            CheckOutDate = reservation.CheckOutDate.ToString("o", CultureInfo.InvariantCulture),
            Guests = reservation.Guests,
            SpecialRequests = reservation.SpecialRequests,
            CreatedAt = reservation.CreatedAt.ToString("o", CultureInfo.InvariantCulture),
            UpdatedAt = reservation.UpdatedAt.ToString("o", CultureInfo.InvariantCulture)
        };
    }

    // Convert ReservationDto to Reservation entity
    private static Reservation ConvertToEntity(ReservationDto reservationDto)
    {
        return new Reservation
        {
            Id = reservationDto.ReservationId ?? Guid.NewGuid(),
            PropertyId = reservationDto.PropertyId,
            UserId = reservationDto.UserId,
            PropertyName = reservationDto.PropertyName,
            GuestName = reservationDto.GuestName,
            CheckInDate = DateTime.Parse(reservationDto.CheckInDate, CultureInfo.InvariantCulture),
            CheckOutDate = DateTime.Parse(reservationDto.CheckOutDate, CultureInfo.InvariantCulture),
            Guests = reservationDto.Guests,
            SpecialRequests = reservationDto.SpecialRequests
        };
    }
}

