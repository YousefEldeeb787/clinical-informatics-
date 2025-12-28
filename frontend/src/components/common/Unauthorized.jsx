import { useNavigate } from 'react-router-dom';
import permissionService from '../../services/permissionService';
import './Unauthorized.css';

export default function Unauthorized() {
  const navigate = useNavigate();
  const role = permissionService.getCurrentRole();
  const roleDisplayName = permissionService.getRoleDisplayName();
  const prohibitedActions = permissionService.getProhibitedActions();

  return (
    <div className="unauthorized-container">
      <div className="unauthorized-card">
        <div className="unauthorized-icon">??</div>
        <h1>Access Denied</h1>
        <p className="unauthorized-message">
          You do not have permission to access this resource.
        </p>

        <div className="role-info">
          <h3>Your Current Role</h3>
          <div className="role-badge">{roleDisplayName}</div>
        </div>

        {prohibitedActions.length > 0 && (
          <div className="prohibited-section">
            <h3>What You Cannot Do</h3>
            <ul className="prohibited-list">
              {prohibitedActions.map((action, index) => (
                <li key={index}>{action}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="role-capabilities">
          <h3>What You Can Do</h3>
          <div className="capabilities-grid">
            {role === 'Clinician' && (
              <>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Diagnose patients</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Prescribe medications</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Schedule surgeries</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Review lab results</span>
                </div>
              </>
            )}

            {role === 'Receptionist' && (
              <>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Register patients</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Schedule appointments</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Process payments</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Manage rooms</span>
                </div>
              </>
            )}

            {role === 'Patient' && (
              <>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>View medical records</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Request appointments</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>View prescriptions</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Request refills</span>
                </div>
              </>
            )}

            {role === 'Admin' && (
              <>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Manage users</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>System configuration</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>View audit logs</span>
                </div>
                <div className="capability-card">
                  <span className="capability-icon">?</span>
                  <span>Financial reports</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="unauthorized-actions">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            Go Back
          </button>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            Go to Dashboard
          </button>
        </div>

        <div className="help-text">
          <p>
            If you believe you should have access to this resource, please contact your administrator.
          </p>
        </div>
      </div>
    </div>
  );
}
