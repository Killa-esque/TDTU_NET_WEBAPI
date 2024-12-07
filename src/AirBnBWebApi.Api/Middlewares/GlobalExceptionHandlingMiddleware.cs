// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Net;
using AirBnBWebApi.Core.Entities;

namespace AirBnBWebApi.Api.Middlewares;

public class GlobalExceptionHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlingMiddleware> _logger;
    public GlobalExceptionHandlingMiddleware(RequestDelegate next, ILogger<GlobalExceptionHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context).ConfigureAwait(false);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, ex.Message);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;

            var errorResponse = new ApiResponse<object>(
                status: false,
                statusCode: (int)HttpStatusCode.InternalServerError,
                message: "An unexpected error occurred.",
                error: new { Message = ex.Message, StackTrace = ex.StackTrace }
            );

            await context.Response.WriteAsJsonAsync(errorResponse).ConfigureAwait(false);
        }
    }

}
