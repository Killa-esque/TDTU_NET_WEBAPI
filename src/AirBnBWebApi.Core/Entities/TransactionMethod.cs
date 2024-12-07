// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.Collections.Generic;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.Entities;

public class TransactionMethod
{
    public int Id { get; set; }
    public Guid UserId { get; set; }
    public User User { get; set; }
    public TransactionMethodEnum MethodType { get; set; }
    public string CardNumber { get; set; }
    public string CardHolderName { get; set; }
    public DateTime ExpiryDate { get; set; }
    public string Cvv { get; set; }
    public DateTime CreatedAt { get; set; }
}
