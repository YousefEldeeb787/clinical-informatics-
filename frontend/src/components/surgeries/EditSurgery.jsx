import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./editSurgery.css";

export default function EditSurgery() {
  const navigate = useNavigate();
  const { id } = useParams();

  // Mock surgery data - in real app, fetch from API
  const [surgery, setSurgery] = useState({
    operationId: "",
    patient: "",
    type: "",
    date: "",
    time: "",
    room: "",
    anesthesia: "",
    preOpInstructions: "",
    postOpInstructions: "",
    notes: "",
    // History tracking
    history: [],
  });

  const [reasonForUpdate, setReasonForUpdate] = useState("");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Load surgery data - in real app, fetch from API
    const surgeries = JSON.parse(localStorage.getItem("surgeries") || "[]");
    const found = surgeries.find(s => s.id === id);
    if (found) {
      setSurgery(found);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSurgery(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!reasonForUpdate.trim()) {
      setErrors({ reasonForUpdate: "Reason for update is required" });
      return;
    }

    // Store old values in history
    const oldValues = { ...surgery };
    const updateHistory = {
      timestamp: new Date().toISOString(),
      reason: reasonForUpdate,
      oldValues: oldValues,
      newValues: { ...surgery },
    };

    const updatedSurgery = {
      ...surgery,
      history: [...(surgery.history || []), updateHistory],
    };

    // Save to localStorage
    const surgeries = JSON.parse(localStorage.getItem("surgeries") || "[]");
    const index = surgeries.findIndex(s => s.id === id);
    if (index >= 0) {
      surgeries[index] = updatedSurgery;
    } else {
      surgeries.push({ ...updatedSurgery, id });
    }
    localStorage.setItem("surgeries", JSON.stringify(surgeries));

    alert("✅ Surgery updated successfully!");
    navigate(`/surgeries/view/${id}`);
  };

  return (
    <div className="edit-surgery-page">
      <h1>Edit Surgery</h1>

      <form className="surgery-form" onSubmit={handleSave}>
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
                value={surgery.type}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Patient *</label>
              <input
                type="text"
                name="patient"
                value={surgery.patient}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Surgery Date *</label>
              <input 
                type="date" 
                name="date" 
                value={surgery.date}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Surgery Time *</label>
              <input 
                type="time" 
                name="time" 
                value={surgery.time}
                onChange={handleChange} 
                required 
              />
            </div>

            <div className="form-group">
              <label>Room / Ward *</label>
              <input
                type="text"
                name="room"
                value={surgery.room}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Anesthesia Type *</label>
              <select name="anesthesia" value={surgery.anesthesia} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="General">General</option>
                <option value="Local">Local</option>
                <option value="Spinal">Spinal</option>
                <option value="Sedation">Sedation</option>
              </select>
            </div>
          </div>
        </section>

        <section className="form-section">
          <h2>Instructions & Notes</h2>

          <div className="form-group full-width">
            <label>Pre-Op Instructions</label>
            <textarea
              name="preOpInstructions"
              value={surgery.preOpInstructions}
              rows="3"
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Post-Op Instructions</label>
            <textarea
              name="postOpInstructions"
              value={surgery.postOpInstructions}
              rows="3"
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Additional Notes</label>
            <textarea
              name="notes"
              value={surgery.notes}
              rows="3"
              onChange={handleChange}
            />
          </div>
        </section>

        <section className="form-section">
          <div className="form-group full-width">
            <label>Reason for Update *</label>
            <textarea
              value={reasonForUpdate}
              onChange={(e) => {
                setReasonForUpdate(e.target.value);
                if (errors.reasonForUpdate) {
                  setErrors(prev => {
                    const newErrors = { ...prev };
                    delete newErrors.reasonForUpdate;
                    return newErrors;
                  });
                }
              }}
              placeholder="Please provide a reason for updating this surgery information..."
              rows="3"
              required
            />
            {errors.reasonForUpdate && (
              <span className="error-text">{errors.reasonForUpdate}</span>
            )}
          </div>
        </section>

        <div className="actions">
          <button type="button" className="btn-cancel" onClick={() => navigate(`/surgeries/view/${id}`)}>
            Cancel
          </button>
          <button type="submit" className="btn-save">Save Changes</button>
        </div>
      </form>
    </div>
  );
}

