import { Navigate } from 'react-router-dom';
import permissionService from '../../services/permissionService';

/**
 * PermissionGuard Component
 * Conditionally renders children based on user permissions
 * 
 * Usage:
 * <PermissionGuard permission={PERMISSIONS.CREATE_PRESCRIPTION}>
 *   <button>Create Prescription</button>
 * </PermissionGuard>
 */
export const PermissionGuard = ({ permission, permissions, requireAll = false, fallback = null, children }) => {
  let hasAccess = false;

  if (permission) {
    // Single permission check
    hasAccess = permissionService.hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    // Multiple permissions check
    hasAccess = requireAll
      ? permissionService.hasAllPermissions(permissions)
      : permissionService.hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

/**
 * RoleGuard Component
 * Conditionally renders children based on user role
 * 
 * Usage:
 * <RoleGuard roles={['Clinician', 'Admin']}>
 *   <button>Schedule Surgery</button>
 * </RoleGuard>
 */
export const RoleGuard = ({ role, roles, fallback = null, children }) => {
  const currentRole = permissionService.getCurrentRole();

  let hasAccess = false;

  if (role) {
    hasAccess = currentRole === role;
  } else if (roles && Array.isArray(roles)) {
    hasAccess = roles.includes(currentRole);
  }

  if (!hasAccess) {
    return fallback;
  }

  return children;
};

/**
 * ProtectedRoute Component
 * Redirects to unauthorized page if user doesn't have required permission
 * 
 * Usage:
 * <Route path="/prescriptions/create" element={
 *   <ProtectedRoute permission={PERMISSIONS.CREATE_PRESCRIPTION}>
 *     <CreatePrescription />
 *   </ProtectedRoute>
 * } />
 */
export const ProtectedRoute = ({ permission, permissions, requireAll = false, redirectTo = '/unauthorized', children }) => {
  let hasAccess = false;

  if (permission) {
    hasAccess = permissionService.hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    hasAccess = requireAll
      ? permissionService.hasAllPermissions(permissions)
      : permissionService.hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

/**
 * DisabledButton Component
 * Shows disabled button with tooltip if user doesn't have permission
 * 
 * Usage:
 * <DisabledButton permission={PERMISSIONS.CREATE_SURGERY} tooltip="Only clinicians can schedule surgeries">
 *   <button>Schedule Surgery</button>
 * </DisabledButton>
 */
export const DisabledButton = ({ permission, permissions, requireAll = false, tooltip, children }) => {
  let hasAccess = false;

  if (permission) {
    hasAccess = permissionService.hasPermission(permission);
  } else if (permissions && Array.isArray(permissions)) {
    hasAccess = requireAll
      ? permissionService.hasAllPermissions(permissions)
      : permissionService.hasAnyPermission(permissions);
  }

  if (!hasAccess) {
    return (
      <div className="disabled-button-wrapper" title={tooltip || 'You do not have permission for this action'}>
        {children}
      </div>
    );
  }

  return children;
};

export default PermissionGuard;
