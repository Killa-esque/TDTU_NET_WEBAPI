// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Core.Enums;

public enum ReservationStatusEnum
{
    Pending,       // Đang chờ xác nhận
    Confirmed,     // Đã xác nhận
    Cancelled,      // Đã hủy
    Completed      // Hoàn thành
}
