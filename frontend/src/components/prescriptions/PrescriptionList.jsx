import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./prescriptionList.css";

export default function PrescriptionList() {
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("date-desc"); // default

  const navigate = useNavigate();

  const prescriptions = [
    {
      id: "RX001",
      date: "2025-10-26",
      doctor: "Dr. Mahmoud Badran",
      patient: "John Doe",
      medication: "Amoxicillin 500mg",
      status: "Active",
      medicines: [
        { name: "Amoxicillin", dosage: "500mg", frequency: "Twice daily", existing: true }
      ]
    },
    {
      id: "RX002",
      date: "2025-10-25",
      doctor: "Dr. Mahmoud Badran",
      patient: "Jane Smith",
      medication: "Ibuprofen 200mg",
      status: "Completed",
      medicines: [
        { name: "Ibuprofen", dosage: "200mg", frequency: "As needed", existing: true }
      ]
    },
    {
      id: "RX003",
      date: "2025-10-24",
      doctor: "Dr. Mahmoud Badran",
      patient: "Mark Wilson",
      medication: "Vitamin D3 ",
      status: "Cancelled",
      medicines: [
        { name: "Vitamin D3", dosage: "1000IU", frequency: "Daily", existing: true }
      ]
    },
  ];

  const filtered = prescriptions.filter((p) =>
    p.patient.toLowerCase().includes(search.toLowerCase()) ||
    p.id.toLowerCase().includes(search.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortBy) {
      case "date-asc":
        return new Date(a.date) - new Date(b.date);
      case "date-desc":
        return new Date(b.date) - new Date(a.date);
      case "name-asc":
        return a.patient.localeCompare(b.patient);
      case "name-desc":
        return b.patient.localeCompare(a.patient);
      default:
        return 0;
    }
  });

  const handleEdit = (prescription) => {
    // Navigate to new prescription page with state for editing
    navigate("/prescriptions/new", { state: { editingPrescription: prescription } });
  };

  return (
    <div className="prescriptions-page">
      <header className="prescriptions-header">
        <h1>Prescriptions</h1>
        <button className="btn-add" onClick={() => navigate("/prescriptions/new")}>
          ➕ Add New Prescription
        </button>
      </header>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Search by Patient or ID..."
          className="search-input"
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="sort-select" onChange={(e) => setSortBy(e.target.value)}>
          <option value="date-desc">Sort by: Date (Newest)</option>
          <option value="date-asc">Sort by: Date (Oldest)</option>
          <option value="name-asc">Sort by: Patient (A → Z)</option>
          <option value="name-desc">Sort by: Patient (Z → A)</option>
        </select>
      </div>

      <div className="summary-cards">
        <div className="card">Total: {prescriptions.length}</div>
        <div className="card active">Active: 1</div>
        <div className="card completed">Completed: 1</div>
        <div className="card cancelled">Cancelled: 1</div>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>RX ID</th>
              <th>DATE</th>
              <th>PATIENT</th>
              <th>MEDICATION</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {sorted.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.date}</td>
                <td>{p.patient}</td>
                <td>{p.medication}</td>
                <td>
                  <span className={`badge ${p.status.toLowerCase()}`}>
                    {p.status}
                  </span>
                </td>
                <td>
                  <button className="icon-btn" title="View">👁️</button>
                  <button className="icon-btn" title="Edit" onClick={() => handleEdit(p)}>✏️</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
