// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.Entities;

public class RefreshTokenUsed
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public string Token { get; set; }
    public DateTime UsedAt { get; set; }
    public string DeviceInfo { get; set; }

    // Navigation properties
    public virtual User User { get; set; }
    public virtual KeyToken KeyToken { get; set; } // Thêm thuộc tính này
}
