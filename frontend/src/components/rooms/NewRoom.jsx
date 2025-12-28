import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ROOM_TYPES, ROOM_STATUSES, saveRooms, addRoomHistory } from "../../utils/rooms";
import { getCurrentUser } from "../../utils/auth";
import "./newRoom.css";

export default function NewRoom() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "Patient Room",
    status: "Available",
    floor: "",
    wing: "",
    assignedPatient: "",
    assignedNurse: "",
    assignedDoctor: "",
    notes: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newRoom = {
      id: `room-${Date.now()}`,
      ...formData,
      equipment: [],
      history: [],
      createdAt: new Date().toISOString(),
    };

    const rooms = JSON.parse(localStorage.getItem("rooms") || "[]");
    rooms.push(newRoom);
    saveRooms(rooms);

    const user = getCurrentUser();
    addRoomHistory(newRoom.id, "Room created", user);

    alert("✅ Room created successfully!");
    navigate(`/rooms/${newRoom.id}`);
  };

  return (
    <div className="new-room-page">
      <header className="page-header">
        <h1>Add New Room</h1>
        <button className="btn-back" onClick={() => navigate("/rooms")}>
          ← Back to Rooms
        </button>
      </header>

      <form className="room-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Room Number *</label>
            <input
              type="text"
              name="roomNumber"
              value={formData.roomNumber}
              onChange={handleChange}
              required
              placeholder="e.g., 101, OR-01"
            />
          </div>

          <div className="form-group">
            <label>Room Type *</label>
            <select name="type" value={formData.type} onChange={handleChange} required>
              {ROOM_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Status *</label>
            <select name="status" value={formData.status} onChange={handleChange} required>
              {ROOM_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Floor</label>
            <input
              type="text"
              name="floor"
              value={formData.floor}
              onChange={handleChange}
              placeholder="e.g., 1, 2, Ground"
            />
          </div>

          <div className="form-group">
            <label>Wing / Building</label>
            <input
              type="text"
              name="wing"
              value={formData.wing}
              onChange={handleChange}
              placeholder="e.g., A, B, Main Building"
            />
          </div>

          <div className="form-group">
            <label>Assigned Patient</label>
            <input
              type="text"
              name="assignedPatient"
              value={formData.assignedPatient}
              onChange={handleChange}
              placeholder="Patient ID"
            />
          </div>

          <div className="form-group">
            <label>Assigned Nurse</label>
            <input
              type="text"
              name="assignedNurse"
              value={formData.assignedNurse}
              onChange={handleChange}
              placeholder="Nurse Name"
            />
          </div>

          <div className="form-group">
            <label>Assigned Doctor</label>
            <input
              type="text"
              name="assignedDoctor"
              value={formData.assignedDoctor}
              onChange={handleChange}
              placeholder="Doctor Name"
            />
          </div>

          <div className="form-group full-width">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              placeholder="Additional notes about this room..."
            />
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/rooms")}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Create Room
          </button>
        </div>
      </form>
    </div>
  );
}

