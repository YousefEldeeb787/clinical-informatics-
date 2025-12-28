import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./surgeriesList.css";

export default function SurgeriesList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const surgeries = [
    {
      id: "OP-8B1A6C",
      type: "Coronary Artery Bypass",
      patient: "George Samy",
      datetime: "2024-10-28, 08:00 AM",
      status: "Scheduled",
    },
    {
      id: "OP-D4E2F0",
      type: "Appendectomy",
      patient: "Mohmad Samy",
      datetime: "2024-10-27, 14:30 PM",
      status: "Completed",
    },
    {
      id: "OP-C9ABB7",
      type: "Knee Replacement",
      patient: "Shady Nozahy",
      datetime: "2024-10-26, 11:00 AM",
      status: "InProgress",
    },
    {
      id: "OP-3F7G1H",
      type: "Cataract Surgery",
      patient: "Youssf",
      datetime: "2024-10-25, 09:15 AM",
      status: "Cancelled",
    }
  ];

  const filteredSurgeries = surgeries.filter((s) =>
    (search === "" ||
      s.patient.toLowerCase().includes(search.toLowerCase()) ||
      s.type.toLowerCase().includes(search.toLowerCase())) &&
    (statusFilter === "" || s.status === statusFilter)
  );

  return (
    <div className="surgeries-page">
      <div className="page-header">
        <h1>Surgical Operations</h1>
        <button className="btn-add" onClick={() => navigate("/surgeries/new")}>
          ➕ Add New Surgery
        </button>
      </div>

      {/* Filters */}
      <div className="filters">
        <input
          type="text"
          placeholder="🔎 Search by patient or surgery..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">Status: All</option>
          <option value="Scheduled">Scheduled</option>
          <option value="Completed">Completed</option>
          <option value="In Progress">In Progress</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        <input type="date" onChange={(e) => setDateFilter(e.target.value)} />
      </div>

      {/* Table */}
      <div className="table-wrap">
        <table className="surgeries-table">
          <thead>
            <tr>
              <th>SURGERY ID</th>
              <th>DATE</th>
              <th>PATIENT</th>
              <th>SURGERY NAME</th>
              <th>STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredSurgeries.map((s) => (
              <tr key={s.id}>
                <td>{s.id}</td>
                <td>{s.datetime}</td>
                <td>{s.patient}</td>
                <td className="bold">{s.type}</td>
                <td>
                  <span className={`status ${s.status.replace(" ", "").toLowerCase()}`}>
                    {s.status}
                  </span>
                </td>
                <td className="actions">
                  <button onClick={() => navigate(`/surgeries/view/${s.id}`)}>View</button>
                  <button onClick={() => navigate(`/surgeries/edit/${s.id}`)}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="results-info">
        Showing 1 to {filteredSurgeries.length} of {surgeries.length} results
      </p>
    </div>
  );
}
