using System.Security.Claims;
using AirBnBWebApi.Api.Helpers;
using AirBnBWebApi.Core.DTOs.Requests;
using AirBnBWebApi.Services.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AirBnBWebApi.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReviewController : ControllerBase
{
    private readonly IReviewService _reviewService;

    public ReviewController(IReviewService reviewService)
    {
        _reviewService = reviewService;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetReviewById(Guid id)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid review ID");
        }

        var result = await _reviewService.GetReviewByIdAsync(id).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.Review, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpGet("host")]
    [Authorize]
    public async Task<IActionResult> GetReviewsByHostId()
    {
        // Get Host Id from token
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(currentUserId))
        {
            return ResponseHelper.Unauthorized("User is not authenticated.");
        }

        if (!Guid.TryParse(currentUserId, out var hostId))
        {
            return ResponseHelper.BadRequest("Invalid user ID.");
        }

        var result = await _reviewService.GetReviewsByHostIdAsync(hostId).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.Reviews, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpGet("{propertyId}/property")]
    public async Task<IActionResult> GetReviewsByPropertyId(Guid propertyId)
    {
        if (propertyId == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid property ID");
        }

        var result = await _reviewService.GetReviewsByPropertyIdAsync(propertyId).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.Reviews, result.Message) : ResponseHelper.NotFound(result.Message);
    }

    [HttpPost]
    [Authorize]
    public async Task<IActionResult> CreateReview([FromBody] ReviewDto reviewDto)
    {
        if (reviewDto == null)
        {
            return ResponseHelper.BadRequest("Invalid review data");
        }

        var result = await _reviewService.CreateReviewAsync(reviewDto).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Created(result.ReviewId, result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateReview(Guid id, [FromBody] ReviewDto reviewDto)
    {
        if (id == Guid.Empty || reviewDto == null)
        {
            return ResponseHelper.BadRequest("Invalid data");
        }

        var result = await _reviewService.UpdateReviewAsync(id, reviewDto).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteReview(Guid id)
    {
        if (id == Guid.Empty)
        {
            return ResponseHelper.BadRequest("Invalid review ID");
        }

        var result = await _reviewService.DeleteReviewAsync(id).ConfigureAwait(false);
        return result.IsSuccess ? ResponseHelper.Success(result.Message) : ResponseHelper.BadRequest(result.Message);
    }

    [HttpGet("host/analytics")]
    public async Task<IActionResult> GetAnalytics()
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

        var result = await _reviewService.GetAnalyticsByHostId(hostId).ConfigureAwait(false);

        return result.IsSuccess ? ResponseHelper.Success(result.ReviewsChart, result.Message) : ResponseHelper.NotFound(result.Message);
    }

}
