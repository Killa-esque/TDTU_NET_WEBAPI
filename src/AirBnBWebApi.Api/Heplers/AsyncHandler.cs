// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

namespace AirBnBWebApi.Api.Helpers;

public class AsyncHandler
{
    public static Func<T, Task> HandleAsync<T>(Func<T, Task> func)
    {
        return async (arg) =>
        {
            try
            {
                await func(arg).ConfigureAwait(false);
            }
            catch (Exception ex)
            {
                throw new Exception(ex.Message);
            }
        };
    }
}
