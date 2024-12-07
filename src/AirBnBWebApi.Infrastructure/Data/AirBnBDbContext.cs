// Licensed to the .NET Foundation under one or more agreements.
// The .NET Foundation licenses this file to you under the MIT license.

using Microsoft.EntityFrameworkCore;
using AirBnBWebApi.Core.Entities;
using System;
using System.Linq;
using BCrypt.Net;

namespace AirBnBWebApi.Infrastructure.Data;
public class AirBnBDbContext : DbContext
{
    public AirBnBDbContext(DbContextOptions<AirBnBDbContext> options) : base(options) { }
    public DbSet<User> Users { get; set; }
    public DbSet<KeyToken> KeyTokens { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<RefreshTokenUsed> RefreshTokensUsed { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<UserRole> UserRoles { get; set; }
    public DbSet<UserMetadata> UserMetadata { get; set; }
    public DbSet<Property> Properties { get; set; }
    public DbSet<PropertyImage> PropertyImages { get; set; }
    public DbSet<Review> Reviews { get; set; }
    public DbSet<Location> Locations { get; set; }
    public DbSet<Amenity> Amenities { get; set; }
    public DbSet<PropertyAmenity> PropertyAmenities { get; set; }
    public DbSet<Reservation> Reservations { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.HasIndex(e => e.Email).IsUnique(); // Ensure unique email

            entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
            entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
            entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            entity.Property(e => e.Address).HasMaxLength(200);
            entity.Property(e => e.City).HasMaxLength(50);
            entity.Property(e => e.Country).HasMaxLength(50);
            entity.Property(e => e.Avatar).HasMaxLength(300);

            // 1-to-1 relationship between User and KeyToken
            entity.HasOne(u => u.KeyToken)
                  .WithOne(k => k.User)
                  .HasForeignKey<KeyToken>(k => k.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // 1-to-Many relationship with RefreshToken
            entity.HasMany(u => u.RefreshTokens)
                  .WithOne(r => r.User)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // 1-to-Many relationship with RefreshTokenUsed
            entity.HasMany(u => u.RefreshTokensUsed)
                  .WithOne(rt => rt.User)
                  .HasForeignKey(rt => rt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // 1-to-Many relationship with UserRole
            entity.HasMany(u => u.UserRoles)
                  .WithOne(ur => ur.User)
                  .HasForeignKey(ur => ur.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // 1-to-Many relationship with UserMetadata
            entity.HasMany(u => u.Metadata)
                  .WithOne(m => m.User)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // KeyToken configuration
        modelBuilder.Entity<KeyToken>(entity =>
        {
            entity.HasKey(k => k.UserId); // Primary Key is also Foreign Key to User

            entity.Property(k => k.PublicKey).IsRequired().HasMaxLength(2048);
            entity.Property(k => k.PrivateKey).IsRequired().HasMaxLength(4096);
            entity.Property(k => k.Timestamp).IsRequired();

            // 1-to-Many relationship with RefreshTokenUsed
            entity.HasMany(k => k.RefreshTokensUsed)
                  .WithOne(rt => rt.KeyToken)
                  .HasForeignKey(rt => rt.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // RefreshToken configuration
        modelBuilder.Entity<RefreshToken>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.Token).IsRequired().HasMaxLength(500);
            entity.Property(r => r.DeviceInfo).HasMaxLength(200);
            entity.Property(r => r.CreatedAt).IsRequired();
            entity.Property(r => r.ExpiryDate).IsRequired();
        });

        // RefreshTokenUsed configuration
        modelBuilder.Entity<RefreshTokenUsed>(entity =>
        {
            entity.HasKey(rt => rt.Id);

            entity.Property(rt => rt.Token).IsRequired().HasMaxLength(500);
            entity.Property(rt => rt.DeviceInfo).HasMaxLength(200);
            entity.Property(rt => rt.UsedAt).IsRequired();

            // Foreign key to User with No Action on delete
            entity.HasOne(rt => rt.User)
                    .WithMany(u => u.RefreshTokensUsed)
                    .HasForeignKey(rt => rt.UserId)
                    .OnDelete(DeleteBehavior.NoAction);

            // Foreign key to KeyToken with Cascade delete
            entity.HasOne(rt => rt.KeyToken)
                    .WithMany(k => k.RefreshTokensUsed)
                    .HasForeignKey(rt => rt.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
        });

        // Role configuration
        modelBuilder.Entity<Role>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.Name).IsRequired().HasMaxLength(50);
            entity.Property(r => r.Description).HasMaxLength(200);

            // 1-to-Many relationship with UserRole
            entity.HasMany(r => r.UserRoles)
                  .WithOne(ur => ur.Role)
                  .HasForeignKey(ur => ur.RoleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // UserRole configuration (Composite Key)
        modelBuilder.Entity<UserRole>(entity =>
        {
            entity.HasKey(ur => new { ur.UserId, ur.RoleId });

            // Foreign key relationship to User
            entity.HasOne(ur => ur.User)
                  .WithMany(u => u.UserRoles)
                  .HasForeignKey(ur => ur.UserId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Foreign key relationship to Role
            entity.HasOne(ur => ur.Role)
                  .WithMany(r => r.UserRoles)
                  .HasForeignKey(ur => ur.RoleId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // UserMetadata configuration
        modelBuilder.Entity<UserMetadata>(entity =>
        {
            entity.HasKey(m => m.Id);

            entity.Property(m => m.Key).IsRequired().HasMaxLength(50);
            entity.Property(m => m.Value).IsRequired().HasMaxLength(500);
            entity.Property(m => m.CreatedAt).IsRequired();
            entity.Property(m => m.UpdatedAt).IsRequired();

            // Foreign key relationship to User
            entity.HasOne(m => m.User)
                  .WithMany(u => u.Metadata)
                  .HasForeignKey(m => m.UserId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        modelBuilder.Entity<Property>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.PropertyName).IsRequired();
            entity.Property(e => e.PropertyDescription);
            entity.Property(e => e.PropertyPricePerNight).HasColumnType("decimal(18,2)");
            entity.Property(e => e.PropertyStatus).IsRequired();
            entity.Property(e => e.PropertyType).IsRequired();
            entity.Property(e => e.Guests).IsRequired();
            entity.Property(e => e.Bedrooms).IsRequired();
            entity.Property(e => e.Beds).IsRequired();
            entity.Property(e => e.Bathrooms).IsRequired();
            entity.Property(e => e.Address).IsRequired();
            entity.Property(e => e.Slug).IsRequired();
            entity.Property(e => e.IsDraft).IsRequired();
            entity.Property(e => e.IsPublished).IsRequired();
            entity.Property(e => e.IsArchived).IsRequired();

            entity.HasIndex(e => e.Slug).IsUnique();

            // Many-to-One relationship with Location
            entity.HasOne(p => p.Location)
                .WithMany(l => l.Properties)
                .HasForeignKey(p => p.LocationId)
                .OnDelete(DeleteBehavior.Restrict);

            // 1-to-Many relationship with PropertyImage
            entity.HasMany(p => p.PropertyImages)
                .WithOne(pi => pi.Property)
                .HasForeignKey(pi => pi.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            // 1-to-Many relationship with Review
            entity.HasMany(p => p.Reviews)
                .WithOne(r => r.Property)
                .HasForeignKey(r => r.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Location configuration
        modelBuilder.Entity<Location>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.City).IsRequired();
            entity.Property(e => e.Country).IsRequired();
            entity.Property(e => e.Latitude);
            entity.Property(e => e.Longitude);
            entity.Property(e => e.GoogleMapsUrl);

            entity.HasIndex(l => new { l.City, l.Country }).IsUnique(); // Ensure unique location
        });

        // Review configuration
        modelBuilder.Entity<Review>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.Rating)
                  .IsRequired()
                  .HasColumnType("decimal(3, 2)") // Giới hạn số thập phân
                  .HasDefaultValue(0) // Giá trị mặc định
                  .HasAnnotation("Range", "0-5"); // Chỉ để biểu thị ý định, không enforced.

            entity.Property(e => e.Comment)
                  .HasMaxLength(1000);

            entity.Property(e => e.CreatedAt)
                  .HasDefaultValueSql("GETUTCDATE()"); // Tự động gán ngày giờ

            entity.Property(e => e.UpdatedAt)
                  .HasDefaultValueSql("GETUTCDATE()"); // Tự động gán ngày giờ

            entity.HasOne(e => e.Property)
                  .WithMany(p => p.Reviews)
                  .HasForeignKey(e => e.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.User)
                  .WithMany(u => u.Reviews)
                  .HasForeignKey(e => e.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // PropertyImage configuration
        modelBuilder.Entity<PropertyImage>(entity =>
        {
            entity.HasKey(e => e.Id);

            entity.Property(e => e.ImageUrl);
            entity.Property(e => e.CreatedAt);
            entity.Property(e => e.UpdatedAt);
        });

        // Định nghĩa bảng Amenity
        modelBuilder.Entity<Amenity>(entity =>
        {
            entity.HasKey(a => a.Id);

            entity.Property(a => a.Name).IsRequired().HasMaxLength(100);
            entity.Property(a => a.Description).HasMaxLength(255);
            entity.Property(a => a.Icon).HasMaxLength(200);

            // Icon is unique
            entity.HasIndex(a => a.Icon).IsUnique();
        });

        modelBuilder.Entity<PropertyAmenity>(entity =>
        {
            // Composite Key
            entity.HasKey(pa => new { pa.PropertyId, pa.AmenityId });

            // Quan hệ với Property
            entity.HasOne(pa => pa.Property)
                .WithMany(p => p.PropertyAmenities)
                .HasForeignKey(pa => pa.PropertyId)
                .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ với Amenity
            entity.HasOne(pa => pa.Amenity)
                .WithMany(a => a.PropertyAmenities)
                .HasForeignKey(pa => pa.AmenityId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Reservation configuration
        modelBuilder.Entity<Reservation>(entity =>
        {
            entity.HasKey(r => r.Id);

            entity.Property(r => r.CheckInDate)
                  .IsRequired();

            entity.Property(r => r.CheckOutDate)
                  .IsRequired();

            entity.Property(r => r.Guests)
                  .IsRequired();

            entity.Property(r => r.GuestName)
                    .IsRequired()
                    .HasMaxLength(100);

            entity.Property(r => r.PropertyName)
                    .IsRequired()
                    .HasMaxLength(100);

            entity.Property(r => r.TotalPrice)
                  .HasColumnType("decimal(18,2)") // decimal với 18 chữ số, 2 chữ số thập phân
                  .IsRequired(); // Có thể không bắt buộc tùy vào nhu cầu

            entity.Property(r => r.SpecialRequests)
                  .HasMaxLength(500);

            // Quan hệ nhiều - 1 với Property
            entity.HasOne(r => r.Property)
                  .WithMany(p => p.Reservations)
                  .HasForeignKey(r => r.PropertyId)
                  .OnDelete(DeleteBehavior.Cascade);

            // Quan hệ nhiều - 1 với User
            entity.HasOne(r => r.User)
                  .WithMany(u => u.Reservations)
                  .HasForeignKey(r => r.UserId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        base.OnModelCreating(modelBuilder);
    }

    public override int SaveChanges()
    {
        foreach (var entry in ChangeTracker.Entries())
        {
            if (entry.Entity is BaseEntity trackable)
            {
                if (entry.State == EntityState.Added)
                {
                    trackable.CreatedAt = DateTime.Now;
                }

                if (entry.State == EntityState.Modified)
                {
                    trackable.UpdatedAt = DateTime.Now;
                }
            }
        }
        return base.SaveChanges();
    }
}
