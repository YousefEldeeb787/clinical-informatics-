import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getMaintenanceRequests, saveMaintenanceRequests, MAINTENANCE_PRIORITIES, MAINTENANCE_STATUSES, getRooms } from "../../utils/rooms";
import { getCurrentUser, getCurrentRole } from "../../utils/auth";
import RoleRestricted from "../common/RoleRestricted";
import "./maintenanceRequest.css";

export default function MaintenanceRequest() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    roomNumber: roomId || "",
    description: "",
    priority: "Medium",
  });
  const role = getCurrentRole();

  useEffect(() => {
    loadRequests();
  }, [roomId]);

  const loadRequests = () => {
    const allRequests = getMaintenanceRequests();
    if (roomId) {
      setRequests(allRequests.filter((r) => r.roomId === roomId));
    } else {
      setRequests(allRequests);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const user = getCurrentUser();
    const rooms = getRooms();
    const room = rooms.find((r) => r.id === formData.roomNumber || r.roomNumber === formData.roomNumber);

    const newRequest = {
      id: `req-${Date.now()}`,
      roomId: room?.id || formData.roomNumber,
      roomNumber: room?.roomNumber || formData.roomNumber,
      description: formData.description,
      priority: formData.priority,
      status: "Pending",
      requestedBy: user?.fullName || user?.email || "Unknown",
      requestedByRole: role,
      createdAt: new Date().toISOString(),
      history: [],
    };

    const allRequests = getMaintenanceRequests();
    allRequests.push(newRequest);
    saveMaintenanceRequests(allRequests);

    setShowForm(false);
    setFormData({ roomNumber: "", description: "", priority: "Medium" });
    loadRequests();
  };

  const handleStatusChange = (requestId, newStatus) => {
    const allRequests = getMaintenanceRequests();
    const request = allRequests.find((r) => r.id === requestId);
    if (request) {
      request.status = newStatus;
      request.history.push({
        timestamp: new Date().toISOString(),
        action: `Status changed to ${newStatus}`,
        user: getCurrentUser()?.fullName || "System",
      });
      saveMaintenanceRequests(allRequests);
      loadRequests();
    }
  };

  const getPriorityClass = (priority) => {
    const priorityMap = {
      Low: "priority-low",
      Medium: "priority-medium",
      High: "priority-high",
      Urgent: "priority-urgent",
    };
    return priorityMap[priority] || "";
  };

  return (
    <div className="maintenance-request-page">
      <header className="page-header">
        <h1>Maintenance Requests</h1>
        <RoleRestricted permission="request_maintenance">
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
            {showForm ? "Cancel" : "➕ New Request"}
          </button>
        </RoleRestricted>
      </header>

      {showForm && (
        <form className="request-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Room Number *</label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              required
              placeholder="Room ID or Number"
            />
          </div>

          <div className="form-group">
            <label>Issue Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows="4"
              placeholder="Describe the issue..."
            />
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              required
            >
              {MAINTENANCE_PRIORITIES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Submit Request
            </button>
          </div>
        </form>
      )}

      <div className="requests-list">
        {requests.length === 0 ? (
          <div className="empty-state">No maintenance requests</div>
        ) : (
          requests.map((req) => (
            <div key={req.id} className="request-card">
              <div className="request-header">
                <div>
                  <h3>Room {req.roomNumber}</h3>
                  <p className="request-meta">
                    Requested by {req.requestedBy} ({req.requestedByRole}) •{" "}
                    {new Date(req.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="request-badges">
                  <span className={`priority-badge ${getPriorityClass(req.priority)}`}>
                    {req.priority}
                  </span>
                  <span className={`status-badge status-${req.status.toLowerCase().replace(" ", "-")}`}>
                    {req.status}
                  </span>
                </div>
              </div>

              <p className="request-description">{req.description}</p>

              {role === "nurse" && (
                <div className="request-actions">
                  <label>Update Status:</label>
                  <select
                    value={req.status}
                    onChange={(e) => handleStatusChange(req.id, e.target.value)}
                  >
                    {MAINTENANCE_STATUSES.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

