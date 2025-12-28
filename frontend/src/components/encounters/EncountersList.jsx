import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PERMISSIONS } from "../../utils/permissions";
import RoleRestricted from "../common/RoleRestricted";
import "./EncountersList.css";

export default function EncountersList() {
  const navigate = useNavigate();
  const [encounters, setEncounters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    patientId: "",
    status: "",
    startDate: "",
    endDate: "",
  });
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchEncounters();
  }, [filters]);

  const fetchEncounters = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      // const response = await encountersService.getAll(filters);
      
      // Mock data for now
      const mockEncounters = [
        {
          id: 1,
          patientName: "John Doe",
          patientId: "P001",
          encounterDate: "2024-12-28T10:30:00",
          encounterType: "Consultation",
          chiefComplaint: "Chest pain and shortness of breath",
          clinicianName: "Dr. Smith",
          status: "Signed",
          duration: "45 min",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          patientId: "P002",
          encounterDate: "2024-12-28T11:15:00",
          encounterType: "Follow-up",
          chiefComplaint: "Post-surgery check-up",
          clinicianName: "Dr. Smith",
          status: "InProgress",
          duration: "30 min",
        },
        {
          id: 3,
          patientName: "Bob Johnson",
          patientId: "P003",
          encounterDate: "2024-12-27T14:00:00",
          encounterType: "Emergency",
          chiefComplaint: "Severe abdominal pain",
          clinicianName: "Dr. Smith",
          status: "Completed",
          duration: "60 min",
        },
      ];
      
      setEncounters(mockEncounters);
    } catch (error) {
      console.error("Error fetching encounters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const getStatusBadge = (status) => {
    const statusColors = {
      InProgress: "status-warning",
      Completed: "status-info",
      Signed: "status-success",
    };
    return statusColors[status] || "status-default";
  };

  const filteredEncounters = encounters.filter((enc) =>
    enc.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enc.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    enc.chiefComplaint.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="encounters-container">
      <div className="encounters-header">
        <div>
          <h1>📋 Clinical Encounters</h1>
          <p>Manage patient visits and clinical documentation</p>
        </div>
        <RoleRestricted permission={PERMISSIONS.CREATE_ENCOUNTER}>
          <button
            className="btn-primary"
            onClick={() => navigate("/encounters/new")}
          >
            + New Encounter
          </button>
        </RoleRestricted>
      </div>

      {/* Filters */}
      <div className="encounters-filters">
        <div className="filter-group">
          <input
            type="text"
            placeholder="🔍 Search patient name, ID, or complaint..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-row">
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
            className="filter-select"
          >
            <option value="">All Statuses</option>
            <option value="InProgress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Signed">Signed</option>
          </select>

          <input
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange("startDate", e.target.value)}
            className="filter-input"
            placeholder="From Date"
          />

          <input
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange("endDate", e.target.value)}
            className="filter-input"
            placeholder="To Date"
          />

          {(filters.status || filters.startDate || filters.endDate) && (
            <button
              onClick={() => setFilters({ patientId: "", status: "", startDate: "", endDate: "" })}
              className="btn-clear-filters"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="encounters-stats">
        <div className="stat-card">
          <div className="stat-value">{encounters.filter(e => e.status === "InProgress").length}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{encounters.filter(e => e.status === "Completed").length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{encounters.filter(e => e.status === "Signed").length}</div>
          <div className="stat-label">Signed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{encounters.length}</div>
          <div className="stat-label">Total</div>
        </div>
      </div>

      {/* Encounters Table */}
      {loading ? (
        <div className="loading-state">Loading encounters...</div>
      ) : filteredEncounters.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">📋</div>
          <h3>No encounters found</h3>
          <p>Start documenting patient visits by creating a new encounter.</p>
          <RoleRestricted permission={PERMISSIONS.CREATE_ENCOUNTER}>
            <button
              className="btn-primary"
              onClick={() => navigate("/encounters/new")}
            >
              Create First Encounter
            </button>
          </RoleRestricted>
        </div>
      ) : (
        <div className="encounters-table-container">
          <table className="encounters-table">
            <thead>
              <tr>
                <th>Date & Time</th>
                <th>Patient</th>
                <th>Type</th>
                <th>Chief Complaint</th>
                <th>Clinician</th>
                <th>Duration</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEncounters.map((encounter) => (
                <tr key={encounter.id}>
                  <td>
                    <div className="encounter-date">
                      {new Date(encounter.encounterDate).toLocaleDateString()}
                    </div>
                    <div className="encounter-time">
                      {new Date(encounter.encounterDate).toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </td>
                  <td>
                    <div className="patient-info">
                      <strong>{encounter.patientName}</strong>
                      <span className="patient-id">{encounter.patientId}</span>
                    </div>
                  </td>
                  <td>
                    <span className="encounter-type">{encounter.encounterType}</span>
                  </td>
                  <td>
                    <div className="chief-complaint">{encounter.chiefComplaint}</div>
                  </td>
                  <td>{encounter.clinicianName}</td>
                  <td>{encounter.duration}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(encounter.status)}`}>
                      {encounter.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`/encounters/${encounter.id}`)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      {encounter.status !== "Signed" && (
                        <RoleRestricted permission={PERMISSIONS.UPDATE_ENCOUNTER}>
                          <button
                            className="btn-icon"
                            onClick={() => navigate(`/encounters/${encounter.id}/edit`)}
                            title="Edit"
                          >
                            ✏️
                          </button>
                        </RoleRestricted>
                      )}
                      {encounter.status === "Completed" && (
                        <RoleRestricted permission={PERMISSIONS.SIGN_ENCOUNTER}>
                          <button
                            className="btn-icon btn-sign"
                            onClick={() => navigate(`/encounters/${encounter.id}/sign`)}
                            title="Sign Encounter"
                          >
                            ✍️
                          </button>
                        </RoleRestricted>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
