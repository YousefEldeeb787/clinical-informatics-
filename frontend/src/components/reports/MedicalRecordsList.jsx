import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./medicalRecordsList.css";

export default function MedicalRecordsList() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [doctorFilter, setDoctorFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const records = [
    {
      id: "MR001",
      patient: "John Shawky",
      doctor: "Dr. Mahmoud Badran",
      diagnosis: "Routine Check-up",
      created: "2023-10-26",
      updated: "2023-10-26",
    },
    {
      id: "MR002",
      patient: "George Samy",
      doctor: "Dr. Mahmoud Badran",
      diagnosis: "Fractured Arm",
      created: "2023-10-25",
      updated: "2023-10-25",
    },
    {
      id: "MR003",
      patient: "Michael Malak",
      doctor: "Dr. Mahmoud Badran",
      diagnosis: "Allergy Consultation",
      created: "2023-10-24",
      updated: "2023-10-24",
    },
    {
      id: "MR004",
      patient: "Mohamed Samy",
      doctor: "Dr. Mahmoud Badran",
      diagnosis: "Flu Symptoms",
      created: "2023-10-23",
      updated: "2023-10-23",
    }
  ];

  const filteredRecords = records.filter((r) =>
    (search === "" ||
     r.patient.toLowerCase().includes(search.toLowerCase()) ||
     r.doctor.toLowerCase().includes(search.toLowerCase()) ||
     r.diagnosis.toLowerCase().includes(search.toLowerCase())) &&
    (doctorFilter === "" || r.doctor === doctorFilter) &&
    (departmentFilter === "" || r.department === departmentFilter) &&
    (dateFilter === "" || r.created === dateFilter)
  );

  return (
    <div className="records-page">

      {/* Header */}
      <div className="records-header">
        <h1>Medical Records</h1>
        <p>Manage and view all patient medical records.</p>

        <button className="btn-add" onClick={() => navigate("/reports/NewMedicalRecord")}>
            ➕ Add New Medical Record
        </button>
      </div>

      {/* Filters */}
      <div className="records-filters">
        <input
          type="text"
          placeholder="🔎 Search by Patient Name, Doctor, or Diagnosis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

      </div>

      {/* Table */}
      <div className="records-table-wrap">
        <table className="records-table">
          <thead>
            <tr>
              <th>RECORD ID</th>
              <th>PATIENT NAME</th>
              <th>DOCTOR</th>
              <th>DIAGNOSIS SUMMARY</th>
              <th>DATE CREATED</th>
              <th>LAST UPDATE</th>
              <th>ACTIONS</th>
            </tr>
          </thead>

          <tbody>
            {filteredRecords.map((r) => (
              <tr key={r.id}>
                <td>#{r.id}</td>
                <td className="bold">{r.patient}</td>
                <td>{r.doctor}</td>
                <td>{r.diagnosis}</td>
                <td>{r.created}</td>
                <td>{r.updated}</td>
                <td className="actions">
                  <td className="actions">
                    <button onClick={() => navigate(`/reports/view/${r.id}`, { state: { record: r } })}>
                      👁
                    </button>
                    <button onClick={() => navigate(`/reports/edit/${r.id}`)}>✏</button>
                  </td>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="results-info">
        Showing 1 to {filteredRecords.length} of {records.length} records
      </p>
    </div>
  );
}
