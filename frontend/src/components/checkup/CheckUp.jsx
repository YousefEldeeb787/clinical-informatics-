import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./checkup.css";

export default function CheckUpList() {
  const navigate = useNavigate();
  const [checkups, setCheckups] = useState([]);
  const [search, setSearch] = useState("");

  // Mock Data
  const MOCK_CHECKUPS = [
    { id: "CU-1001", date: "2023-10-26", patient: "John Doe", type: "Regular", status: "Completed" },
    { id: "CU-1002", date: "2023-10-25", patient: "Jane Smith", type: "Urgent", status: "Completed" },
    { id: "CU-1003", date: "2023-10-24", patient: "Sam Wilson", type: "Follow-Up", status: "Pending" },
  ];

  useEffect(() => {
    // Load from localStorage or use mock
    const stored = JSON.parse(localStorage.getItem("checkups") || "[]");
    // Merge or just use mock for demo if empty
    if (stored.length > 0) {
      // Normalize stored data
      const normalized = stored.map(c => ({
        id: c.id,
        date: c.date || c.createdAt?.split('T')[0] || "N/A",
        patient: c.patientId, // In real app, map ID to name
        type: c.visitType,
        status: c.status || "Completed"
      }));
      setCheckups([...normalized, ...MOCK_CHECKUPS]);
    } else {
      setCheckups(MOCK_CHECKUPS);
    }
  }, []);

  const filteredCheckups = checkups.filter(c =>
    c.patient.toLowerCase().includes(search.toLowerCase()) ||
    c.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="checkup-page">
      <div className="page-header">
        <h1>Check-Ups</h1>
        <button className="btn-add" onClick={() => navigate("/checkup/new")}>
          ➕ Add New Check-Up
        </button>
      </div>

      <div className="filters-bar" style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="🔍 Search by Patient or ID..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ padding: '10px', width: '300px', borderRadius: '8px', border: '1px solid #ddd' }}
        />
      </div>

      <div className="table-wrap">
        <table className="checkup-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
              <th style={{ padding: '12px' }}>CHECK-UP ID</th>
              <th style={{ padding: '12px' }}>DATE</th>
              <th style={{ padding: '12px' }}>PATIENT</th>
              <th style={{ padding: '12px' }}>TYPE</th>
              <th style={{ padding: '12px' }}>STATUS</th>
              <th style={{ padding: '12px' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {filteredCheckups.map((c) => (
              <tr key={c.id} style={{ borderBottom: '1px solid #eee' }}>
                <td style={{ padding: '12px' }}>{c.id}</td>
                <td style={{ padding: '12px' }}>{c.date}</td>
                <td style={{ padding: '12px' }}>{c.patient}</td>
                <td style={{ padding: '12px' }}>{c.type}</td>
                <td style={{ padding: '12px' }}>
                  <span className={`badge ${c.status.toLowerCase()}`} style={{
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '0.85em',
                    background: c.status === 'Completed' ? '#e6f4ea' : '#fce8e6',
                    color: c.status === 'Completed' ? '#1e7e34' : '#c0392b'
                  }}>
                    {c.status}
                  </span>
                </td>
                <td style={{ padding: '12px' }}>
                  <button className="icon-btn" title="View" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>👁️</button>
                  <button className="icon-btn" title="Edit" style={{ border: 'none', background: 'none', cursor: 'pointer' }}>✏️</button>
                </td>
              </tr>
            ))}
            {filteredCheckups.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center' }}>No check-ups found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
