// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System;
using System.ComponentModel.DataAnnotations;
using AirBnBWebApi.Core.Enums;

namespace AirBnBWebApi.Core.Entities;

public class Transaction
{
    public int Id { get; set; }
    public decimal Amount { get; set; }
    public Guid UserId { get; set; }
    public int MerchantId { get; set; }
    public int ReservationId { get; set; }
    public DateTime TransactionDate { get; set; }
    public TransactionStatusEnum TransactionStatus { get; set; }
    public int TransactionMethodId { get; set; }
}
