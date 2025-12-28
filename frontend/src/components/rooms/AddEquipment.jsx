import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEquipment, saveEquipment, EQUIPMENT_CATEGORIES, EQUIPMENT_CONDITIONS, getRooms } from "../../utils/rooms";
import { getCurrentUser } from "../../utils/auth";
import "./addEquipment.css";

export default function AddEquipment() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    category: "Tool",
    condition: "Good",
    quantity: 1,
    serialNumber: "",
    assignedRoom: roomId || "",
  });

  const rooms = getRooms();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: name === "quantity" ? parseInt(value) || 1 : value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newEquipment = {
      id: `eq-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      history: [],
    };

    const allEquipment = getEquipment();
    allEquipment.push(newEquipment);
    saveEquipment(allEquipment);

    alert("✅ Equipment added successfully!");
    navigate(`/rooms/${roomId || formData.assignedRoom}`);
  };

  return (
    <div className="add-equipment-page">
      <header className="page-header">
        <h1>Add Equipment</h1>
        <button className="btn-back" onClick={() => navigate(`/rooms/${roomId || formData.assignedRoom}`)}>
          ← Back
        </button>
      </header>

      <form className="equipment-form" onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Equipment Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g., Heart Monitor, Bed, etc."
            />
          </div>

          <div className="form-group">
            <label>Category *</label>
            <select name="category" value={formData.category} onChange={handleChange} required>
              {EQUIPMENT_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Condition *</label>
            <select name="condition" value={formData.condition} onChange={handleChange} required>
              {EQUIPMENT_CONDITIONS.map((cond) => (
                <option key={cond} value={cond}>
                  {cond}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Quantity *</label>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label>Serial Number</label>
            <input
              type="text"
              name="serialNumber"
              value={formData.serialNumber}
              onChange={handleChange}
              placeholder="Optional"
            />
          </div>

          <div className="form-group">
            <label>Assign to Room</label>
            <select
              name="assignedRoom"
              value={formData.assignedRoom}
              onChange={handleChange}
            >
              <option value="">Not Assigned</option>
              {rooms.map((room) => (
                <option key={room.id} value={room.id}>
                  {room.roomNumber} - {room.type}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(`/rooms/${roomId || formData.assignedRoom}`)}>
            Cancel
          </button>
          <button type="submit" className="btn-save">
            Add Equipment
          </button>
        </div>
      </form>
    </div>
  );
}

