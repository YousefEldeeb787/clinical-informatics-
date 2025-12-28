import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isReceptionist } from "../../utils/auth";
import { PERMISSIONS } from "../../utils/permissions";
import RoleRestricted from "../common/RoleRestricted";
import "./InsuranceList.css";

export default function InsuranceList() {
  const navigate = useNavigate();
  const [insuranceRecords, setInsuranceRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const receptionist = isReceptionist();

  useEffect(() => {
    fetchInsuranceRecords();
  }, []);

  const fetchInsuranceRecords = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockData = [
        {
          id: 1,
          patientName: "John Doe",
          patientId: "P001",
          provider: "Blue Cross Blue Shield",
          policyNumber: "BCBS123456789",
          groupNumber: "GRP-12345",
          expiryDate: "2025-12-31",
          status: "Active",
          coverageType: "PPO",
        },
        {
          id: 2,
          patientName: "Jane Smith",
          patientId: "P002",
          provider: "UnitedHealthcare",
          policyNumber: "UHC987654321",
          groupNumber: "GRP-67890",
          expiryDate: "2025-06-30",
          status: "Active",
          coverageType: "HMO",
        },
        {
          id: 3,
          patientName: "Bob Johnson",
          patientId: "P003",
          provider: "Aetna",
          policyNumber: "AET555666777",
          groupNumber: "GRP-11111",
          expiryDate: "2024-12-15",
          status: "Expired",
          coverageType: "EPO",
        },
      ];
      setInsuranceRecords(mockData);
    } catch (error) {
      console.error("Error fetching insurance records:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const colors = {
      Active: "status-success",
      Pending: "status-warning",
      Expired: "status-danger",
      Suspended: "status-default",
    };
    return colors[status] || "status-default";
  };

  const isExpiringSoon = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry > 0 && daysUntilExpiry <= 30;
  };

  const filtered = insuranceRecords.filter((record) =>
    (record.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.patientId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
    record.policyNumber.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (statusFilter === "" || record.status === statusFilter)
  );

  return (
    <div className="insurance-container">
      <div className="insurance-header">
        <div>
          <h1>🏥 Insurance Management</h1>
          <p>{receptionist ? "Manage patient insurance information" : "View your insurance details"}</p>
        </div>
        <RoleRestricted permission={PERMISSIONS.CREATE_INSURANCE}>
          <button className="btn-primary" onClick={() => navigate("/insurance/new")}>
            + Add Insurance
          </button>
        </RoleRestricted>
      </div>

      <div className="filters-section">
        <input
          type="text"
          placeholder="🔍 Search patient name, ID, provider, or policy number..."
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
          <option value="Active">Active</option>
          <option value="Pending">Pending</option>
          <option value="Expired">Expired</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{insuranceRecords.filter(r => r.status === "Active").length}</div>
          <div className="stat-label">Active Policies</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{insuranceRecords.filter(r => isExpiringSoon(r.expiryDate)).length}</div>
          <div className="stat-label">Expiring Soon</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{insuranceRecords.filter(r => r.status === "Expired").length}</div>
          <div className="stat-label">Expired</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{insuranceRecords.length}</div>
          <div className="stat-label">Total Records</div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading insurance records...</div>
      ) : filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon">🏥</div>
          <h3>No insurance records found</h3>
          <p>No insurance information matches your search criteria.</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="insurance-table">
            <thead>
              <tr>
                {receptionist && <th>Patient</th>}
                <th>Insurance Provider</th>
                <th>Policy Number</th>
                <th>Group Number</th>
                <th>Coverage Type</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((record) => (
                <tr key={record.id} className={isExpiringSoon(record.expiryDate) ? "expiring-soon" : ""}>
                  {receptionist && (
                    <td>
                      <div className="patient-info">
                        <strong>{record.patientName}</strong>
                        <span className="patient-id">{record.patientId}</span>
                      </div>
                    </td>
                  )}
                  <td><strong>{record.provider}</strong></td>
                  <td>{record.policyNumber}</td>
                  <td>{record.groupNumber}</td>
                  <td>
                    <span className="coverage-badge">{record.coverageType}</span>
                  </td>
                  <td>
                    <div className="expiry-info">
                      {new Date(record.expiryDate).toLocaleDateString()}
                      {isExpiringSoon(record.expiryDate) && (
                        <span className="expiry-warning">⚠️ Expiring Soon</span>
                      )}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${getStatusBadge(record.status)}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-icon"
                        onClick={() => navigate(`/insurance/${record.id}`)}
                        title="View Details"
                      >
                        👁️
                      </button>
                      <RoleRestricted permission={PERMISSIONS.UPDATE_INSURANCE}>
                        <button
                          className="btn-icon"
                          onClick={() => navigate(`/insurance/${record.id}/edit`)}
                          title="Edit Insurance"
                        >
                          ✏️
                        </button>
                      </RoleRestricted>
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
