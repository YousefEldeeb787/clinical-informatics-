import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getRooms, ROOM_TYPES, ROOM_STATUSES } from "../../utils/rooms";
import { getCurrentRole as getUserRole } from "../../utils/auth";
import RoleRestricted from "../common/RoleRestricted";
import "./roomList.css";

export default function RoomList() {
  const navigate = useNavigate();
  const [rooms, setRooms] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterFloor, setFilterFloor] = useState("");

  const role = getUserRole();

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    const allRooms = getRooms();
    setRooms(allRooms);
  };

  const filteredRooms = rooms.filter((room) => {
    const matchesSearch =
      !search ||
      room.roomNumber.toLowerCase().includes(search.toLowerCase()) ||
      (room.assignedPatient && room.assignedPatient.toLowerCase().includes(search.toLowerCase()));
    
    const matchesStatus = !filterStatus || room.status === filterStatus;
    const matchesType = !filterType || room.type === filterType;
    const matchesFloor = !filterFloor || room.floor === filterFloor;

    return matchesSearch && matchesStatus && matchesType && matchesFloor;
  });

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      Available: "status-available",
      Occupied: "status-occupied",
      Cleaning: "status-cleaning",
      Maintenance: "status-maintenance",
    };
    return statusMap[status] || "";
  };

  return (
    <div className="room-list-page">
      <header className="page-header">
        <h1>Room Management</h1>
        <RoleRestricted permission="edit_rooms">
          <button className="btn-add" onClick={() => navigate("/rooms/new")}>
            ➕ Add New Room
          </button>
        </RoleRestricted>
      </header>

      {/* Filters */}
      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Search by room number or patient name..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="filter-select"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {ROOM_STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="filter-select"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="">All Types</option>
          {ROOM_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Floor"
          className="filter-input"
          value={filterFloor}
          onChange={(e) => setFilterFloor(e.target.value)}
        />
      </div>

      {/* Rooms Table */}
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>ROOM NUMBER</th>
              <th>TYPE</th>
              <th>STATUS</th>
              <th>ASSIGNED PATIENT</th>
              <th>ASSIGNED NURSE</th>
              <th>ASSIGNED DOCTOR</th>
              <th>FLOOR</th>
              <th>EQUIPMENT COUNT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={9} className="empty-state">
                  No rooms found. {role === "nurse" && "Add a new room to get started."}
                </td>
              </tr>
            ) : (
              filteredRooms.map((room) => (
                <tr key={room.id}>
                  <td className="room-number">{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(room.status)}`}>
                      {room.status}
                    </span>
                  </td>
                  <td>
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
                  </td>
                  <td>{room.assignedNurse || <span className="muted">-</span>}</td>
                  <td>{room.assignedDoctor || <span className="muted">-</span>}</td>
                  <td>{room.floor || <span className="muted">-</span>}</td>
                  <td>{room.equipment?.length || 0}</td>
                  <td className="actions">
                    <button
                      className="icon-btn view-btn"
                      onClick={() => navigate(`/rooms/${room.id}`)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <RoleRestricted permission="edit_rooms">
                      <button
                        className="icon-btn edit-btn"
                        onClick={() => navigate(`/rooms/edit/${room.id}`)}
                        title="Edit Room"
                      >
                        ✏️
                      </button>
                    </RoleRestricted>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

