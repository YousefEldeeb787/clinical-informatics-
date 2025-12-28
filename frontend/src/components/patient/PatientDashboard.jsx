import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUser } from "../../utils/auth";
import "./patientDashboard.css";

export default function PatientDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    upcomingAppointments: 0,
    activePrescriptions: 0,
    scheduledSurgeries: 0,
    medicalRecords: 0,
  });

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (currentUser?.linkedPatientId) {
      // Load patient-specific data
      const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
      const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
      const surgeries = JSON.parse(localStorage.getItem("surgeries") || "[]");
      const medicalHistory = JSON.parse(localStorage.getItem("medicalHistory") || "[]");

      const patientId = currentUser.linkedPatientId;
      const today = new Date().toISOString().split("T")[0];

      setStats({
        upcomingAppointments: appointments.filter(
          (a) => a.patientId === patientId && a.date >= today
        ).length,
        activePrescriptions: prescriptions.filter(
          (p) => p.patient === patientId && p.status === "Active"
        ).length,
        scheduledSurgeries: surgeries.filter(
          (s) => s.patientId === patientId && s.status === "Scheduled"
        ).length,
        medicalRecords: medicalHistory.filter((m) => m.patientId === patientId).length,
      });
    }
  }, []);

  return (
    <div className="patient-dashboard">
      <header className="dashboard-header">
        <h1>My Dashboard</h1>
        <p className="subtitle">
          Welcome, {user?.fullName || "Patient"}! Here's your health overview.
        </p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card" onClick={() => navigate("/patient/appointments")}>
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.upcomingAppointments}</h3>
            <p>Upcoming Appointments</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/patient/prescriptions")}>
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <h3>{stats.activePrescriptions}</h3>
            <p>Active Prescriptions</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/patient/surgeries")}>
          <div className="stat-icon">🏥</div>
          <div className="stat-content">
            <h3>{stats.scheduledSurgeries}</h3>
            <p>Scheduled Surgeries</p>
          </div>
        </div>

        <div className="stat-card" onClick={() => navigate("/patient/medical-history")}>
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>{stats.medicalRecords}</h3>
            <p>Medical Records</p>
          </div>
        </div>
      </div>

      {/* Quick Access */}
      <div className="quick-access">
        <h2>Quick Access</h2>
        <div className="access-grid">
          <div className="access-card" onClick={() => navigate("/patient/appointments")}>
            <div className="access-icon">📅</div>
            <h3>My Appointments</h3>
            <p>View and manage your appointments</p>
          </div>

          <div className="access-card" onClick={() => navigate("/patient/prescriptions")}>
            <div className="access-icon">💊</div>
            <h3>My Prescriptions</h3>
            <p>View your current medications</p>
          </div>

          <div className="access-card" onClick={() => navigate("/patient/surgeries")}>
            <div className="access-icon">🏥</div>
            <h3>My Surgeries</h3>
            <p>View your surgical history</p>
          </div>

          <div className="access-card" onClick={() => navigate("/patient/medical-history")}>
            <div className="access-icon">📋</div>
            <h3>Medical History</h3>
            <p>View your complete medical records</p>
          </div>

          <div className="access-card" onClick={() => navigate("/patient/profile")}>
            <div className="access-icon">👤</div>
            <h3>My Profile</h3>
            <p>View and update your profile</p>
          </div>
        </div>
      </div>
    </div>
  );
}

