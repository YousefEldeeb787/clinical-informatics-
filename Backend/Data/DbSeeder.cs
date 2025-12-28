using ClinicSystemBackend.Models;
using Microsoft.EntityFrameworkCore;

namespace ClinicSystemBackend.Data
{
    public class DbSeeder
    {
        private readonly ClinicDbContext _context;

        public DbSeeder(ClinicDbContext context)
        {
            _context = context;
        }

        public async Task SeedAsync()
        {
            // Only seed essential admin user - remove other test data
            if (!await _context.Users.AnyAsync(u => u.Email == "admin@clinic.com"))
            {
                var admin = new User
                {
                    FirstName = "Admin",
                    LastName = "User",
                    Email = "admin@clinic.com",
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin123!"),
                    Role = "Admin",
                    Phone = "555-0001",
                    IsActive = true,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _context.Users.Add(admin);
                await _context.SaveChangesAsync();
            }

            // Seed essential rooms if none exist
            if (!await _context.Rooms.AnyAsync())
            {
                var rooms = new List<Room>
                {
                    new Room 
                    { 
                        RoomNumber = "OR-1", 
                        RoomType = "OperatingRoom", 
                        Status = "Available", 
                        Floor = "2nd", 
                        Notes = "Primary operating room",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Room 
                    { 
                        RoomNumber = "REC-1", 
                        RoomType = "RecoveryRoom", 
                        Status = "Available", 
                        Floor = "2nd", 
                        Notes = "Post-surgery recovery",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Room 
                    { 
                        RoomNumber = "CONS-1", 
                        RoomType = "ConsultationRoom", 
                        Status = "Available", 
                        Floor = "1st", 
                        Notes = "Consultation room",
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                };
                _context.Rooms.AddRange(rooms);
                await _context.SaveChangesAsync();
            }
        }
    }
}
