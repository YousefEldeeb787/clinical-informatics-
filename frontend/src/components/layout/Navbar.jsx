import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SearchBox from "./SearchBox";
import DoctorInfoModal from "../doctors/DoctorInfoModal";
import ThemeToggle from "../common/ThemeToggle";
import { getCurrentRole, getCurrentUser } from "../../utils/auth";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clinicName, setClinicName] = useState("Clinical System");
  const [profilePhoto, setProfilePhoto] = useState("https://cdn-icons-png.flaticon.com/512/921/921056.png");
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const currentRole = getCurrentRole();
    const currentUser = getCurrentUser();
    setRole(currentRole);
    setUser(currentUser);

    // Load clinic name and photo from localStorage
    const saved = localStorage.getItem("doctorData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setClinicName(parsed.clinicName || "Clinical System");
      if (currentRole === "doctor") {
        setProfilePhoto(parsed.photo || "https://cdn-icons-png.flaticon.com/512/921/921056.png");
      }
    }

    // Set profile photo based on role
    if (currentRole === "nurse") {
      setProfilePhoto("https://cdn-icons-png.flaticon.com/512/921/921056.png"); // Nurse icon
    } else if (currentRole === "patient") {
      setProfilePhoto("https://cdn-icons-png.flaticon.com/512/921/921056.png"); // Patient icon
    }

    // Listen for clinic name updates
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

  const handleAvatarClick = () => {
    setIsModalOpen(true);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <span className="logo">🩺 {clinicName}</span>
        </div>

        <div className="navbar-right">
          <div className="navbar-search">
            <SearchBox />
          </div>
          <ThemeToggle />
          <button
            className="avatar-btn"
            onClick={handleAvatarClick}
            aria-label={role === "doctor" ? "Doctor Information" : role === "nurse" ? "Nurse Profile" : "Patient Profile"}
          >
            <img
              src={profilePhoto}
              alt={role === "doctor" ? "Doctor" : role === "nurse" ? "Nurse" : "Patient"}
              className="profile-pic"
            />
          </button>
        </div>
      </nav>

      {(role === "doctor" || role === null) && (
      <DoctorInfoModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onClinicNameUpdate={handleClinicNameUpdate}
      />
      )}
      {(role === "nurse" || role === "patient") && isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="profile-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{role === "nurse" ? "Nurse Profile" : "Patient Profile"}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>×</button>
            </div>
            <div className="modal-content">
              <div className="profile-info">
                <img src={profilePhoto} alt={role} className="profile-photo" />
                <h3>{user?.fullName || "User"}</h3>
                <p>{user?.email || ""}</p>
                <p className="role-badge">{role === "nurse" ? "👩‍⚕️ Nurse" : "🙂 Patient"}</p>
              </div>
              <div className="modal-actions">
                <button className="btn-secondary" onClick={() => setIsModalOpen(false)}>Close</button>
                <button className="btn-primary" onClick={() => {
                  setIsModalOpen(false);
                  // Navigate to profile page
                  if (role === "patient") {
                    window.location.href = "/patient/profile";
                  }
                }}>View Profile</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
