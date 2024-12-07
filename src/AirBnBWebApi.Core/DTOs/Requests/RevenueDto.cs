// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using System.Collections.Generic;

namespace AirBnBWebApi.Core.DTOs.Requests;

public class RevenueDto
{
    public decimal CurrentMonthIncome { get; set; }
    public List<ChartData> ChartDatas { get; set; }
}

public class ChartData
{
    public string Date { get; set; }
    public decimal Income { get; set; }
}
