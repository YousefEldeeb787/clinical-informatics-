// src/components/patients/PatientsCard.jsx
import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./patientCard.css";
import { getRooms } from "../../utils/rooms";


// === AI Assistant ===
import { getAIDrugAdvice } from "../../features/aiAdvisor";

export default function PatientsCard() {
  const { id } = useParams();
  const navigate = useNavigate();



  // بيانات المريض (تجريبية مؤقتًا)
  // Temporary demo patients — later you can fetch them from your DB or API
const allPatients = {
  P001: {
    id: "P001",
    name: "John Doe",
    age: 34,
    dob: "1989-05-15",
    phone: "555-0101",
    registered: "2023-10-10",
    photo: "https://randomuser.me/api/portraits/men/12.jpg",
    maritalStatus: "Married",
    nationality: "American",
    city: "New York",
    address: "123 Main St, New York, NY",
    email: "john.doe@example.com",
    guardianName: "Jane Doe",
    guardianPhone: "555-0100",
  },
  P002: {
    id: "P002",
    name: "Jane Smith",
    age: 28,
    dob: "1995-08-22",
    phone: "555-0102",
    registered: "2023-09-05",
    photo: "https://randomuser.me/api/portraits/women/24.jpg",
    maritalStatus: "Single",
    nationality: "American",
    city: "Los Angeles",
    address: "456 Oak Ave, Los Angeles, CA",
    email: "jane.smith@example.com",
    guardianName: "",
    guardianPhone: "",
  },
  P003: {
    id: "P003",
    name: "Sam Wilson",
    age: 45,
    dob: "1978-03-10",
    phone: "555-0103",
    registered: "2023-08-15",
    photo: "https://randomuser.me/api/portraits/men/30.jpg",
    maritalStatus: "Married",
    nationality: "American",
    city: "Chicago",
    address: "789 Elm St, Chicago, IL",
    email: "sam.wilson@example.com",
    guardianName: "",
    guardianPhone: "",
  },
  P004: {
    id: "P004",
    name: "Emily Jones",
    age: 52,
    dob: "1971-11-30",
    phone: "555-0104",
    registered: "2023-07-11",
    photo: "https://randomuser.me/api/portraits/women/45.jpg",
    maritalStatus: "Divorced",
    nationality: "American",
    city: "Houston",
    address: "321 Pine St, Houston, TX",
    email: "emily.jones@example.com",
    guardianName: "",
    guardianPhone: "",
  },
  P005: {
    id: "P005",
    name: "Chris Lee",
    age: 39,
    dob: "1984-07-05",
    phone: "555-0105",
    registered: "2023-06-01",
    photo: "https://randomuser.me/api/portraits/men/55.jpg",
    maritalStatus: "Single",
    nationality: "American",
    city: "Miami",
    address: "654 Beach Blvd, Miami, FL",
    email: "chris.lee@example.com",
    guardianName: "",
    guardianPhone: "",
  },
};

// Select patient dynamically based on ID from URL
const basePatient = allPatients[id] || null;
const [patient, setPatient] = useState(null);

// Load room assignment from localStorage
useEffect(() => {
  const selectedPatient = allPatients[id];

  if (!selectedPatient) {
    setPatient(null);
    return;
  }

  const rooms = getRooms();
  const patientRoom = rooms.find(r => r.assignedPatient === id);

  if (patientRoom) {
    setPatient({ ...selectedPatient, roomNumber: patientRoom.roomNumber });
  } else {
    setPatient(selectedPatient);
  }
}, [id]);



  const visits = [
    { id: "V001", date: "2024-05-10", doctor: "Dr. Emily Carter", type: "Diagnosis" },
    { id: "V002", date: "2024-02-20", doctor: "Dr. Ben Adams", type: "Follow-Up" },
    { id: "V003", date: "2023-11-05", doctor: "Dr. Emily Carter", type: "Follow-Up" },
  ];

  const prescriptions = [
    { name: "Lisinopril", dose: "10mg", freq: "Once daily", doctor: "Dr. Emily Carter" },
    { name: "Albuterol Inhaler", dose: "90mcg", freq: "As needed for shortness of breath", doctor: "Dr. Ben Adams" },
    { name: "Amoxicillin", dose: "500mg", freq: "Every 8 hours for 7 days", doctor: "Dr. Emily Carter" },
  ];

  // === AI Assistant ===
  const [aiAdvice, setAiAdvice] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAICheck(drug) {
    setLoading(true);
    const result = await getAIDrugAdvice(
      {
        age: patient.age,
        conditions: patient.conditions,
        currentMeds: prescriptions.map((p) => p.name),
        allergies: patient.allergies,
      },
      {
        name: drug.name,
        dose: drug.dose,
      }
    );
    setAiAdvice(result);
    setLoading(false);
  }




  if (!patient) {
  return (
    <div className="patient-card-page">
      <div className="card">
        <h2>Patient Not Found</h2>
        <p>The requested patient does not exist.</p>
        <button className="btn-secondary" onClick={() => navigate("/patients")}>
          Back to Patients List
        </button>
      </div>
    </div>
  );
}






  return (
    <div className="patient-card-page">      
      {/* ===== Profile Section ===== */}
      <section className="profile-section card">
        <div className="profile-info">
          <img src={patient.photo} alt={patient.name} />
          <div>
            <h2>{patient.name}</h2>
            <p>ID: {patient.id}</p>
            <p>{patient.age} years old / {patient.dob || "N/A"}</p>
            <p>{patient.phone}</p>
            {patient.roomNumber ? (
              <p>
                Room:{" "}
                <span
                  className="room-link"
                  onClick={() => {
                    const rooms = getRooms();
                    const room = rooms.find((r) => r.roomNumber === patient.roomNumber || r.assignedPatient === id);
                    if (room) {
                      navigate(`/rooms/${room.id}`);
                    } else {
                      navigate(`/rooms`);
                    }
                  }}
                  style={{ color: "var(--accent-color)", cursor: "pointer", textDecoration: "underline" }}
                >
                  {patient.roomNumber}
                </span>
              </p>
            ) : (
              <p className="muted">Room: Not Assigned</p>
            )}
            <button 
              className="btn-medical-history"
              onClick={() => navigate(`/patients/${patient.id}/medical-history`)}
            >
              View Medical History
            </button>
          </div>
        </div>
        <button className="btn-edit" onClick={() => navigate(`/patients/${patient.id}/edit`)}>Edit Patient</button>
      </section>

      {/* ===== Profile Info Section ===== */}
      <section className="summary card">
        <h3>Profile Info</h3>
        <div className="summary-grid">
          <div>
            <span>Date Registered</span>
            <p>{patient.registered}</p>
          </div>
          <div>
            <span>Marital Status</span>
            <p>{patient.maritalStatus || "N/A"}</p>
          </div>
          <div>
            <span>Nationality</span>
            <p>{patient.nationality || "N/A"}</p>
          </div>
          <div>
            <span>City</span>
            <p>{patient.city || "N/A"}</p>
          </div>
          <div>
            <span>Address</span>
            <p>{patient.address || "N/A"}</p>
          </div>
          <div>
            <span>Email</span>
            <p>{patient.email || "N/A"}</p>
          </div>
          <div>
            <span>Guardian Name</span>
            <p>{patient.guardianName || "N/A"}</p>
          </div>
          <div>
            <span>Guardian Phone</span>
            <p>{patient.guardianPhone || "N/A"}</p>
          </div>
        </div>
      </section>

      {/* ===== Visit History ===== */}
      <section className="visits card">
        <h3>Visit History</h3>
        <table>
          <thead>
            <tr>
              <th>VISIT DATE</th>
              <th>ATTENDING PHYSICIAN</th>
              <th>TYPE OF VISIT</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {visits.map((v, i) => (
              <tr key={i}>
                <td>{v.date}</td>
                <td>{v.doctor}</td>
                <td>{v.type}</td>
                <td>
                  <button 
                    className="view-notes"
                    onClick={() => navigate(`/visits/${v.id}`)}
                    title="View Visit Details"
                  >
                    View Notes
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* ===== Prescriptions ===== */}
      <section className="prescriptions card">
        <div className="presc-header">
          <h3>Prescriptions</h3>
          <button className="btn-add" onClick={() => navigate(`/prescriptions/new?patientId=${id}`)}>➕ Add New Prescription</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>MEDICATION</th>
              <th>DOSAGE</th>
              <th>FREQUENCY</th>
              <th>PRESCRIBING PHYSICIAN</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {prescriptions.map((p, i) => (
              <tr key={i}>
                <td>{p.name}</td>
                <td>{p.dose}</td>
                <td>{p.freq}</td>
                <td>{p.doctor}</td>
                <td>
                  <button
                    className="icon-btn"
                    onClick={() => navigate(`/prescriptions/edit/${i}`)}
                    title="Edit Prescription"
                  >
                    ✏️
                  </button>
                  {" "}
                  <button
                    className="ai-btn"
                    onClick={() => handleAICheck(p)}
                    disabled={loading}
                  >
                    {loading ? "🔍 Checking..." : "🤖 AI Check"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <p style={{ marginTop: '1rem', color: '#999', fontSize: '0.9rem' }}>
          Cannot delete existing medicines; mark as discontinued or add new ones.
        </p>
      </section>

      {/* === AI Assistant Result Box === */}
      {aiAdvice && (
        <div className="ai-advice card">
          <h3>AI Assistant Analysis 🧠</h3>
          <p>{aiAdvice}</p>
        </div>
      )}
    </div>
  );
}
 