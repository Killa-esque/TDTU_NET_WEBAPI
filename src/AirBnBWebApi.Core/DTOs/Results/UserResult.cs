using System;
using System.Collections.Generic;
using AirBnBWebApi.Core.DTOs.Requests;

namespace AirBnBWebApi.Core.DTOs;

public class UserResult
{
    public bool IsSuccess { get; set; }
    public string Message { get; set; }
    public string? UserId { get; set; }
    public UserDto? User { get; set; }
    public List<UserDto>? Users { get; set; }
    public PaginatedResult<UserDto>? PaginatedUsers { get; set; }
    public List<PropertyReservationDto>? PropertyReservation { get; set; }
    public List<RoleDto> Roles { get; set; }
}
