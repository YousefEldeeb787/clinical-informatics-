import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./newSurgery.css";

export default function NewSurgery() {
  const navigate = useNavigate();

  const [surgery, setSurgery] = useState({
    operationId: `OP-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    patient: "",
    type: "",
    date: "",
    time: "",
    room: "",
    anesthesia: "",
    preOpInstructions: "",
    postOpInstructions: "",
    status: "Scheduled",
    notes: ""
  });

  function handleChange(e) {
    setSurgery({ ...surgery, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    console.log("✅ New Surgery Created:", surgery);

    alert("✅ Surgery successfully created!");

    navigate("/surgeries");
  }

  return (
    <div className="new-surgery-page">
      <h1>Create New Surgery</h1>

      <form className="surgery-form" onSubmit={handleSubmit}>

        {/* ============ Surgery Information ============ */}
        <section className="form-section">
          <h2>Surgery Information</h2>

          <div className="form-grid">
            <div className="form-group">
              <label>Operation ID</label>
              <input type="text" value={surgery.operationId} disabled />
            </div>

            <div className="form-group">
              <label>Surgery Type *</label>
              <input
                type="text"
                name="type"
                placeholder="Example: Knee Replacement"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Patient *</label>
              <input
                type="text"
                name="patient"
                placeholder="Enter patient name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Surgery Date *</label>
              <input type="date" name="date" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Surgery Time *</label>
              <input type="time" name="time" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Room / Ward *</label>
              <input
                type="text"
                name="room"
                placeholder="e.g., OR-03"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Anesthesia Type *</label>
              <select name="anesthesia" onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="General">General</option>
                <option value="Local">Local</option>
                <option value="Spinal">Spinal</option>
                <option value="Sedation">Sedation</option>
              </select>
            </div>

          </div>
        </section>

        {/* ============ Instructions & Notes ============ */}
        <section className="form-section">
          <h2>Instructions & Notes</h2>

          <div className="form-group full-width">
            <label>Pre-Op Instructions</label>
            <textarea
              name="preOpInstructions"
              placeholder="Instructions before surgery..."
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>Post-Op Instructions</label>
            <textarea
              name="postOpInstructions"
              placeholder="Instructions after surgery..."
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="form-group full-width">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              placeholder="Enter diagnosis, notes, or remarks related to the surgery"
              rows="3"
              onChange={handleChange}
            ></textarea>
          </div>
        </section>

        <div className="actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/surgeries")}>
            Cancel / Back to List
          </button>
          <button type="submit" className="btn-save">Save Surgery</button>
          <button 
            type="button" 
            className="btn-save" 
            onClick={(e) => {
              e.preventDefault();
              handleSubmit(e);
              setTimeout(() => {
                navigate("/prescriptions/new");
              }, 100);
            }}
          >
            Save & Add Prescription
          </button>
        </div>
      </form>
    </div>
  );
}
