import "./doctorProfile.css";
import { useNavigate } from "react-router-dom";

export default function DoctorProfile() {
  const navigate = useNavigate();

  return (
    <div className="doctor-profile-page">
      <header className="topbar">
        <div className="brand" onClick={() => navigate("/")}>
          <span className="dot" /> Clinical System
        </div>
        <div className="user-icon">👨‍⚕️</div>
      </header>

      <div className="profile-container">
        <div className="profile-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/921/921056.png"
            alt="Doctor"
            className="doctor-img"
          />
          <div className="doctor-info">
            <h2>Dr. Mahmoud Badran</h2>
            <br /> <br />
            <p className="specialty">Cardiology</p>
            <br /> <br />
            <p className="contact">
              MahmoudBadran610@gmail.com 
            <br /> <br />
              +20 1228893334
            </p>
          </div>
          <div className="header-actions">
          
          </div>
        </div>

        <div className="tabs">
          <button className="active">Personal & Professional</button>
        </div>

        <div className="info-sections">
          <div className="info-card">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <p><strong>Doctor ID:</strong> D-123</p>
              <p><strong>Gender:</strong> Male</p>
              <p><strong>Date of Birth:</strong> 15-9-2000</p>
              <p><strong>Phone Number:</strong> +20 1228893334</p>
              <p><strong>Address:</strong> Cairo - Masr el Gadeda - El Hegaz street </p>
            </div>
          </div>

          <div className="info-card">
            <h3>Professional Details</h3>
            <div className="info-grid">
              <p><strong>Specialty:</strong> Cardiology</p>
              <p><strong>Department:</strong> Cardiovascular Center</p>
              <p><strong>Qualifications:</strong> MD(Bachleor of Medicine)</p>
              <p><strong>Years of Experience:</strong> 3 Years</p>
            </div>
          </div>
        </div>

        <div className="info-card schedule-card">
          <h3>Weekly Schedule</h3>
          <div className="schedule-grid">
            <div>Monday<br />9:00 AM – 5:00 PM</div>
            <div>Tuesday<br />9:00 AM – 1:00 PM</div>
            <div>Wednesday<br />1:00 PM – 7:00 PM</div>
            <div>Thursday<br />9:00 AM – 5:00 PM</div>
            <div>Friday<br />9:00 AM – 1:00 PM</div>
            <div className="off">Saturday & Sunday<br />Unavailable</div>
          </div>
        </div>
      </div>
    </div>
  );
}
