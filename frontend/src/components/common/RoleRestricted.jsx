import { hasPermission } from "../../utils/auth";

/**
 * Component to restrict access based on user role permissions
 * Renders children only if user has required permission
 * 
 * @param {string} permission - Required permission (use PERMISSIONS constants from utils/permissions.js)
 * @param {ReactNode} children - Content to render if permission is granted
 * @param {ReactNode} fallback - Optional fallback component if permission denied (default: null)
 * @param {boolean} hide - If true, hides completely when denied; if false, shows fallback (default: true)
 * @returns {ReactNode|null}
 */
export default function RoleRestricted({ permission, children, fallback = null, hide = true }) {
  if (!hasPermission(permission)) {
    if (hide && !fallback) {
      return null; // Completely hide if no fallback provided
    }
    
    if (fallback) {
      return fallback;
    }
    
    return null;
  }

  return children;
}

/**
 * Higher-Order Component to wrap page components with role-based access control
 * Use this for entire pages that require specific permissions
 * 
 * @param {Component} Component - React component to wrap
 * @param {string} requiredPermission - Permission required to access the page
 * @returns {Component}
 */
export function withRoleRestriction(Component, requiredPermission) {
  return function RestrictedComponent(props) {
    if (!hasPermission(requiredPermission)) {
      return (
        <div style={{ 
          padding: "3rem", 
          textAlign: "center",
          maxWidth: "500px",
          margin: "0 auto"
        }}>
          <h2 style={{ color: "#e53935", marginBottom: "1rem" }}>🚫 Access Denied</h2>
          <p style={{ color: "#666", marginBottom: "1.5rem" }}>
            You don't have permission to access this page.
          </p>
          <button 
            onClick={() => window.history.back()}
            style={{
              padding: "0.75rem 1.5rem",
              background: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "1rem"
            }}
          >
            Go Back
          </button>
        </div>
      );
    }
    return <Component {...props} />;
  };
}

