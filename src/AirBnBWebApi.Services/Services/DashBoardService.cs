using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.DTOs;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Core.Enums;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace AirBnBWebApi.Services.Services;
public class DashboardService : IDashboardService
{
    private readonly AirBnBDbContext _context;

    public DashboardService(AirBnBDbContext context)
    {
        _context = context;
    }

    public async Task<DashBoardResult> GetDashboardDataAsync()
    {
        var users = await _context.Users.CountAsync().ConfigureAwait(false);
        var bookings = await _context.Reservations.CountAsync(r => r.Status == ReservationStatusEnum.Completed).ConfigureAwait(false);
        var revenue = await _context.Reservations.Where(r => r.Status == ReservationStatusEnum.Completed).SumAsync(r => r.TotalPrice).ConfigureAwait(false);

        // Giả sử bạn tính toán sự thay đổi so với tháng trước
        var usersComparedToLastMonth = 5;  // Ví dụ giả sử tăng 5% so với tháng trước
        var bookingsComparedToLastMonth = 10; // Tăng 10%


        return new DashBoardResult
        {
            IsSuccess = true,
            Message = "Dashboard data retrieved successfully",
            DashboardData = new DashboardDataDto
            {
                TotalUsers = users,
                TotalBookings = bookings,
                TotalRevenue = revenue,
                UsersComparedToLastMonth = usersComparedToLastMonth,
                BookingsComparedToLastMonth = bookingsComparedToLastMonth
            }
        };
    }

    // Recent Bookings
    public async Task<ReservationResult> GetRecentBookingsAsync()
    {
        var recentList = await _context.Reservations
            .Include(r => r.Property)
            .Include(r => r.User)
            .OrderByDescending(r => r.CreatedAt)
            .Take(5)
            .Select(r => new ReservationDto
            {
                ReservationId = r.Id,
                PropertyName = r.Property.PropertyName,
                GuestName = r.User.FullName,
                CheckInDate = r.CheckInDate.ToString("o"),
                CheckOutDate = r.CheckOutDate.ToString("o"),
                TotalPrice = r.TotalPrice,
                UserId = r.UserId,
                PropertyId = r.PropertyId
            })
            .ToListAsync()
            .ConfigureAwait(false);

        return new ReservationResult
        {
            IsSuccess = true,
            Message = "Recent bookings retrieved successfully",
            Reservations = recentList
        };
    }
}
