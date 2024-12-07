// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.Entities;

public class Reservation
{
    public Guid Id { get; set; } // ID duy nhất cho từng đơn đặt phòng
    public Guid PropertyId { get; set; } // ID của phòng đã đặt
    public Guid UserId { get; set; } // ID của người đặt phòng
    public string GuestName { get; set; } // T
    public string PropertyName { get; set; } // Tên của phòng đã đặt
    public DateTime CheckInDate { get; set; } // Ngày nhận phòng
    public DateTime CheckOutDate { get; set; } // Ngày trả phòng
    public int Guests { get; set; } // Số lượng khách
    public ReservationStatusEnum Status { get; set; } = ReservationStatusEnum.Pending; // Trạng thái đặt phòng
    public decimal TotalPrice { get; set; } // Tổng giá tiền
    public string? SpecialRequests { get; set; } // Yêu cầu đặc biệt của khách hàng (nếu có)
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow; // Thời gian tạo đặt phòng
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow; // Thời gian cập nhật gần nhất

    // Quan hệ với Property
    public Property Property { get; set; }
    // Quan hệ với User
    public User User { get; set; }
}

