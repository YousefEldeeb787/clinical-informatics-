import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./nurseDashboard.css";

export default function NurseDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingCheckups: 0,
    pendingPrescriptions: 0,
  });

  useEffect(() => {
    // Load stats from localStorage
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const appointments = JSON.parse(localStorage.getItem("appointments") || "[]");
    const checkups = JSON.parse(localStorage.getItem("checkups") || "[]");
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");

    const today = new Date().toISOString().split("T")[0];

    setStats({
      totalPatients: patients.length,
      todayAppointments: appointments.filter((a) => a.date === today).length,
      pendingCheckups: checkups.filter((c) => c.status === "Pending").length,
      pendingPrescriptions: prescriptions.filter((p) => p.status === "Active").length,
    });
  }, []);

  return (
    <div className="nurse-dashboard">
      <header className="dashboard-header">
        <h1>Nurse Dashboard</h1>
        <p className="subtitle">Welcome back! Here's what's happening today.</p>
      </header>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <h3>{stats.totalPatients}</h3>
            <p>Total Patients</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-content">
            <h3>{stats.todayAppointments}</h3>
            <p>Today's Appointments</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🩹</div>
          <div className="stat-content">
            <h3>{stats.pendingCheckups}</h3>
            <p>Pending Check-Ups</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">💊</div>
          <div className="stat-content">
            <h3>{stats.pendingPrescriptions}</h3>
            <p>Active Prescriptions</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => navigate("/appointments")}
          >
            📅 Add New Appointment
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/checkup/new")}
          >
            🩹 Record Check-Up
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/surgeries")}
          >
            🏥 View Surgeries
          </button>
          <button
            className="action-btn"
            onClick={() => navigate("/patients")}
          >
            👥 View Patients
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">📅</span>
            <div className="activity-content">
              <p><strong>Appointment Scheduled</strong></p>
              <p className="activity-time">2 hours ago</p>
            </div>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🩹</span>
            <div className="activity-content">
              <p><strong>Check-Up Completed</strong></p>
              <p className="activity-time">4 hours ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

