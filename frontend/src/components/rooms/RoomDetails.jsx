import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getRooms, getEquipment, saveRooms, addRoomHistory } from "../../utils/rooms";
import { getCurrentUser } from "../../utils/auth";
import RoleRestricted from "../common/RoleRestricted";
import "./roomDetails.css";

export default function RoomDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [equipment, setEquipment] = useState([]);

  useEffect(() => {
    loadRoom();
    loadEquipment();
  }, [id]);

  const loadRoom = () => {
    const rooms = getRooms();
    const found = rooms.find((r) => r.id === id);
    if (found) {
      setRoom(found);
    } else {
      // If room doesn't exist, create a default one for demo
      const defaultRoom = {
        id,
        roomNumber: `Room-${id}`,
        type: "Patient Room",
        status: "Available",
        floor: "1",
        wing: "A",
        equipment: [],
        notes: "",
        history: [],
      };
      setRoom(defaultRoom);
    }
  };

  const loadEquipment = () => {
    const allEquipment = getEquipment();
    const roomEquipment = allEquipment.filter((eq) => eq.assignedRoom === id);
    setEquipment(roomEquipment);
  };

  const handleSave = () => {
    const rooms = getRooms();
    const index = rooms.findIndex((r) => r.id === id);
    const user = getCurrentUser();
    
    if (index >= 0) {
      rooms[index] = room;
    } else {
      rooms.push(room);
    }
    
    saveRooms(rooms);
    addRoomHistory(id, "Room details updated", user);
    setIsEditing(false);
    loadRoom();
  };

  if (!room) {
    return <div>Loading...</div>;
  }

  return (
    <div className="room-details-page">
      <header className="details-header">
        <button className="btn-back" onClick={() => navigate("/rooms")}>
          ← Back to Rooms
        </button>
        <div>
          <h1>{room.roomNumber}</h1>
          <p className="room-subtitle">{room.type} • Floor {room.floor} • Wing {room.wing}</p>
        </div>
        <RoleRestricted permission="edit_rooms">
          {!isEditing ? (
            <button className="btn-edit" onClick={() => setIsEditing(true)}>
              ✏️ Edit Room
            </button>
          ) : (
            <div className="edit-actions">
              <button className="btn-cancel" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                Save Changes
              </button>
            </div>
          )}
        </RoleRestricted>
      </header>

      {/* Tabs */}
      <div className="tabs">
        <button
          className={`tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === "equipment" ? "active" : ""}`}
          onClick={() => setActiveTab("equipment")}
        >
          Equipment / Tools
        </button>
        <button
          className={`tab ${activeTab === "history" ? "active" : ""}`}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === "overview" && (
          <div className="overview-tab">
            <div className="info-grid">
              <div className="info-card">
                <label>Room Status</label>
                {isEditing ? (
                  <select
                    value={room.status}
                    onChange={(e) => setRoom({ ...room, status: e.target.value })}
                  >
                    <option value="Available">Available</option>
                    <option value="Occupied">Occupied</option>
                    <option value="Cleaning">Cleaning</option>
                    <option value="Maintenance">Maintenance</option>
                  </select>
                ) : (
                  <p className={`status-badge status-${room.status.toLowerCase()}`}>
                    {room.status}
                  </p>
                )}
              </div>

              <div className="info-card">
                <label>Assigned Patient</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={room.assignedPatient || ""}
                    onChange={(e) => setRoom({ ...room, assignedPatient: e.target.value })}
                    placeholder="Patient ID"
                  />
                ) : (
                  <p>
                    {room.assignedPatient ? (
                      <span
                        className="patient-link"
                        onClick={() => navigate(`/patient/${room.assignedPatient}`)}
                      >
                        {room.assignedPatient}
                      </span>
                    ) : (
                      <span className="muted">Not Assigned</span>
                    )}
                  </p>
                )}
              </div>

              <div className="info-card">
                <label>Assigned Nurse</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={room.assignedNurse || ""}
                    onChange={(e) => setRoom({ ...room, assignedNurse: e.target.value })}
                    placeholder="Nurse Name"
                  />
                ) : (
                  <p>{room.assignedNurse || <span className="muted">-</span>}</p>
                )}
              </div>

              <div className="info-card">
                <label>Assigned Doctor</label>
                {isEditing ? (
                  <input
                    type="text"
                    value={room.assignedDoctor || ""}
                    onChange={(e) => setRoom({ ...room, assignedDoctor: e.target.value })}
                    placeholder="Doctor Name"
                  />
                ) : (
                  <p>{room.assignedDoctor || <span className="muted">-</span>}</p>
                )}
              </div>
            </div>

            <div className="notes-section">
              <label>Notes</label>
              {isEditing ? (
                <textarea
                  value={room.notes || ""}
                  onChange={(e) => setRoom({ ...room, notes: e.target.value })}
                  rows="4"
                  placeholder="Add notes about this room..."
                />
              ) : (
                <p>{room.notes || <span className="muted">No notes</span>}</p>
              )}
            </div>
          </div>
        )}

        {activeTab === "equipment" && (
          <div className="equipment-tab">
            <RoleRestricted permission="manage_equipment">
              <button
                className="btn-add"
                onClick={() => navigate(`/rooms/${id}/equipment/add`)}
              >
                ➕ Add Equipment
              </button>
            </RoleRestricted>

            <div className="equipment-list">
              {equipment.length === 0 ? (
                <p className="empty-state">No equipment in this room</p>
              ) : (
                equipment.map((eq) => (
                  <div key={eq.id} className="equipment-item">
                    <div className="equipment-info">
                      <h4>{eq.name}</h4>
                      <p>Category: {eq.category}</p>
                      <p>Condition: <span className={`condition-${eq.condition.toLowerCase().replace(" ", "-")}`}>{eq.condition}</span></p>
                      <p>Quantity: {eq.quantity}</p>
                      {eq.serialNumber && <p>Serial: {eq.serialNumber}</p>}
                    </div>
                    <RoleRestricted permission="manage_equipment">
                      <div className="equipment-actions">
                        <button
                          className="btn-small"
                          onClick={() => navigate(`/rooms/${id}/equipment/${eq.id}/edit`)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-small"
                          onClick={() => navigate(`/rooms/${id}/equipment/${eq.id}/transfer`)}
                        >
                          Transfer
                        </button>
                      </div>
                    </RoleRestricted>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="history-tab">
            {room.history && room.history.length > 0 ? (
              <div className="history-list">
                {room.history.map((entry) => (
                  <div key={entry.id} className="history-item">
                    <div className="history-header">
                      <span className="history-action">{entry.action}</span>
                      <span className="history-user">{entry.user} ({entry.userRole})</span>
                      <span className="history-time">
                        {new Date(entry.timestamp).toLocaleString()}
                      </span>
                    </div>
                    {entry.oldValue && entry.newValue && (
                      <div className="history-change">
                        <span className="old-value">{entry.oldValue}</span> →{" "}
                        <span className="new-value">{entry.newValue}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="empty-state">No history available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

