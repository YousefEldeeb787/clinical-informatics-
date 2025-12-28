import { useNavigate } from "react-router-dom";
import { getCurrentRole, getRoleDisplayName } from "../../utils/auth";
import { ROLES } from "../../utils/permissions";
import "./Unauthorized.css";

export default function Unauthorized() {
  const navigate = useNavigate();
  const role = getCurrentRole();
  const roleDisplay = getRoleDisplayName(role);

  const handleGoToDashboard = () => {
    const dashboardRoutes = {
      [ROLES.CLINICIAN]: "/dashboard",
      [ROLES.RECEPTIONIST]: "/reception-dashboard",
      [ROLES.PATIENT]: "/patient/dashboard",
    };
    
    navigate(dashboardRoutes[role] || "/login");
  };

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="unauthorized-icon">🚫</div>
        <h1>Access Denied</h1>
        <p className="unauthorized-message">
          You don't have permission to access this page.
        </p>
        <p className="unauthorized-role">
          Your current role: <strong>{roleDisplay}</strong>
        </p>
        <div className="unauthorized-actions">
          <button 
            className="btn-primary" 
            onClick={handleGoToDashboard}
          >
            Go to Dashboard
          </button>
          <button 
            className="btn-secondary" 
            onClick={() => navigate(-1)}
          >
            Go Back
          </button>
        </div>
        <p className="unauthorized-help">
          If you believe you should have access to this page, please contact your administrator.
        </p>
      </div>
    </div>
  );
}
