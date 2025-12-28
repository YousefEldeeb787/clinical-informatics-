import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Sidebar.css";
import DoctorInfoModal from "../doctors/DoctorInfoModal";
import { getCurrentRole, isClinician, isReceptionist, isPatient } from "../../utils/auth";
import { ROLES } from "../../utils/permissions";

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinicName, setClinicName] = useState("Clinical System");
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const currentRole = getCurrentRole();
    setRole(currentRole);

    const saved = localStorage.getItem("doctorData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setClinicName(parsed.clinicName || "Clinical System");
    }

    const handleClinicNameUpdate = (e) => {
      setClinicName(e.detail);
    };
    window.addEventListener('clinicNameUpdated', handleClinicNameUpdate);

    return () => {
      window.removeEventListener('clinicNameUpdated', handleClinicNameUpdate);
    };
  }, []);

  const handleClinicNameUpdate = (newName) => {
    setClinicName(newName);
  };

  return (
    <>
      <aside className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <button
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? "➡️" : "⬅️"}
        </button>

        {!isCollapsed && <div className="sidebar-title" title={clinicName}>{clinicName}</div>}

        {/* Clinician (Doctor) Navigation */}
        {role === ROLES.CLINICIAN && (
          <>
            <NavLink to="/dashboard" end className="sidebar-link" title="Dashboard">
              🏠 {!isCollapsed && "Dashboard"}
            </NavLink>
            <NavLink to="/patients" className="sidebar-link" title="Patients">
              👥 {!isCollapsed && "Patients"}
            </NavLink>
            <NavLink to="/appointments" className="sidebar-link" title="Appointments">
              📅 {!isCollapsed && "Appointments"}
            </NavLink>
            <NavLink to="/encounters" className="sidebar-link" title="Encounters">
              📋 {!isCollapsed && "Encounters"}
            </NavLink>
            <NavLink to="/prescriptions" className="sidebar-link" title="Prescriptions">
              💊 {!isCollapsed && "Prescriptions"}
            </NavLink>
            <NavLink to="/lab-results" className="sidebar-link" title="Lab Results">
              🔬 {!isCollapsed && "Lab Results"}
            </NavLink>
            <NavLink to="/surgeries" className="sidebar-link" title="Surgeries">
              🏥 {!isCollapsed && "Surgeries"}
            </NavLink>
            <NavLink to="/rooms" className="sidebar-link" title="View Rooms">
              🚪 {!isCollapsed && "Rooms"}
            </NavLink>
          </>
        )}

        {/* Receptionist Navigation */}
        {role === ROLES.RECEPTIONIST && (
          <>
            <NavLink to="/reception-dashboard" end className="sidebar-link" title="Dashboard">
              🏠 {!isCollapsed && "Dashboard"}
            </NavLink>
            <NavLink to="/patients" className="sidebar-link" title="Patients">
              👥 {!isCollapsed && "Patients"}
            </NavLink>
            <NavLink to="/appointments" className="sidebar-link" title="Appointments">
              📅 {!isCollapsed && "Appointments"}
            </NavLink>
            <NavLink to="/billing" className="sidebar-link" title="Billing & Invoices">
              💰 {!isCollapsed && "Billing"}
            </NavLink>
            <NavLink to="/insurance" className="sidebar-link" title="Insurance">
              🛡️ {!isCollapsed && "Insurance"}
            </NavLink>
            <NavLink to="/rooms" className="sidebar-link" title="Manage Rooms">
              🚪 {!isCollapsed && "Rooms"}
            </NavLink>
            <NavLink to="/surgeries" className="sidebar-link" title="Surgery Schedule">
              🏥 {!isCollapsed && "Surgeries"}
            </NavLink>
            <NavLink to="/reports" className="sidebar-link" title="Reports">
              📊 {!isCollapsed && "Reports"}
            </NavLink>
          </>
        )}

        {/* Patient Navigation */}
        {role === ROLES.PATIENT && (
          <>
            <NavLink to="/patient/dashboard" end className="sidebar-link" title="Dashboard">
              🏠 {!isCollapsed && "Dashboard"}
            </NavLink>
            <NavLink to="/patient/appointments" className="sidebar-link" title="My Appointments">
              📅 {!isCollapsed && "My Appointments"}
            </NavLink>
            <NavLink to="/patient/medical-history" className="sidebar-link" title="My Medical History">
              📋 {!isCollapsed && "Medical History"}
            </NavLink>
            <NavLink to="/patient/prescriptions" className="sidebar-link" title="My Prescriptions">
              💊 {!isCollapsed && "Prescriptions"}
            </NavLink>
            <NavLink to="/patient/lab-results" className="sidebar-link" title="My Lab Results">
              🔬 {!isCollapsed && "Lab Results"}
            </NavLink>
            <NavLink to="/patient/encounters" className="sidebar-link" title="My Visits">
              🩺 {!isCollapsed && "My Visits"}
            </NavLink>
            <NavLink to="/patient/surgeries" className="sidebar-link" title="My Surgeries">
              🏥 {!isCollapsed && "Surgeries"}
            </NavLink>
            <NavLink to="/patient/billing" className="sidebar-link" title="My Bills">
              💰 {!isCollapsed && "Billing"}
            </NavLink>
            <NavLink to="/patient/insurance" className="sidebar-link" title="My Insurance">
              🛡️ {!isCollapsed && "Insurance"}
            </NavLink>
            <NavLink to="/patient/profile" className="sidebar-link" title="My Profile">
              👤 {!isCollapsed && "Profile"}
            </NavLink>
          </>
        )}

        <div className="sidebar-spacer"></div>

        <NavLink to="/logout" className="sidebar-link logout" title="Log out">
          🚪 {!isCollapsed && "Log Out"}
        </NavLink>

        {/* Settings - Clinician only has advanced settings */}
        {role === ROLES.CLINICIAN && (
          <div className="sidebar-bottom">
            <button
              className="sidebar-link settings-btn"
              onClick={() => setIsModalOpen(true)}
              title="Settings"
            >
              ⚙️ {!isCollapsed && "Settings"}
            </button>
          </div>
        )}
      </aside>

      {role === ROLES.CLINICIAN && (
        <DoctorInfoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onClinicNameUpdate={handleClinicNameUpdate}
        />
      )}
    </>
  );
}
