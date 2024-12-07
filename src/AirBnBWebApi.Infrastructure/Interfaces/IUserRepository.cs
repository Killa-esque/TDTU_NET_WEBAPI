// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using AirBnBWebApi.Core.Entities;
using System.Threading.Tasks;
using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Infrastructure.Interfaces;
public interface IUserRepository
{
    // Get all with pagination
    Task<List<User>> GetAllAsync(int page, int limit);
    Task<User> GetByIdAsync(Guid userId);
    Task<List<User>> GetUsersByIdsAsync(List<Guid> userIds);
    Task<User> GetByEmailAsync(string email);
    Task<User> CreateAsync(User user);
    Task<User> UpdateAsync(User user);
    Task<bool> DeleteAsync(Guid userId);
    Task<int> GetTotalCountAsync();
    Task<List<User>> SearchUsersAsync(string query);

}

