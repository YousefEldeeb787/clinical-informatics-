import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DoctorInfoModal from "../doctors/DoctorInfoModal";
import "./settingsDrawer.css";

export default function SettingsDrawer({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [clinicName, setClinicName] = useState("Clinical System");

  useEffect(() => {
    const saved = localStorage.getItem("doctorData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setClinicName(parsed.clinicName || "Clinical System");
    }
  }, []);

  if (!isOpen) return null;

  const handleClinicNameUpdate = (newName) => {
    setClinicName(newName);
    // Update navbar clinic name
    window.dispatchEvent(new CustomEvent('clinicNameUpdated', { detail: newName }));
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="settings-drawer" onClick={(e) => e.stopPropagation()}>
        <div className="drawer-header">
          <h2>Settings</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        <div className="drawer-content">
          <DoctorInfoModal
            isOpen={true}
            embedded={true}
            onClose={onClose}
            onClinicNameUpdate={handleClinicNameUpdate}
          />
        </div>
      </div>
    </div>
  );
}

