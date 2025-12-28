using ClinicSystemBackend.Data;

using ClinicSystemBackend.Models;
using ClinicSystemBackend.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using ClinicSystemBackend.Data.DTOs.Auth;
using ClinicSystemBackend.Data.DTOs.User;

namespace ClinicSystemBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly ClinicDbContext _context;
        private readonly JwtHelper _jwtHelper;
        private readonly IConfiguration _configuration;

        public AuthController(ClinicDbContext context, JwtHelper jwtHelper, IConfiguration configuration)
        {
            _context = context;
            _jwtHelper = jwtHelper;
            _configuration = configuration;
        }

        /// <summary>
        /// Login - Authenticate user and return JWT token
        /// </summary>
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto loginDto)
        {
            // Find user by email
            var user = await _context.Users
                .FirstOrDefaultAsync(u => u.Email == loginDto.Email && u.IsActive);

            if (user == null)
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Verify password
            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.PasswordHash))
            {
                return Unauthorized(new { message = "Invalid email or password" });
            }

            // Update last login
            user.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = _jwtHelper.GenerateToken(user, user.Role);
            var expirationMinutes = Convert.ToInt32(_configuration["JwtSettings:ExpirationMinutes"]);

            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    Phone = user.Phone,
                    IsActive = user.IsActive
                },
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            return Ok(response);
        }

        /// <summary>
        /// Register - Patient self-registration
        /// </summary>
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterPatientDto registerDto)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            // Create User
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = "Patient",
                Phone = registerDto.Phone,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate MRN (Medical Record Number)
            var mrn = $"MRN{DateTime.Now.Year}{user.Id.ToString().PadLeft(6, '0')}";

            // Create Patient record
            var patient = new Patient
            {
                UserId = user.Id,
                MRN = mrn,
                DateOfBirth = registerDto.DateOfBirth,
                Gender = registerDto.Gender,
                Address = registerDto.Address,
                City = registerDto.City,
                State = registerDto.State,
                PostalCode = registerDto.PostalCode,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Patients.Add(patient);
            await _context.SaveChangesAsync();

            // Generate token
            var token = _jwtHelper.GenerateToken(user, user.Role);
            var expirationMinutes = Convert.ToInt32(_configuration["JwtSettings:ExpirationMinutes"]);

            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    Phone = user.Phone,
                    IsActive = user.IsActive
                },
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            return CreatedAtAction(nameof(GetCurrentUser), new { id = user.Id }, response);
        }

        /// <summary>
        /// Register - Staff (Clinician/Receptionist) registration
        /// </summary>
        [HttpPost("register-staff")]
        [AllowAnonymous]
        public async Task<ActionResult<AuthResponseDto>> RegisterStaff([FromBody] RegisterStaffDto registerDto)
        {
            // Validate role
            if (registerDto.Role != "Clinician" && registerDto.Role != "Receptionist")
            {
                return BadRequest(new { message = "Invalid role. Only Clinician and Receptionist roles are allowed." });
            }

            // Check if email already exists
            if (await _context.Users.AnyAsync(u => u.Email == registerDto.Email))
            {
                return BadRequest(new { message = "Email already registered" });
            }

            // Create User
            var user = new User
            {
                FirstName = registerDto.FirstName,
                LastName = registerDto.LastName,
                Email = registerDto.Email,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(registerDto.Password),
                Role = registerDto.Role,
                Phone = registerDto.Phone,
                IsActive = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            // Generate token
            var token = _jwtHelper.GenerateToken(user, user.Role);
            var expirationMinutes = Convert.ToInt32(_configuration["JwtSettings:ExpirationMinutes"]);

            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    Phone = user.Phone,
                    IsActive = user.IsActive
                },
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            return CreatedAtAction(nameof(GetCurrentUser), new { id = user.Id }, response);
        }

        /// <summary>
        /// Get current authenticated user profile
        /// </summary>
        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            var userDto = new UserDto
            {
                Id = user.Id,
                FirstName = user.FirstName,
                LastName = user.LastName,
                Email = user.Email,
                Role = user.Role,
                Phone = user.Phone,
                IsActive = user.IsActive,
                LastLoginAt = user.LastLoginAt
            };

            return Ok(userDto);
        }

        /// <summary>
        /// Logout - Invalidate token (client-side token removal)
        /// </summary>
        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // In JWT, logout is handled client-side by removing the token
            // Optionally, you can implement token blacklisting here
            return Ok(new { message = "Logged out successfully" });
        }

        /// <summary>
        /// Refresh token
        /// </summary>
        [HttpPost("refresh")]
        [Authorize]
        public async Task<ActionResult<AuthResponseDto>> RefreshToken()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null || !user.IsActive)
            {
                return Unauthorized();
            }

            // Generate new token
            var token = _jwtHelper.GenerateToken(user, user.Role);
            var expirationMinutes = Convert.ToInt32(_configuration["JwtSettings:ExpirationMinutes"]);

            var response = new AuthResponseDto
            {
                Token = token,
                User = new UserDto
                {
                    Id = user.Id,
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email,
                    Role = user.Role,
                    Phone = user.Phone,
                    IsActive = user.IsActive
                },
                Role = user.Role,
                ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes)
            };

            return Ok(response);
        }

        /// <summary>
        /// Change password
        /// </summary>
        [HttpPost("change-password")]
        [Authorize]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordDto changePasswordDto)
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (!int.TryParse(userIdClaim, out int userId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                return NotFound(new { message = "User not found" });
            }

            // Verify current password
            if (!BCrypt.Net.BCrypt.Verify(changePasswordDto.CurrentPassword, user.PasswordHash))
            {
                return BadRequest(new { message = "Current password is incorrect" });
            }

            // Update password
            user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(changePasswordDto.NewPassword);
            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new { message = "Password changed successfully" });
        }

        /// <summary>
        /// Request password reset (send email with reset link)
        /// </summary>
        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> RequestPasswordReset([FromBody] ResetPasswordDto resetPasswordDto)
        {
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == resetPasswordDto.Email);

            // Don't reveal if email exists or not (security best practice)
            if (user == null)
            {
                return Ok(new { message = "If the email exists, a password reset link will be sent" });
            }

            // TODO: Generate reset token and send email
            // For now, just return success message

            return Ok(new { message = "If the email exists, a password reset link will be sent" });
        }

        /// <summary>
        /// Confirm password reset
        /// </summary>
        [HttpPost("confirm-reset")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmPasswordReset([FromBody] dynamic resetData)
        {
            // TODO: Implement token validation and password reset
            // This would verify the reset token and update the password

            return Ok(new { message = "Password reset successfully" });
        }
    }
}
