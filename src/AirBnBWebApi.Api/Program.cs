// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using Microsoft.EntityFrameworkCore;

using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Services.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Infrastructure.Repository;
using AirBnBWebApi.Services.Interfaces;
using System.IdentityModel.Tokens.Jwt;
using AirBnBWebApi.Api.Middlewares;
using Microsoft.AspNetCore.Authorization;
using AirBnBWebApi.Service.Interfaces;
using AirBnBWebApi.Service.Jwt;
using System.Security.Cryptography;
using StackExchange.Redis;
using AirBnBWebApi.Services.Helper;
using AirBnBWebApi.Infrastructure.Redis;
using AirBnBWebApi.Service.Security;

var builder = WebApplication.CreateBuilder(args);
var config = builder.Configuration;

var connectionString = config.GetConnectionString("DefaultConnection");
if (string.IsNullOrEmpty(connectionString))
{
    throw new InvalidOperationException("DefaultConnection is not configured.");
}

builder.Services.AddDbContext<AirBnBDbContext>(options =>
    options.UseSqlServer(connectionString));

// Đăng ký Repository và Service
// ===================== REPOSITORY ======================
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IKeyTokenRepository, KeyTokenRepository>();
builder.Services.AddScoped<IRoleRepository, RoleRepository>();
builder.Services.AddScoped<IUserRoleRepository, UserRoleRepository>();
builder.Services.AddScoped<IRefreshTokenRepository, RefreshTokenRepository>();
builder.Services.AddScoped<IRefreshTokenUsedRepository, RefreshTokenUsedRepository>();
builder.Services.AddScoped<IPropertyRepository, PropertyRepository>();
builder.Services.AddScoped<IReviewRepository, ReviewRepository>();
builder.Services.AddScoped<ILocationRepository, LocationRepository>();
builder.Services.AddScoped<IPropertyImageRepository, PropertyImageRepository>();
builder.Services.AddScoped<IAmenityRepository, AmenityRepository>();
builder.Services.AddScoped<IPropertyAmenityRepository, PropertyAmenityRepository>();
builder.Services.AddScoped<IHostRepository, HostRepository>();
builder.Services.AddScoped<IReservationRepository, ReservationRepository>();

// ==================== SERVICE ====================
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddTransient<IJwtTokenHandler, JwtTokenHandler>();
builder.Services.AddScoped<IKeyTokenService, KeyTokenService>();
builder.Services.AddScoped<IRefreshTokenService, RefreshTokenService>();
builder.Services.AddScoped<IKeyTokenServiceFactory, KeyTokenServiceFactory>();
builder.Services.AddScoped<IUserRolesService, UserRolesService>();
builder.Services.AddScoped<IPropertyService, PropertyService>();
builder.Services.AddScoped<IReviewService, ReviewService>();
builder.Services.AddScoped<ILocationService, LocationService>();
builder.Services.AddScoped<IPropertyImageService, PropertyImageService>();
builder.Services.AddScoped<IAmenityService, AmenityService>();
builder.Services.AddScoped<IReservationService, ReservationService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<SeedService>();

// Helper
builder.Services.AddScoped<EmailHelper>();
builder.Services.AddScoped<ISlugHelper, SlugHelper>();
builder.Services.AddScoped<SecurityKeyGenerator>();

// Redis
builder.Services.AddSingleton<IConnectionMultiplexer>(sp =>
{
    var redisConnectionString = config.GetConnectionString("Redis");
    if (string.IsNullOrEmpty(redisConnectionString))
    {
        throw new InvalidOperationException("Redis connection string is not configured.");
    }
    var configuration = ConfigurationOptions.Parse(redisConnectionString, true);
    configuration.ResolveDns = true;
    return ConnectionMultiplexer.Connect(configuration);
});

// Register RedisService
builder.Services.AddScoped<IRedisService, RedisService>();

// Cấu hình CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("CorsPolicy",
        builder => builder
            .WithOrigins("http://localhost:3000", "https://localhost:3000")
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

// JWT Authentication Configuration
builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    x.RequireHttpsMetadata = false;
    x.SaveToken = true;
    x.TokenValidationParameters = new TokenValidationParameters
    {
        ValidIssuer = config["JwtSettings:Issuer"],
        ValidAudience = config["JwtSettings:Audience"],
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ClockSkew = TimeSpan.Zero,
    };
    x.Events = new JwtBearerEvents
    {
        OnMessageReceived = async context =>
        {
            try
            {
                var authorizationHeader = context.Request.Headers["Authorization"].ToString();
                if (string.IsNullOrEmpty(authorizationHeader) || !authorizationHeader.StartsWith("Bearer ", StringComparison.OrdinalIgnoreCase))
                {
                    context.Fail("No valid Authorization header found.");
                    return;
                }

                context.Token = authorizationHeader.Substring("Bearer ".Length).Trim();

                // Lấy `IKeyTokenServiceFactory` từ IServiceProvider
                var keyTokenServiceFactory = context.HttpContext.RequestServices.GetRequiredService<IKeyTokenServiceFactory>();

                // Tạo một instance của `IKeyTokenService` từ `keyTokenServiceFactory`
                var keyTokenService = keyTokenServiceFactory.CreateService();

                var handler = new JwtSecurityTokenHandler();
                var jwtToken = handler.ReadJwtToken(context.Token);
                var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "sub");

                if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
                {
                    context.Fail("Invalid token: userId claim is missing.");
                    return;
                }

                // Lấy public key từ KeyTokenService
                var (status, publicKey) = await keyTokenService.GetUserPublicKeyAsync(userId).ConfigureAwait(false);
                if (!status || string.IsNullOrEmpty(publicKey))
                {
                    context.Fail("Failed to retrieve valid public key for the user ID in token.");
                    return;
                }

                // Sử dụng publicKey để xác thực JWT
                var publicKeyBytes = Convert.FromBase64String(publicKey);
                var rsa = RSA.Create();
                rsa.ImportRSAPublicKey(publicKeyBytes, out _);
                context.Options.TokenValidationParameters.IssuerSigningKey = new RsaSecurityKey(rsa);

            }
            catch (Exception ex)
            {
                context.Fail($"Token validation failed due to an exception: {ex.Message}");
            }
        },
        OnTokenValidated = context =>
        {
            Console.WriteLine("Token has been successfully validated.");
            if (context.Principal?.Identity is not ClaimsIdentity claimsIdentity)
            {
                context.Fail("ClaimsIdentity is null.");
                return Task.CompletedTask;
            }

            var roleClaim = claimsIdentity.FindFirst(ClaimTypes.Role)?.Value;
            if (roleClaim == null)
            {
                throw new InvalidOperationException("Role claim is missing.");
            }
            else
            {
                // Thêm trực tiếp role vào ClaimsIdentity nếu role là chuỗi bình thường
                claimsIdentity.AddClaim(new Claim(ClaimTypes.Role, roleClaim));

                // Log role đã thêm vào ClaimsIdentity
                Console.WriteLine($"Role added to ClaimsIdentity: {roleClaim}");
            }

            return Task.CompletedTask;
        },
        OnAuthenticationFailed = context =>
        {
            Console.WriteLine("Authentication failed: " + context.Exception.Message);
            return Task.CompletedTask;
        }
    };
});

builder.Services.AddAuthorization(options =>
{
    options.DefaultPolicy = new AuthorizationPolicyBuilder()
        .RequireAuthenticatedUser()
        .Build();

    options.AddPolicy("AdminPolicy", policy =>
    {
        policy.RequireRole("Admin");
    });

    options.AddPolicy("HostPolicy", policy =>
    {
        policy.RequireRole("Host");
    });

    options.AddPolicy("UserPolicy", policy =>
    {
        policy.RequireRole("User");
    });

    options.AddPolicy("UserOrHostPolicy", policy =>
    {
        policy.RequireRole("User", "Host");
    });
});

// Thêm các dịch vụ cần thiết như Controllers và Swagger
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = config["SwaggerSettings:Title"],
        Version = config["SwaggerSettings:Version"],
        Description = config["SwaggerSettings:Description"],
        Contact = new Microsoft.OpenApi.Models.OpenApiContact
        {
            Name = config["SwaggerSettings:ContactName"],
            Email = config["SwaggerSettings:ContactEmail"],
        }
    });

    // Cấu hình để thêm header Authorization vào Swagger UI
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "Please enter a valid token",
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.Http,
        BearerFormat = "JWT",
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Áp dụng migrations và gọi phương thức SeedData
using (var scope = app.Services.CreateScope())
{
    var seeder = scope.ServiceProvider.GetRequiredService<SeedService>();
    await seeder.SeedDataAsync().ConfigureAwait(false);
}

// Cấu hình ứng dụng
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
        c.RoutePrefix = string.Empty;
    });
}

app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCors("CorsPolicy");
app.UseCors("AllowAllOrigins");

app.UseAuthentication();

app.UseAuthorization();

app.UseMiddleware<GlobalExceptionHandlingMiddleware>();

app.MapControllers();

app.Run();
