using ClinicSystemBackend.Data.DTOs.Auth;
using ClinicSystemBackend.Data.DTOs.User;
using System.Threading.Tasks;

namespace ClinicSystemBackend.Interfaces
{
    public interface IAuthService
    {
        Task<UserDto> RegisterAsync(CreateUserDto createUserDto, string role);
        Task<string> LoginAsync(LoginDto loginDto);
        Task<bool> ChangePasswordAsync(int userId, ChangePasswordDto changePasswordDto);
        Task<UserDto> GetUserProfileAsync(int userId);
        Task<UserDto> UpdateUserProfileAsync(int userId, UpdateUserDto updateUserDto);
    }
}
