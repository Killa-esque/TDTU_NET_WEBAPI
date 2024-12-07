// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;

namespace AirBnBWebApi.Core.Entities;

public class Role
{
    public Guid Id { get; set; }
    public string Name { get; set; }                 // "Admin", "Host", "User", etc.
    public string Description { get; set; }

    // Navigation properties
    public virtual ICollection<UserRole> UserRoles { get; set; }
}
