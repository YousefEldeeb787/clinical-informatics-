using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace ClinicSystemBackend.Authorization
{
    /// <summary>
    /// Handler for custom permission-based authorization
    /// </summary>
    public class PermissionHandler : AuthorizationHandler<PermissionRequirement>
    {
        protected override Task HandleRequirementAsync(
            AuthorizationHandlerContext context,
            PermissionRequirement requirement)
        {
            var role = context.User.FindFirst(ClaimTypes.Role)?.Value;
            
            if (string.IsNullOrEmpty(role))
            {
                return Task.CompletedTask;
            }

            // Check if user's role has the required permission
            if (HasPermission(role, requirement.Permission))
            {
                context.Succeed(requirement);
            }

            return Task.CompletedTask;
        }

        private bool HasPermission(string role, string permission)
        {
            return RolePermissions.Permissions.ContainsKey(role) &&
                   RolePermissions.Permissions[role].Contains(permission);
        }
    }
}
