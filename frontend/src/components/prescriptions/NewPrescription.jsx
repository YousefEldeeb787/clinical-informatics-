import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import "./newPrescription.css";

export default function NewPrescription() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const patientIdFromUrl = searchParams.get("patientId");
  const [isExisting, setIsExisting] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const [prescriptionInfo, setPrescriptionInfo] = useState({
    prescriptionId: "",
    dateIssued: new Date().toISOString().split('T')[0],
    patient: patientIdFromUrl || "",
    visitType: "", // Changed from visitId to visitType
  });

  const [medicines, setMedicines] = useState([
    { name: "", dosage: "", frequency: "", route: "", duration: "", id: Date.now() },
  ]);

  useEffect(() => {
    // Check if editing existing prescription from navigation state
    if (location.state && location.state.editingPrescription) {
      const { editingPrescription } = location.state;
      setPrescriptionInfo({
        prescriptionId: editingPrescription.id,
        dateIssued: editingPrescription.date,
        patient: editingPrescription.patient, // Note: this might need mapping if patient is name vs ID
        visitType: editingPrescription.visitType || "",
      });
      if (editingPrescription.medicines) {
        setMedicines(editingPrescription.medicines);
      }
      setIsExisting(true);
    }
  }, [location.state]);

  const handleChange = (e) => {
    setPrescriptionInfo({ ...prescriptionInfo, [e.target.name]: e.target.value });
  };

  const handleMedicineChange = (index, e) => {
    const updated = [...medicines];
    updated[index][e.target.name] = e.target.value;
    setMedicines(updated);
  };

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", frequency: "", route: "", duration: "", id: Date.now() }]);
  };

  const removeMedicine = (index) => {
    const medicine = medicines[index];
    // Prevent deletion if it's an existing medicine entry
    if (isExisting && medicine.existing) {
      alert("Cannot delete existing medicine entries. To stop a medicine, please mark it as discontinued or create a new prescription.");
      return;
    }
    const updated = medicines.filter((_, i) => i !== index);
    setMedicines(updated);
  };

  const generatePrescriptionId = () => {
    if (prescriptionInfo.prescriptionId) return prescriptionInfo.prescriptionId;
    return `RX-${Date.now().toString().slice(-6)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const finalPrescription = {
      ...prescriptionInfo,
      prescriptionId: generatePrescriptionId(),
      medicines,
      savedAt: new Date().toISOString(),
    };

    // Save to localStorage (mock persist)
    const prescriptions = JSON.parse(localStorage.getItem("prescriptions") || "[]");
    prescriptions.push(finalPrescription);
    localStorage.setItem("prescriptions", JSON.stringify(prescriptions));

    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
      navigate(`/prescriptions`); // Navigate back to list
    }, 2000);
  };

  return (
    <div className="prescription-page">

      <h1>{isExisting ? "Edit Prescription" : "Create New Prescription"}</h1>

      <form className="prescription-form" onSubmit={handleSubmit}>

        {/* PRESCRIPTION INFO */}
        <section className="section">
          <h3>Prescription Information</h3>

          <div className="grid-2">
            <label>
              Prescription ID
              <input
                type="text"
                name="prescriptionId"
                placeholder="Auto-generated if left blank"
                value={prescriptionInfo.prescriptionId}
                onChange={handleChange}
                readOnly={isExisting} // ID shouldn't change on edit
              />
            </label>

            <label>
              Date Issued *
              <input
                type="date"
                name="dateIssued"
                value={prescriptionInfo.dateIssued}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              Patient *
              <select name="patient" value={prescriptionInfo.patient} onChange={handleChange} required>
                <option value="">Select Patient</option>
                <option value="P001">John Doe (P001)</option>
                <option value="P002">Jane Smith (P002)</option>
                <option value="P003">Sam Wilson (P003)</option>
                {/* Add more options or load dynamically */}
              </select>
            </label>
          </div>
        </section>

        {/* MEDICINES */}
        <section className="section">
          <h3>Medicines</h3>

          {medicines.map((med, index) => (
            <div key={med.id || index} className="medicine-row">
              <input
                name="name"
                type="text"
                placeholder="Medicine name"
                value={med.name}
                onChange={(e) => handleMedicineChange(index, e)}
                required
              />
              <input
                name="dosage"
                type="text"
                placeholder="20mg"
                value={med.dosage}
                onChange={(e) => handleMedicineChange(index, e)}
                required
              />
              <input
                name="frequency"
                type="text"
                placeholder="Once daily, Twice daily, etc."
                value={med.frequency}
                onChange={(e) => handleMedicineChange(index, e)}
                required
              />
              <input
                name="route"
                type="text"
                placeholder="Oral, IV, etc."
                value={med.route}
                onChange={(e) => handleMedicineChange(index, e)}
              />
              <input
                name="duration"
                type="text"
                placeholder="30 days"
                value={med.duration}
                onChange={(e) => handleMedicineChange(index, e)}
              />

              <button
                type="button"
                className="delete-btn"
                onClick={() => removeMedicine(index)}
                disabled={isExisting && med.existing}
                title={isExisting && med.existing ? "Cannot delete existing medicine entries" : "Remove"}
              >
                🗑️
              </button>
              {isExisting && med.existing && (
                <span className="existing-medicine-note">Existing entry - cannot delete</span>
              )}
            </div>
          ))}

          <button type="button" className="add-btn" onClick={addMedicine}>
            ➕ Add Another Medicine
          </button>
        </section>

        {/* TYPE OF VISIT */}
        <section className="section">
          <h3>Type of Visit</h3>
          <label>
            <select name="visitType" value={prescriptionInfo.visitType} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="Diagnosis">Diagnosis</option>
              <option value="Surgery">Surgery</option>
              <option value="Follow-Up">Follow-Up</option>
            </select>
          </label>

          {/* Visit Details Area */}
          {prescriptionInfo.visitType && (
            <div className="visit-summary">
              <h4>Visit Details</h4>
              <p>No data to display</p>
            </div>
          )}
        </section>

        {/* Action Buttons */}
        <div className="form-actions">
          <button type="button" className="btn-cancel" onClick={() => navigate("/prescriptions")}>
            Cancel / Back to List
          </button>
          <button type="submit" className="btn-save">Save Prescription</button>
        </div>
      </form>

      {showToast && (
        <div className="toast success">
          ✅ Prescription saved! Redirecting...
        </div>
      )}
    </div>
  );
}
