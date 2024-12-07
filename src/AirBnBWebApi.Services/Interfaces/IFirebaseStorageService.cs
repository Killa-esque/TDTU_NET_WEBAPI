// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace AirBnBWebApi.Services.Interfaces;

public interface IFirebaseStorageService
{
    /// <summary>
    /// Uploads a file to Firebase Storage.
    /// </summary>
    /// <param name="file">The file to be uploaded.</param>
    /// <param name="fileName">The name to save the file as in Firebase Storage.</param>
    /// <returns>The download URL of the uploaded file.</returns>
    Task<string> UploadFileAsync(IFormFile file, string fileName);


    /// <summary>
    /// Deletes a file from Firebase Storage.
    /// </summary>
    /// <param name="fileName">The name of the file to delete in Firebase Storage.</param>
    /// <returns>A boolean indicating whether the deletion was successful.</returns>
    Task<bool> DeleteFileAsync(string fileName);

    /// <summary>
    /// Gets the download URL of a file stored in Firebase Storage.
    /// </summary>
    /// <param name="fileName">The name of the file in Firebase Storage.</param>
    /// <returns>The download URL of the file.</returns>
    Task<string> GetFileUrlAsync(string fileName);
}

