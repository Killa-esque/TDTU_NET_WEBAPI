
using System;
using System.Linq;
using System.Threading.Tasks;
using AirBnBWebApi.Core.Entities;
using AirBnBWebApi.Infrastructure.Data;
using AirBnBWebApi.Infrastructure.Interfaces;
using AirBnBWebApi.Service.Security;

namespace AirBnBWebApi.Services.Services;

public class SeedService
{
    private readonly AirBnBDbContext _context;
    private readonly IKeyTokenRepository _keyTokenRepository;
    private readonly SecurityKeyGenerator _securityKeyGenerator;

    public SeedService(AirBnBDbContext context, IKeyTokenRepository keyTokenRepository, SecurityKeyGenerator securityKeyGenerator)
    {
        _context = context;
        _keyTokenRepository = keyTokenRepository;
        _securityKeyGenerator = securityKeyGenerator;
    }

    public async Task SeedDataAsync()
    {
        // Kiểm tra xem có user admin chưa
        if (!_context.Users.Any(u => u.Email == "admin@gmail.com"))
        {
            // Mã hóa mật khẩu bằng BCrypt
            string passwordHash = BCrypt.Net.BCrypt.HashPassword("admin@123");

            // Tạo một user admin
            var adminUser = new User
            {
                Id = Guid.NewGuid(),  // Tạo GUID mới
                FullName = "Admin",
                Email = "admin@gmail.com",
                PasswordHash = passwordHash  // Lưu mật khẩu đã mã hóa
            };

            // Thêm user vào context
            await _context.Users.AddAsync(adminUser).ConfigureAwait(false);

            // Kiểm tra xem Role Admin đã có chưa
            var adminRole = _context.Roles.FirstOrDefault(r => r.Name == "Admin");
            if (adminRole == null)
            {
                // Nếu Role Admin chưa có, tạo mới
                adminRole = new Role
                {
                    Name = "Admin"
                };
                _context.Roles.Add(adminRole);
                await _context.SaveChangesAsync().ConfigureAwait(false);
            }

            // Gán user admin vào role Admin
            var userRole = new UserRole
            {
                UserId = adminUser.Id,
                RoleId = adminRole.Id
            };
            await _context.UserRoles.AddAsync(userRole).ConfigureAwait(false);

            // Tạo và lưu cặp key cho user admin
            var (privateKey, publicKey) = _securityKeyGenerator.GenerateKeyPair();
            var keyToken = new KeyToken
            {
                UserId = adminUser.Id,
                PublicKey = publicKey,
                PrivateKey = privateKey,
                Timestamp = DateTime.UtcNow
            };
            await _keyTokenRepository.AddAsync(keyToken).ConfigureAwait(false);

            // Lưu tất cả các thay đổi
            await _context.SaveChangesAsync().ConfigureAwait(false);
        }
    }
}
