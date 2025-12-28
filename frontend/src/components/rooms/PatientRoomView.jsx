import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms } from "../../utils/rooms";
import { getCurrentUser } from "../../utils/auth";
import "./patientRoomView.css";

export default function PatientRoomView() {
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPatientRoom();
  }, []);

  const loadPatientRoom = () => {
    const user = getCurrentUser();
    const patientId = user?.linkedPatientId;
    
    if (!patientId) {
      setLoading(false);
      return;
    }

    const rooms = getRooms();
    const patientRoom = rooms.find((r) => r.assignedPatient === patientId);
    
    setRoom(patientRoom);
    setLoading(false);
  };

  if (loading) {
    return <div className="patient-room-view">Loading...</div>;
  }

  if (!room) {
    return (
      <div className="patient-room-view">
        <div className="no-room-assigned">
          <h2>No Room Assigned</h2>
          <p>You don't have a room assigned yet. Please contact the hospital administration.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="patient-room-view">
      <header className="room-header">
        <h1>My Room</h1>
        <p className="room-number-display">{room.roomNumber}</p>
      </header>

      <div className="room-info-cards">
        <div className="info-card">
          <div className="card-icon">🏥</div>
          <div className="card-content">
            <h3>Room Type</h3>
            <p>{room.type}</p>
          </div>
        </div>

        <div className="info-card">
          <div className="card-icon">📍</div>
          <div className="card-content">
            <h3>Location</h3>
            <p>Floor {room.floor || "N/A"}</p>
            <p>Wing {room.wing || "N/A"}</p>
          </div>
        </div>

        {room.assignedNurse && (
          <div className="info-card">
            <div className="card-icon">👩‍⚕️</div>
            <div className="card-content">
              <h3>Your Assigned Nurse</h3>
              <p>{room.assignedNurse}</p>
            </div>
          </div>
        )}

        {room.assignedDoctor && (
          <div className="info-card">
            <div className="card-icon">🩺</div>
            <div className="card-content">
              <h3>Your Doctor</h3>
              <p>{room.assignedDoctor}</p>
            </div>
          </div>
        )}
      </div>

      <div className="quick-actions">
        <button
          className="action-btn"
          onClick={() => navigate("/patient/appointments")}
        >
          📅 View My Appointments
        </button>
        <button
          className="action-btn"
          onClick={() => navigate("/patient/surgeries")}
        >
          🏥 View My Surgeries
        </button>
      </div>
    </div>
  );
}

