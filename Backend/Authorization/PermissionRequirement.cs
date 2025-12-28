using Microsoft.AspNetCore.Authorization;

namespace ClinicSystemBackend.Authorization
{
    /// <summary>
    /// Custom authorization requirement for granular permissions
    /// </summary>
    public class PermissionRequirement : IAuthorizationRequirement
    {
        public string Permission { get; }

        public PermissionRequirement(string permission)
        {
            Permission = permission;
        }
    }
}
