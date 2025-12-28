import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import DoctorInfoModal from "../doctors/DoctorInfoModal";
import "./viewSurgery.css";

export default function ViewSurgery() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isDoctorModalOpen, setIsDoctorModalOpen] = useState(false);

  // ✅ بيانات تجريبية لغاية ما تربطها ب Database
  const surgeries = [
  {
    id: "OP-8B1A6C",
    operationId: "CABG-2024-00781",
    name: "Coronary Artery Bypass Graft",
    type: "Cardiac Surgery",
    status: "Completed",
    date: "2024-07-26, 08:00 AM",
    patient: {
      name: "George Samy",
      patientId: "P-987654",
      gender: "Male",
      age: 62,
      contact: "+20 1001521663",
    },
    surgeon: {
      name: "Dr. Mahmoud Badran",
      specialty: "Cardiothoracic Surgery",
      contact: "MahmoudBadran610@gmail.com",
    },
    details: {
      department: "Cardiology",
      room: "OR-03",
      duration: "4 hours 15 minutes",
      anesthesiologist: "Dr. Aly",
      assistants: " Sarah ,  Aya",
    },
    notes: {
      preOp:
        "Patient stable, prepped for surgery. Standard pre-op checks completed. Blood type O+ confirmed on standby.",
      postOp:
        "Procedure successful. Patient transferred to ICU for recovery. Vitals are stable. Monitoring for post-op complications.",
      complications: "None reported during the procedure.",
    },
  },

  {
    id: "OP-D4E2F0",
    operationId: "APPND-2024-00231",
    name: "Appendectomy",
    type: "General Surgery",
    status: "Completed",
    date: "2024-10-27, 14:30 PM",
    patient: {
      name: "Mohmad Samy",
      patientId: "P-112233",
      gender: "Male",
      age: 35,
      contact: "+20 555 9988",
    },
    surgeon: {
      name: "Dr. Mahmoud Badran",
      specialty: "General Surgeon",
      contact: "MahmoudBadran610@gmail.com",
    },
    details: {
      department: "Surgery",
      room: "OR-07",
      duration: "1 hour 10 minutes",
      anesthesiologist: "Dr. Aly",
      assistants: "Sarah , Aya",
    },
    notes: {
      preOp: "Standard surgical prep. Mild inflammation detected.",
      postOp: "Surgery completed successfully. Patient recovering well.",
      complications: "None.",
    },
  },
];

// ✅ نجيب العملية اللي اتداس عليها
const surgery = surgeries.find((s) => s.id === id);

// لو ال ID مش موجود
if (!surgery) {
  return <h2 style={{ color: "red", textAlign: "center" }}>⚠️ Surgery Not Found</h2>;
}

  

  return (
    <div className="view-surgery-page">

      {/* ------- Header Section ------- */}
      <div className="surgery-header">
        <h1>{surgery.name}</h1>

        <div className="header-row">
          <span className="op-id">Operation ID: {surgery.operationId}</span>
          <span className={`badge ${surgery.status.toLowerCase()}`}>{surgery.status}</span>
        </div>

        <div className="header-meta">
          <span>🫀 {surgery.type}</span>
          <span>📅 {surgery.date}</span>
        </div>
      </div>

      {/* ------- Surgery Information ------- */}
      <div className="info-card-grid">
        <div className="info-card">
          <h3>Surgery Information</h3>
          <p><b>Operation ID:</b> {surgery.operationId}</p>
          <p><b>Type:</b> {surgery.type}</p>
          <p><b>Date:</b> {surgery.date}</p>
          <p><b>Status:</b> {surgery.status}</p>
        </div>

        <div className="info-card">
          <h3>Patient</h3>
          <p><b>Name:</b> {surgery.patient.name}</p>
          <p><b>Patient ID:</b> {surgery.patient.patientId}</p>
          <button 
            className="btn-link" 
            onClick={() => navigate(`/patient/${surgery.patient.patientId}`)}
            style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#e53935', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Go to Patient Information
          </button>
        </div>

        <div className="info-card">
          <h3>Lead Surgeon</h3>
          <p><b>Name:</b> {surgery.surgeon.name}</p>
          <button 
            className="btn-link" 
            onClick={() => setIsDoctorModalOpen(true)}
            style={{ marginTop: '0.5rem', padding: '0.5rem 1rem', background: '#e53935', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Go to Doctor Information
          </button>
        </div>

        {/* ------- Notes ------- */}
        <div className="info-card notes">
          <h3>Notes Section</h3>
          <p><b>Pre-operative Notes</b></p>
          <p>{surgery.notes.preOp}</p>

          <p><b>Post-operative Notes</b></p>
          <p>{surgery.notes.postOp}</p>

          <p><b>Complications</b></p>
          <p>{surgery.notes.complications}</p>
        </div>
      </div>

      {/* ------- Surgery Details (bottom section) ------- */}
      <div className="details-card">
        <h3>Surgery Details</h3>

        <p><b>Department:</b> {surgery.details.department}</p>
        <p><b>Operation Room:</b> {surgery.details.room}</p>
        <p><b>Actual Duration:</b> {surgery.details.duration}</p>
        <p><b>Anesthesiologist:</b> {surgery.details.anesthesiologist}</p>
        <p><b>Assistants/Nurses:</b> {surgery.details.assistants}</p>
      </div>

      {/* ------- History Section (if exists) ------- */}
      {surgery.history && surgery.history.length > 0 && (
        <div className="details-card">
          <h3>Update History</h3>
          {surgery.history.map((entry, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#1c1d20', borderRadius: '8px' }}>
              <p><b>Updated:</b> {new Date(entry.timestamp).toLocaleString()}</p>
              <p><b>Reason:</b> {entry.reason}</p>
              <div style={{ marginTop: '0.5rem' }}>
                <p><b>Changes:</b></p>
                {Object.keys(entry.newValues).map(key => {
                  if (key === 'history' || key === 'id') return null;
                  const oldVal = entry.oldValues[key];
                  const newVal = entry.newValues[key];
                  if (oldVal !== newVal) {
                    return (
                      <p key={key} style={{ marginLeft: '1rem' }}>
                        <b>{key}:</b> <span style={{ textDecoration: 'underline', textDecorationColor: 'red' }}>{oldVal}</span> → {newVal}
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="actions">
        <button className="btn-back" onClick={() => navigate("/surgeries")}>
          ⬅ Back to List
        </button>

        <button className="btn-print">
          🖨 Print / Download PDF
        </button>

        <button className="btn-edit" onClick={() => navigate(`/surgeries/edit/${id}`)}>
          ✏ Edit Surgery
        </button>
      </div>

      <DoctorInfoModal
        isOpen={isDoctorModalOpen}
        onClose={() => setIsDoctorModalOpen(false)}
      />
    </div>
  );
}
