import { Navigate } from "react-router-dom";
import { isAuthenticated, getCurrentRole } from "../../utils/auth";
import { ROLES } from "../../utils/permissions";

export default function Home() {
  const authenticated = isAuthenticated();
  const role = getCurrentRole();

  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect based on role
  switch (role) {
    case ROLES.CLINICIAN:
      return <Navigate to="/dashboard" replace />;
    case ROLES.RECEPTIONIST:
      return <Navigate to="/reception-dashboard" replace />;
    case ROLES.PATIENT:
      return <Navigate to="/patient/dashboard" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}
