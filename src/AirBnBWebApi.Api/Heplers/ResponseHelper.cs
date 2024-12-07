// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Helpers;

public static class ResponseHelper
{
    // 1. Thành công - Get single item
    // Phương thức trả về HTTP 200 cho một item
    public static IActionResult Success<T>(T payload, string message = "Request was successful.")
    {
        return new JsonResult(new ApiResponse<T>(true, StatusCodes.Status200OK, message, payload))
        {
            StatusCode = StatusCodes.Status200OK
        };
    }

    // Phương thức trả về HTTP 201 Created
    public static IActionResult Created<T>(T payload, string message = "Resource created successfully.")
    {
        return new JsonResult(new ApiResponse<T>(true, StatusCodes.Status201Created, message, payload))
        {
            StatusCode = StatusCodes.Status201Created
        };
    }

    // Phương thức trả về HTTP 204 No Content
    public static IActionResult NoContent(string message = "Resource updated successfully.")
    {
        return new JsonResult(new ApiResponse<object>(true, StatusCodes.Status204NoContent, message, null))
        {
            StatusCode = StatusCodes.Status204NoContent
        };
    }

    // Phương thức trả về HTTP 400 Bad Request
    public static IActionResult BadRequest(string message = "Invalid request.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status400BadRequest, message, error))
        {
            StatusCode = StatusCodes.Status400BadRequest
        };
    }

    // Phương thức trả về HTTP 401 Unauthorized
    public static IActionResult Unauthorized(string message = "Unauthorized access.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status401Unauthorized, message, error))
        {
            StatusCode = StatusCodes.Status401Unauthorized
        };
    }

    // Phương thức trả về HTTP 403 Forbidden
    public static IActionResult Forbidden(string message = "You do not have permission to access this resource.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status403Forbidden, message, error))
        {
            StatusCode = StatusCodes.Status403Forbidden
        };
    }

    // Phương thức trả về HTTP 404 Not Found
    public static IActionResult NotFound(string message = "The requested resource was not found.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status404NotFound, message, error))
        {
            StatusCode = StatusCodes.Status404NotFound
        };
    }

    // Phương thức trả về HTTP 409 Conflict
    public static IActionResult Conflict(string message = "Resource conflict occurred.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status409Conflict, message, error))
        {
            StatusCode = StatusCodes.Status409Conflict
        };
    }

    // Phương thức trả về HTTP 429 Too Many Requests
    public static IActionResult TooManyRequests(string message = "Too many requests. Please try again later.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status429TooManyRequests, message, error))
        {
            StatusCode = StatusCodes.Status429TooManyRequests
        };
    }

    // Phương thức trả về HTTP 500 Internal Server Error
    public static IActionResult InternalServerError(string message = "An internal server error occurred.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status500InternalServerError, message, error))
        {
            StatusCode = StatusCodes.Status500InternalServerError
        };
    }

    // Phương thức trả về HTTP 503 Service Unavailable
    public static IActionResult ServiceUnavailable(string message = "The service is currently unavailable.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status503ServiceUnavailable, message, error))
        {
            StatusCode = StatusCodes.Status503ServiceUnavailable
        };
    }

    // Phương thức trả về response cho lỗi validation
    public static IActionResult ValidationError(string message = "Validation error occurred.", object? error = null)
    {
        return new JsonResult(new ApiResponse<object>(false, StatusCodes.Status400BadRequest, message, error))
        {
            StatusCode = StatusCodes.Status400BadRequest
        };
    }
}
