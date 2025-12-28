import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isClinician } from "../../utils/auth";
import { PERMISSIONS } from "../../utils/permissions";
import RoleRestricted from "../common/RoleRestricted";
import "./LabResultsList.css";

export default function LabResultsList() {
  const navigate = useNavigate();
  const [labResults, setLabResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const clinician = isClinician();

  useEffect(() => {
    fetchLabResults();
  }, []);

  const fetchLabResults = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockData = [
        {
          id: 1,
          patientName: "John Doe",
          patientId: "P001",
          testName: "Complete Blood Count (CBC)",
          testDate: "2024-12-28",
          resultDate: "2024-12-28",
          status: "Completed",
          priority: "Routine",
          abnormalFlags: ["High WBC"],
        },
        {
          id: 2,
          patientName: "Jane Smith",
          patientId: "P002",
          testName: "Lipid Panel",
          testDate: "2024-12-27",
          resultDate: "2024-12-27",
          status: "Completed",
          priority: "Routine",
          abnormalFlags: [],
        },
        {
          id: 3,
          patientName: "Bob Johnson",
          patientId: "P003",
          testName: "Cardiac Enzymes",
          testDate: "2024-12-28",
          resultDate: null,
          status: "Pending",
          priority: "STAT",
          abnormalFlags: [],
        },
      ];
      setLabResults(mockData);
    } catch (error) {
      console.error("Error fetching lab results:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Completed: "status-success",
      Pending: "status-warning",
      Cancelled: "status-danger",
    };
    return colors[status] || "status-default";
  };

  const getPriorityBadge = (priority) => {
    const colors = {
      STAT: "priority-urgent",
      Urgent: "priority-high",
      Routine: "priority-normal",
    };
    return colors[priority] || "priority-normal";
  };

  const filtered = labResults.filter((result) =>
    (result.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    result.testName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "" || result.status === statusFilter)
  );

  return (
    <div className="lab-results-container">
      <div className="lab-results-header">
        <div>
          <h1>🔬 Lab Results</h1>
          <p>{clinician ? "Manage laboratory test results" : "View your lab results"}</p>
        </div>
        <RoleRestricted permission={PERMISSIONS.CREATE_LAB_RESULT}>
          <button className="btn-primary" onClick={() => navigate("/lab-results/new")}>
            + New Lab Result
          </button>
        </RoleRestricted>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search patient name, ID, or test..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="filter-select"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{labResults.filter(r => r.status === "Pending").length}</div>
          <div className="stat-label">Pending</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{labResults.filter(r => r.status === "Completed").length}</div>
          <div className="stat-label">Completed</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{labResults.filter(r => r.abnormalFlags.length > 0).length}</div>
          <div className="stat-label">Abnormal Results</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{labResults.filter(r => r.priority === "STAT").length}</div>
          <div className="stat-label">STAT Orders</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading lab results...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🔬</div>
          <h3>No lab results found</h3>
          <p>No laboratory test results match your criteria.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="lab-table">
            <thead>
              <tr>
                {clinician && <th>Patient</th>}
                <th>Test Name</th>
                <th>Test Date</th>
                <th>Result Date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Flags</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((result) => (
                <tr key={result.id}>
                  {clinician && (
                    <td>
                      <div className="patient-info">
                        <strong>{result.patientName}</strong>
                        <span className="patient-id">{result.patientId}</span>
                      </div>
                    </td>
                  )}
                  <td><strong>{result.testName}</strong></td>
                  <td>{new Date(result.testDate).toLocaleDateString()}</td>
                  <td>{result.resultDate ? new Date(result.resultDate).toLocaleDateString() : "—"}</td>
                  <td>
                    <span className={`priority-badge ${getPriorityBadge(result.priority)}`}>
                      {result.priority}
                    </span>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(result.status)}`}>
                      {result.status}
                    </span>
                  </td>
                  <td>
                    {result.abnormalFlags.length > 0 ? (
                      <span className="abnormal-flag">
                        ⚠️ {result.abnormalFlags.join(", ")}
                      </span>
                    ) : (
                      <span className="normal-flag">✓ Normal</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn-icon"
                      onClick={() => navigate(`/lab-results/${result.id}`)}
                      title="View Details"
                    >
                      👁️
                    </button>
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
