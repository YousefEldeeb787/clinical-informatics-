using System;
using ClinicSystemBackend.Data.DTOs.User;

namespace ClinicSystemBackend.Data.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; }
        public UserDto User { get; set; }
        public string Role { get; set; }
        public DateTime ExpiresAt { get; set; }
    }
}
