import "./PrescriptionDetails.css";
import { useNavigate, useParams } from "react-router-dom";

export default function PrescriptionDetails() {
  const navigate = useNavigate();
  const { id } = useParams(); // RX789-001 for example

  // ✅ بيانات افتراضية (لاحقًا ممكن نجيبها من backend أو Redux)
  const prescription = {
    id,
    dateIssued: "2025-10-27",
    status: "Active",
    doctor: {
      name: "Dr. Mahmoud Badran",
      specialty: "Cardiologist",
      email: "MahmoudBadran610@gmail.com",
      clinic: "El Hegaz Street",
    },
    patient: {
      name: "Joo Malak",
      gender: "Male",
      age: 42,
      contact: "j.malak@email.com",
    },
    medicines: [
      { name: "Lisinopril", dosage: "10mg", frequency: "Once daily", duration: "90 days", notes: "Take in the morning." },
      { name: "Aspirin", dosage: "81mg", frequency: "Once daily", duration: "Ongoing", notes: "Take with food." },
      { name: "Metformin", dosage: "500mg", frequency: "Twice daily", duration: "60 days", notes: "Take with meals." },
    ],
    notes: {
      diagnosis: "Hypertension & Type 2 Diabetes.",
      remarks: "Monitor blood pressure daily. Follow up appointment in 3 months.",
    },
  };

  return (
    <div className="prescription-view-container">

      <div className="breadcrumb">
        <span onClick={() => navigate("/prescriptions")}>Dashboard / Prescriptions</span>
        <span> / {prescription.id}</span>
      </div>

      <div className="header-row">
        <h1>Prescription ID: {prescription.id}</h1>
        <span className="status-badge">{prescription.status}</span>
      </div>
      <p className="date-issued">Date Issued: {prescription.dateIssued}</p>

      {/* Doctor & Patient Cards */}
      <div className="info-grid">
        <div className="info-card">
          <h3>Doctor Information</h3>
          <p><strong>Doctor’s Name:</strong> {prescription.doctor.name}</p>
          <p><strong>Specialty:</strong> {prescription.doctor.specialty}</p>
          <p><strong>Contact:</strong> {prescription.doctor.email}</p>
          <p><strong>Clinic Address:</strong> {prescription.doctor.clinic}</p>
        </div>

        <div className="info-card">
          <h3>Patient Information</h3>
          <p><strong>Patient’s Name:</strong> {prescription.patient.name}</p>
          <p><strong>Gender:</strong> {prescription.patient.gender}</p>
          <p><strong>Age:</strong> {prescription.patient.age}</p>
          <p><strong>Contact:</strong> {prescription.patient.contact}</p>
        </div>
      </div>

      {/* Medicines Table */}
      <div className="medicines-card">
        <h3>Medicines List</h3>
        <table>
          <thead>
            <tr>
              <th>Medicine Name</th>
              <th>Dosage</th>
              <th>Frequency</th>
              <th>Duration</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {prescription.medicines.map((m, index) => (
              <tr key={index}>
                <td>{m.name}</td>
                <td>{m.dosage}</td>
                <td>{m.frequency}</td>
                <td>{m.duration}</td>
                <td>{m.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Additional Notes */}
      <div className="notes-card">
        <h3>Additional Notes</h3>
        <p><strong>Diagnosis:</strong> {prescription.notes.diagnosis}</p>
        <p><strong>Remarks:</strong> {prescription.notes.remarks}</p>
      </div>

      {/* Actions */}
      <div className="actions-row">
        <button className="btn-edit" onClick={() => navigate(`/prescriptions/edit/${prescription.id}`)}>
          ✏️ Edit Prescription
        </button>

        <button className="btn-secondary">
          🖨️ Print / Download PDF
        </button>

        <button className="btn-back" onClick={() => navigate("/prescriptions")}>
          ← Back to List
        </button>
      </div>

    </div>
  );
}
