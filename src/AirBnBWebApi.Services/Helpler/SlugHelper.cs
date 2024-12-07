// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Threading.Tasks;
using AirBnBWebApi.Infrastructure.Interfaces;

namespace AirBnBWebApi.Services.Helper;

public class SlugHelper : ISlugHelper
{
    private readonly IPropertyRepository _propertyRepository;

    // Inject IPropertyRepository để kiểm tra slug trùng lặp
    public SlugHelper(IPropertyRepository propertyRepository)
    {
        _propertyRepository = propertyRepository;
    }

    public async Task<string> GenerateSlugAsync(string input)
    {
        if (string.IsNullOrWhiteSpace(input))
        {
            return string.Empty;
        }

        // Logic tạo slug
        string slug = RemoveAccents(input);
        slug = slug.ToLowerInvariant();
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"[^a-z0-9\s-]", "");
        slug = System.Text.RegularExpressions.Regex.Replace(slug, @"\s+", " ").Trim();
        slug = slug.Replace(" ", "-");

        // Kiểm tra tính duy nhất của slug
        slug = await GenerateUniqueSlugAsync(slug).ConfigureAwait(false);

        return slug;
    }

    // Kiểm tra slug đã tồn tại trong cơ sở dữ liệu chưa
    private async Task<string> GenerateUniqueSlugAsync(string baseSlug)
    {
        string slug = baseSlug;
        int i = 1;

        // Kiểm tra xem slug đã tồn tại trong cơ sở dữ liệu chưa
        while (await _propertyRepository.IsSlugExistsAsync(slug).ConfigureAwait(false))
        {
            slug = $"{baseSlug}-{i}";  // Thêm hậu tố vào slug
            i++;
        }

        return slug;
    }

    private static string RemoveAccents(string input)
    {
        if (string.IsNullOrEmpty(input))
        {
            return input;
        }

        var regex = new System.Text.RegularExpressions.Regex(@"\p{IsCombiningDiacriticalMarks}+");
        string normalizedString = input.Normalize(System.Text.NormalizationForm.FormD);
        string result = regex.Replace(normalizedString, string.Empty);

        return result;
    }
}
