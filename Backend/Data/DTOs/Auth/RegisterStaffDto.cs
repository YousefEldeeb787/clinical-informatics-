using System.ComponentModel.DataAnnotations;

namespace ClinicSystemBackend.Data.DTOs.Auth
{
    public class RegisterStaffDto
    {
        [Required]
        [StringLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(100, MinimumLength = 6)]
        public string Password { get; set; } = string.Empty;

        [Phone]
        public string? Phone { get; set; }

        [Required]
        public string Role { get; set; } = string.Empty; // Clinician or Receptionist
    }
}
