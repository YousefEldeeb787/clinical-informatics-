using Microsoft.AspNetCore.Authorization;

namespace ClinicSystemBackend.Authorization
{
    /// <summary>
    /// Custom authorization attribute for permission-based access control
    /// Usage: [Permission(RolePermissions.CreatePatient)]
    /// </summary>
    public class PermissionAttribute : AuthorizeAttribute
    {
        public PermissionAttribute(string permission)
        {
            Policy = permission;
        }
    }
}
