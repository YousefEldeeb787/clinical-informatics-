import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newMedicalRecord.css";

export default function NewMedicalRecord() {
  const navigate = useNavigate();

  const [medications, setMedications] = useState([
    { name: "Atorvastatin", dosage: "20mg", frequency: "Once daily", duration: "30 days" },
  ]);

  function addMedication() {
    setMedications([...medications, { name: "", dosage: "", frequency: "", duration: "" }]);
  }

  function removeMedication(index) {
    setMedications(medications.filter((_, i) => i !== index));
  }

  return (
    <div className="record-form-page">
      <h1>Create New Medical Record</h1>
      <p>Fill in the details below to create a new record for the patient.</p>

      <div className="record-form">

        {/* Patient + Doctor */}
        <div className="grid-2 gap">
          <label className="field">
            <span>Patient</span>
            <input type="text" placeholder="John Appleseed (ID: P-00123)" />
          </label>

          <label className="field">
            <span>Attending Doctor</span>
            <input type="text" placeholder="Dr. Anya Sharma" />
          </label>
        </div>

        {/* Date + Visit Type */}
        <div className="grid-2 gap">
          <label className="field">
            <span>Date of Visit</span>
            <input type="date" />
          </label>

          <label className="field">
            <span>Visit Type</span>
            <select>
              <option>Routine Check-up</option>
              <option>Follow-up</option>
              <option>Emergency</option>
              <option>Consultation</option>
            </select>
          </label>
        </div>

        {/* Symptoms + Diagnosis */}
        <div className="grid-2 gap">
          <label className="field full">
            <span>Symptoms</span>
            <textarea placeholder="Describe the patient’s symptoms..."></textarea>
          </label>

          <label className="field full">
            <span>Diagnosis</span>
            <textarea placeholder="Enter diagnosis details..."></textarea>
          </label>
        </div>

        {/* File Upload */}
        
        <div>
          <label className="upload-box">
            Imaging Results
            <input type="file" hidden />
            <div className="upload-area">📁 Click to upload or drag and drop</div>
            <small>DICOM, JPG, PNG (Max: 50MB)</small>
          </label>
        </div>

        {/* Medications */}
        <div>
          <h3>Prescribed Medications</h3>

          {medications.map((med, index) => (
            <div className="grid-4 gap meds-row" key={index}>
              <input
                type="text"
                placeholder="Medicine Name"
                value={med.name}
                onChange={(e) => {
                  const updated = [...medications];
                  updated[index].name = e.target.value;
                  setMedications(updated);
                }}
              />
              <input
                type="text"
                placeholder="Dosage (e.g., 20mg)"
                value={med.dosage}
                onChange={(e) => {
                  const updated = [...medications];
                  updated[index].dosage = e.target.value;
                  setMedications(updated);
                }}
              />
              <input
                type="text"
                placeholder="Frequency"
                value={med.frequency}
                onChange={(e) => {
                  const updated = [...medications];
                  updated[index].frequency = e.target.value;
                  setMedications(updated);
                }}
              />
              <input
                type="text"
                placeholder="Duration"
                value={med.duration}
                onChange={(e) => {
                  const updated = [...medications];
                  updated[index].duration = e.target.value;
                  setMedications(updated);
                }}
              />

              <button className="delete-btn" onClick={() => removeMedication(index)}>🗑</button>
            </div>
          ))}

          <button className="add-btn" onClick={addMedication}>➕ Add Medication</button>
        </div>

        {/* Notes */}
        <label className="field full">
          <span>Doctor’s Notes & Recommendations</span>
          <textarea placeholder="Add any additional notes, follow-up instructions, or recommendations..."></textarea>
        </label>

        {/* Buttons */}
        <div className="actions-row">
          <button className="cancel" onClick={() => navigate("/reports")}>
            Cancel / Back to List
          </button>

          <button className="save">Save Medical Record</button>
        </div>

      </div>
    </div>
  );
}
