import { useNavigate, useParams, useLocation } from "react-router-dom";

import "./PatientRecord.css";

export default function PatientRecord() {
    const navigate = useNavigate();
    const { id } = useParams(); // لو في backend هتستخدم ال id لاحقًا
    const location = useLocation();
    const receivedRecord = location.state?.record;

    if (!receivedRecord) {
        return <h2 style={{ color: "white" }}>Record not found or page refreshed.</h2>;
    }


  // ✅ داتا تجريبية لحد ما تربطها مع قاعدة البيانات
    // ✅ استخدم البيانات اللي وصلت من MedicalRecordsList بدل ما تكون ثابتة
  const record = {
    id,
    patient: {
      name: receivedRecord.patient,
      recordId: receivedRecord.id,
      gender: receivedRecord.gender || "Male",
      age: receivedRecord.age || "N/A",
      contact: receivedRecord.phone || "19777",
      email: receivedRecord.email || "Not Provided",
      allergies: receivedRecord.allergies || "None",
    },
    clinical: {
      diagnosis: receivedRecord.diagnosis,
      symptoms: receivedRecord.symptoms || []
    },
    visit: {
      doctor: receivedRecord.doctor,
      recordId: receivedRecord.id,
      created: receivedRecord.created,
      updated: receivedRecord.updated,
      type: "Consultation"
    },
    prescriptions: receivedRecord.prescriptions || [],
    attachedReports: receivedRecord.attachedReports || [],
    notes: receivedRecord.notes || "No notes available.",
    recommendations: receivedRecord.recommendations || "No recommendations available."
  };


  return (
    <div className="record-page">
      {/* Allergy alert bar */}
      <div className="allergy-bar">⚠ Known Allergies: {record.patient.allergies}</div>

      <div className="record-header">
        <h1>Patient Record: {record.patient.name}</h1>
        <div className="header-actions">
          <button className="edit-btn" onClick={() => navigate(`/reports/edit/${id}`)}>✏ Edit Record</button>
          <button className="print-btn">🖨 Print / Download PDF</button>
          <button className="back-btn" onClick={() => navigate("/reports")}>⬅ Back to List</button>
        </div>
      </div>

      {/* Patient Information + Summary */}
      <div className="grid-2">
        <div className="info-card">
          <h3>Patient Information</h3>
          <p><b>Full Name:</b> {record.patient.name}</p>
          <p><b>Patient ID:</b> {record.patient.recordId}</p>
          <p><b>Gender:</b> {record.patient.gender}</p>
          <p><b>Age:</b> {record.patient.age}</p>
          <p><b>Contact:</b> {record.patient.contact}</p>
          <p><b>Email:</b> {record.patient.email}</p>
        </div>

        <div className="info-card">
          <h3>Clinical Summary</h3>
          <p><b>Diagnosis Summary:</b> {record.clinical.diagnosis}</p>

          <b>Symptoms Reported</b>
          <ul>
            {record.clinical.symptoms.map((symptom, i) => (
              <li key={i}>{symptom}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Visit Info + Prescriptions */}
      <div className="grid-2">
        <div className="info-card">
          <h3>Visit Information</h3>
          <p><b>Attending Doctor:</b> {record.visit.doctor}</p>
          <p><b>Record ID:</b> {record.visit.recordId}</p>
          <p><b>Date Created:</b> {record.visit.created}</p>
          <p><b>Last Updated:</b> {record.visit.updated}</p>
          <p><b>Visit Type:</b> {record.visit.type}</p>
        </div>

        <div className="info-card">
          <h3>Prescriptions</h3>
          <table className="med-table">
            <thead>
              <tr>
                <th>Medication</th>
                <th>Dosage</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {record.prescriptions.map((p, i) => (
                <tr key={i}>
                  <td>{p.med}</td>
                  <td>{p.dosage}, {p.freq}</td>
                  <td>{p.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Attached Reports + Doctor Notes */}
      <div className="grid-2">
        <div className="info-card">
          <h3>Attached Reports</h3>
          <ul className="files">
            {record.attachedReports.map((f, i) => (
              <li key={i}>
                📄 {f.name} <span className="file-action">{f.action}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="info-card">
          <h3>Doctor’s Notes & Recommendations</h3>
          <p><b>Notes</b></p>
          <p>{record.notes}</p>

          <p><b>Recommendations / Follow-up</b></p>
          <p>{record.recommendations}</p>
        </div>
      </div>
    </div>
  );
}
