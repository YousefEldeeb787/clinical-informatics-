import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Patients.css";
import EditPatientModal from "./EditPatientModal";
import { hasPermission, getCurrentRole } from "../../utils/auth";
import RoleRestricted from "../common/RoleRestricted";

export default function PatientsList() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("lastVisit");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [patients, setPatients] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState(null);

  // Initial Mock Data
  const MOCK_PATIENTS = [
    { id: "P001", name: "John Doe", dob: "1989-05-15", age: 34, phone: "555-0101", lastVisit: "2023-10-26" },
    { id: "P002", name: "Jane Smith", dob: "1995-08-22", age: 28, phone: "555-0102", lastVisit: "2023-10-25" },
    { id: "P003", name: "Sam Wilson", dob: "1978-03-10", age: 45, phone: "555-0103", lastVisit: "2023-10-22" },
    { id: "P004", name: "Emily Jones", dob: "1971-11-30", age: 52, phone: "555-0104", lastVisit: "2023-10-20" },
    { id: "P005", name: "Chris Lee", dob: "1984-07-05", age: 39, phone: "555-0105", lastVisit: "2023-10-18" },
  ];

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const stored = JSON.parse(localStorage.getItem("patients") || "[]");

    // Merge stored patients with mock patients (prefer stored if ID matches)
    // For simplicity, let's just use stored if available, or combine.
    // Since we want to see edits to mock patients, we should probably initialize localStorage with mock data if empty.

    let allPatients = [...stored];

    // If we haven't initialized mock data in storage yet, let's do it (or just display them)
    // A better approach for this demo: Use stored list. If stored list is empty, use mock list AND save it to storage.
    if (allPatients.length === 0) {
      allPatients = MOCK_PATIENTS;
      // Optional: save to local storage so edits persist
      // localStorage.setItem("patients", JSON.stringify(MOCK_PATIENTS));
    } else {
      // If we have stored patients, we might want to ensure mock patients are there too if not deleted?
      // For now, let's just append any mock patients that aren't in storage (by ID)
      MOCK_PATIENTS.forEach(mock => {
        if (!allPatients.find(p => p.id === mock.id || p.patientId === mock.id)) {
          allPatients.push(mock);
        }
      });
    }

    // Normalize data structure (some might have patientId instead of id, firstName/lastName instead of name)
    const normalized = allPatients.map(p => ({
      ...p,
      id: p.id || p.patientId,
      name: p.name || `${p.firstName} ${p.lastName}`,
      age: p.age || calculateAge(p.dob),
      lastVisit: p.lastVisit || "N/A"
    }));

    setPatients(normalized);
  };

  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const filteredPatients = patients.filter((p) =>
    (p.name && p.name.toLowerCase().includes(search.toLowerCase())) ||
    (p.id && p.id.toLowerCase().includes(search.toLowerCase())) ||
    (p.phone && p.phone.includes(search))
  );

  // Sorting logic
  const sortedPatients = [...filteredPatients].sort((a, b) => {
    if (sortBy === "name") {
      return (a.name || "").localeCompare(b.name || "");
    }
    if (sortBy === "age") {
      return (a.age || 0) - (b.age || 0);
    }
    if (sortBy === "lastVisit") {
      return new Date(b.lastVisit || 0) - new Date(a.lastVisit || 0);
    }
    return 0;
  });

  // Pagination
  const totalPages = Math.ceil(sortedPatients.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedPatients = sortedPatients.slice(startIndex, startIndex + pageSize);

  const goToPatient = (id) => {
    navigate(`/patient/${id}`);
  };

  const goToMedicalHistory = (id) => {
    navigate(`/patients/${id}/medical-history`);
  };

  const handleEditPatient = (id, e) => {
    e.stopPropagation();
    setSelectedPatientId(id);
    setIsEditModalOpen(true);
  };

  const handlePatientUpdate = () => {
    loadPatients(); // Reload data to reflect changes
  };

  return (
    <div className="patients-page">
      <header className="patients-header">
        <h1>Patients List</h1>
        <RoleRestricted permission="edit_patients">
        <button className="btn-add" onClick={() => navigate("/add-patient")}>
          ➕ Add New Patient
        </button>
        </RoleRestricted>
      </header>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="🔍 Search by name, ID, or phone..."
          className="search-input"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="lastVisit">Sort by: Last Visit</option>
          <option value="name">Sort by: Name</option>
          <option value="age">Sort by: Age</option>
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>PATIENT ID</th>
              <th>FULL NAME</th>
              <th>AGE / DOB</th>
              <th>PHONE</th>
              <th>LAST VISIT</th>
              <th>MEDICAL HISTORY</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {paginatedPatients.map((p) => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.name}</td>
                <td>{p.age} / {p.dob}</td>
                <td>{p.phone}</td>
                <td>{p.lastVisit}</td>
                <td>
                  <button
                    className="icon-btn medical-history-btn"
                    onClick={() => goToMedicalHistory(p.id)}
                    title="Medical History"
                    aria-label="View Medical History"
                  >
                    📋
                  </button>
                </td>
                <td className="actions">
                  <button
                    className="icon-btn view-btn"
                    onClick={() => goToPatient(p.id)}
                    title="Profile"
                    aria-label="View Patient Profile"
                  >
                    👁️
                  </button>
                  <RoleRestricted permission="edit_patients">
                  <button
                    className="icon-btn edit-btn"
                    onClick={(e) => handleEditPatient(p.id, e)}
                    title="Edit"
                    aria-label="Edit Patient"
                  >
                    ✏️
                  </button>
                  </RoleRestricted>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="table-footer">
        <div className="page-size-selector">
          <label>Show:</label>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
          <span>entries</span>
        </div>
        <span>Showing {startIndex + 1} to {Math.min(startIndex + pageSize, sortedPatients.length)} of {sortedPatients.length} results</span>
        <div className="pagination">
          <button
            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={currentPage === page ? "active" : ""}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      <EditPatientModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        patientId={selectedPatientId}
        onSave={handlePatientUpdate}
      />
    </div>
  );
}
