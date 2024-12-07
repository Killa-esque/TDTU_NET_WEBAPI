// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;

namespace AirBnBWebApi.Core.Entities;

public class TransactionLog
{
    public int Id { get; set; }
    public int TransactionId { get; set; }
    public string Log { get; set; }
    public DateTime CreatedAt { get; set; }

}
