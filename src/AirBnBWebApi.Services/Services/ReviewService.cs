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
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Services.Interfaces;

namespace AirBnBWebApi.Services.Services;

public class ReviewService : IReviewService
{
    private readonly IReviewRepository _reviewRepository;
    private readonly IUserRepository _userRepository;
    private readonly IPropertyRepository _propertyRepository;

    public ReviewService(IReviewRepository reviewRepository, IUserRepository userRepository, IPropertyRepository propertyRepository)
    {
        _reviewRepository = reviewRepository;
        _userRepository = userRepository;
        _propertyRepository = propertyRepository;
    }

    public async Task<ReviewResult> GetReviewByIdAsync(Guid reviewId)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(reviewId).ConfigureAwait(false);
        if (review == null)
        {
            return new ReviewResult { IsSuccess = false, Message = "Review not found" };
        }

        return new ReviewResult
        {
            IsSuccess = true,
            Message = "Review retrieved successfully",
            Review = ConvertToDto(review)
        };
    }

    public async Task<ReviewResult> GetReviewsByPropertyIdAsync(Guid propertyId)
    {
        var reviews = await _reviewRepository.GetReviewsByPropertyIdAsync(propertyId).ConfigureAwait(false);

        if (reviews == null)
        {
            return new ReviewResult { IsSuccess = false, Message = "Reviews not found" };
        }

        // Get user avatar and username
        var userIds = reviews.Select(r => r.UserId).Distinct().ToList();

        // Get user avatar and username
        var users = await _userRepository.GetUsersByIdsAsync(userIds).ConfigureAwait(false);

        var reviewsDto = reviews.Select(review =>
        {
            var user = users.FirstOrDefault(u => u.Id == review.UserId);
            return new ReviewDto
            {
                ReviewId = review.Id,
                PropertyId = review.PropertyId,
                UserId = review.UserId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt.ToString("o", CultureInfo.InvariantCulture),
                UpdatedAt = review.UpdatedAt.ToString("o", CultureInfo.InvariantCulture),
                Avatar = user?.Avatar,
                FullName = user?.FullName
            };
        }).ToList();

        return new ReviewResult
        {
            IsSuccess = true,
            Message = "Reviews retrieved successfully",
            Reviews = reviewsDto
        };
    }

    public async Task<ReviewResult> CreateReviewAsync(ReviewDto reviewDto)
    {
        // Check if user has reviewed the property
        var existingReview = await _reviewRepository.GetReviewByUserIdAndPropertyIdAsync(reviewDto.UserId, reviewDto.PropertyId).ConfigureAwait(false);

        if (existingReview != null)
        {
            return new ReviewResult { IsSuccess = false, Message = "User has already reviewed this property" };
        }

        var review = ConvertToEntity(reviewDto);
        review.Id = Guid.NewGuid();
        review.CreatedAt = DateTime.UtcNow;
        review.UpdatedAt = DateTime.UtcNow;

        var result = await _reviewRepository.CreateReviewAsync(review).ConfigureAwait(false);

        return result
            ? new ReviewResult { IsSuccess = true, Message = "Review created successfully", ReviewId = review.Id.ToString() }
            : new ReviewResult { IsSuccess = false, Message = "Error creating review" };
    }

    public async Task<ReviewResult> UpdateReviewAsync(Guid reviewId, ReviewDto reviewDto)
    {
        var review = await _reviewRepository.GetReviewByIdAsync(reviewId).ConfigureAwait(false);

        if (review == null)
        {
            return new ReviewResult { IsSuccess = false, Message = "Review not found", ReviewId = reviewId.ToString() };
        }

        review.Comment = reviewDto.Comment;
        review.Rating = reviewDto.Rating;
        review.UpdatedAt = DateTime.UtcNow;

        var result = await _reviewRepository.UpdateReviewAsync(review).ConfigureAwait(false);

        return result
            ? new ReviewResult { IsSuccess = true, Message = "Review updated successfully" }
            : new ReviewResult { IsSuccess = false, Message = "Error updating review" };
    }

    public async Task<ReviewResult> DeleteReviewAsync(Guid reviewId)
    {
        var result = await _reviewRepository.DeleteReviewAsync(reviewId).ConfigureAwait(false);

        return result
            ? new ReviewResult { IsSuccess = true, Message = "Review deleted successfully" }
            : new ReviewResult { IsSuccess = false, Message = "Error deleting review" };
    }

    public async Task<ReviewResult> GetReviewsByHostIdAsync(Guid hostId)
    {
        var reviews = await _reviewRepository.GetReviewsByHostIdAsync(hostId).ConfigureAwait(false);

        if (reviews == null)
        {
            return new ReviewResult { IsSuccess = false, Message = "Reviews not found" };
        }

        // Get user avatar and username
        var userIds = reviews.Select(r => r.UserId).Distinct().ToList();

        // Get user avatar and username
        var users = await _userRepository.GetUsersByIdsAsync(userIds).ConfigureAwait(false);

        var reviewsDto = reviews.Select(review =>
        {
            var user = users.FirstOrDefault(u => u.Id == review.UserId);
            return new ReviewDto
            {
                ReviewId = review.Id,
                PropertyId = review.PropertyId,
                UserId = review.UserId,
                Rating = review.Rating,
                Comment = review.Comment,
                CreatedAt = review.CreatedAt.ToString("o", CultureInfo.InvariantCulture),
                UpdatedAt = review.UpdatedAt.ToString("o", CultureInfo.InvariantCulture),
                Avatar = user?.Avatar,
                FullName = user?.FullName
            };
        }).ToList();

        return new ReviewResult
        {
            IsSuccess = true,
            Message = "Reviews retrieved successfully",
            Reviews = reviewsDto
        };

    }

    public async Task<ReviewResult> GetAnalyticsByHostId(Guid hostId)
    {
        var properties = await _propertyRepository.GetPropertiesByHostIdAsync(hostId).ConfigureAwait(false);
        if (properties == null)
        {
            return new ReviewResult { IsSuccess = false, Message = "Properties not found" };
        }

        var reviewsChart = new List<ReviewChart>();

        foreach (var property in properties)
        {
            // Lấy tất cả review của property
            var reviews = await _reviewRepository.GetReviewsByPropertyIdAsync(property.Id).ConfigureAwait(false);

            // Group các review theo tháng và năm
            var groupedReviews = reviews
                .Where(r => r.CreatedAt != DateTime.MinValue) // Kiểm tra nếu CreatedAt có giá trị
                .GroupBy(r => new { r.CreatedAt.Year, r.CreatedAt.Month })
                .OrderBy(g => g.Key.Year)
                .ThenBy(g => g.Key.Month);

            // Duyệt qua các nhóm review theo năm và tháng
            foreach (var group in groupedReviews)
            {
                var averageRating = group.Average(r => r.Rating); // Tính trung bình rating
                var reviewsCount = group.Count(); // Số lượng review

                // Chuyển đổi sang định dạng "yyyy-MM-dd"
                var date = new DateTime(group.Key.Year, group.Key.Month, 1).ToString("yyyy-MM-dd", CultureInfo.InvariantCulture);

                // Thêm vào dữ liệu trả về
                reviewsChart.Add(new ReviewChart
                {
                    Date = date,
                    AverageRating = averageRating,
                    ReviewsCount = reviewsCount
                });
            }
        }

        return new ReviewResult
        {
            IsSuccess = true,
            Message = "Analytics retrieved successfully",
            ReviewsChart = reviewsChart
        };
    }

    private static Review ConvertToEntity(ReviewDto dto) => new()
    {
        Id = dto.ReviewId ?? Guid.Empty,
        PropertyId = dto.PropertyId,
        UserId = dto.UserId,
        Rating = dto.Rating,
        Comment = dto.Comment,
        CreatedAt = string.IsNullOrEmpty(dto.CreatedAt) ? DateTime.UtcNow : DateTime.Parse(dto.CreatedAt, CultureInfo.InvariantCulture),
        UpdatedAt = string.IsNullOrEmpty(dto.UpdatedAt) ? DateTime.UtcNow : DateTime.Parse(dto.UpdatedAt, CultureInfo.InvariantCulture)
    };

    private static ReviewDto ConvertToDto(Review review) => new()
    {
        ReviewId = review.Id,
        PropertyId = review.PropertyId,
        UserId = review.UserId,
        Rating = review.Rating,
        Comment = review.Comment,
        CreatedAt = review.CreatedAt.ToString("o", CultureInfo.InvariantCulture),
        UpdatedAt = review.UpdatedAt.ToString("o", CultureInfo.InvariantCulture)
    };
}
