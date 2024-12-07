// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.Entities;

public abstract class BaseEntity
{
public DateTime CreatedAt { get; set; }
public DateTime UpdatedAt { get; set; }
public bool IsDeleted { get; set; }
}
