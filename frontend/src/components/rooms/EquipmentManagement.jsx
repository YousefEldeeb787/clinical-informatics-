import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getEquipment, saveEquipment, EQUIPMENT_CATEGORIES, EQUIPMENT_CONDITIONS } from "../../utils/rooms";
import { getCurrentUser } from "../../utils/auth";
import RoleRestricted from "../common/RoleRestricted";
import "./equipmentManagement.css";

export default function EquipmentManagement() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [equipment, setEquipment] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterCondition, setFilterCondition] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadEquipment();
  }, [roomId]);

  const loadEquipment = () => {
    const allEquipment = getEquipment();
    if (roomId && roomId !== "all") {
      setEquipment(allEquipment.filter((eq) => eq.assignedRoom === roomId));
    } else {
      setEquipment(allEquipment);
    }
  };

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch =
      !search ||
      eq.name.toLowerCase().includes(search.toLowerCase()) ||
      (eq.serialNumber && eq.serialNumber.toLowerCase().includes(search.toLowerCase()));
    const matchesCategory = !filterCategory || eq.category === filterCategory;
    const matchesCondition = !filterCondition || eq.condition === filterCondition;
    return matchesSearch && matchesCategory && matchesCondition;
  });

  const handleDelete = (eqId) => {
    if (window.confirm("Are you sure you want to remove this equipment?")) {
      const allEquipment = getEquipment();
      const updated = allEquipment.filter((eq) => eq.id !== eqId);
      saveEquipment(updated);
      loadEquipment();
    }
  };

  const getConditionClass = (condition) => {
    return `condition-${condition.toLowerCase().replace(" ", "-")}`;
  };

  return (
    <div className="equipment-management-page">
      <header className="page-header">
        <h1>Equipment Management</h1>
        <RoleRestricted permission="manage_equipment">
          <button className="btn-add" onClick={() => navigate(`/rooms/${roomId || 'new'}/equipment/add`)}>
            ➕ Add Equipment
          </button>
        </RoleRestricted>
      </header>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Search equipment..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
        >
          <option value="">All Categories</option>
          {EQUIPMENT_CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterCondition}
          onChange={(e) => setFilterCondition(e.target.value)}
        >
          <option value="">All Conditions</option>
          {EQUIPMENT_CONDITIONS.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
        </select>
      </div>

      {/* Equipment List */}
      <div className="equipment-grid">
        {filteredEquipment.length === 0 ? (
          <div className="empty-state">
            <p>No equipment found</p>
            <RoleRestricted permission="manage_equipment">
              <button className="btn-add" onClick={() => navigate(`/rooms/${roomId || 'new'}/equipment/add`)}>
                Add First Equipment
              </button>
            </RoleRestricted>
          </div>
        ) : (
          filteredEquipment.map((eq) => (
            <div key={eq.id} className="equipment-card">
              <div className="equipment-header">
                <h3>{eq.name}</h3>
                <span className={`condition-badge ${getConditionClass(eq.condition)}`}>
                  {eq.condition}
                </span>
              </div>
              <div className="equipment-details">
                <p><strong>Category:</strong> {eq.category}</p>
                <p><strong>Quantity:</strong> {eq.quantity}</p>
                {eq.serialNumber && <p><strong>Serial:</strong> {eq.serialNumber}</p>}
                {eq.assignedRoom && (
                  <p>
                    <strong>Room:</strong>{" "}
                    <span
                      className="room-link"
                      onClick={() => navigate(`/rooms/${eq.assignedRoom}`)}
                    >
                      {eq.assignedRoom}
                    </span>
                  </p>
                )}
              </div>
              <RoleRestricted permission="manage_equipment">
                <div className="equipment-actions">
                  <button
                    className="btn-small"
                    onClick={() => navigate(`/rooms/${eq.assignedRoom || roomId}/equipment/${eq.id}/edit`)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn-small"
                    onClick={() => navigate(`/rooms/${eq.assignedRoom || roomId}/equipment/${eq.id}/transfer`)}
                  >
                    Transfer
                  </button>
                  <button
                    className="btn-small btn-danger"
                    onClick={() => handleDelete(eq.id)}
                  >
                    Remove
                  </button>
                </div>
              </RoleRestricted>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

