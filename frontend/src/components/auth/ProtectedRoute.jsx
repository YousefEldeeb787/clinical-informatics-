import { Navigate } from "react-router-dom";
import { getCurrentRole, isAuthenticated, hasPermission } from "../../utils/auth";
import { ROLES } from "../../utils/permissions";

/**
 * Protected Route Component with Role-Based Access Control
 * 
 * Usage Examples:
 * 1. By Roles: <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
 * 2. By Permission: <ProtectedRoute requiredPermission={PERMISSIONS.VIEW_ALL_PATIENTS}>
 * 3. Both: Checks both role AND permission
 * 
 * @param {string[]} allowedRoles - Array of allowed roles
 * @param {string} requiredPermission - Required permission (optional)
 * @param {ReactNode} children - Protected content
 * @param {string} redirectTo - Where to redirect if unauthorized (default: "/login")
 */
export default function ProtectedRoute({ 
  allowedRoles, 
  requiredPermission,
  children, 
  redirectTo = "/login" 
}) {
  const role = getCurrentRole();
  const authenticated = isAuthenticated();

  // Check authentication first
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check role-based access
  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to appropriate dashboard based on role
    const dashboardRoutes = {
      [ROLES.CLINICIAN]: "/dashboard",
      [ROLES.RECEPTIONIST]: "/reception-dashboard",
      [ROLES.PATIENT]: "/patient/dashboard",
    };
    
    return <Navigate to={dashboardRoutes[role] || "/unauthorized"} replace />;
  }

  // Check permission-based access
  if (requiredPermission && !hasPermission(requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
