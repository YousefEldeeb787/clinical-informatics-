import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./addPatient.css";

export default function AddPatientForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showMedicalHistoryPrompt, setShowMedicalHistoryPrompt] = useState(false);
  const [savedPatientId, setSavedPatientId] = useState(null);
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    patientId: "",
    firstName: "",
    lastName: "",
    dob: "",
    age: "",
    maritalStatus: "",
    nationality: "",
    city: "",
    address: "",
    phone: "",
    email: "",
    guardianName: "",
    guardianJob: "",
    guardianPhone: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    sameAsGuardian: false,
    sameAsGuardianPhone: false,
  });

  const calculateAge = (dob) => {
    if (!dob) return "";
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age.toString();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFormData = { ...formData, [name]: type === "checkbox" ? checked : value };

    // Calculate age when DOB changes
    if (name === "dob") {
      newFormData.age = calculateAge(value);
    }

    // Handle "Same as Guardian" checkboxes
    if (name === "sameAsGuardian" && checked) {
      newFormData.emergencyContactName = formData.guardianName;
    }
    if (name === "sameAsGuardianPhone" && checked) {
      newFormData.emergencyContactPhone = formData.guardianPhone;
    }

    setFormData(newFormData);
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.dob) newErrors.dob = "Date of birth is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (formData.phone && !/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (formData.guardianPhone && !/^\+?[\d\s-()]+$/.test(formData.guardianPhone)) {
      newErrors.guardianPhone = "Invalid phone number format";
    }
    if (formData.emergencyContactPhone && !/^\+?[\d\s-()]+$/.test(formData.emergencyContactPhone)) {
      newErrors.emergencyContactPhone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const generatePatientId = () => {
    if (formData.patientId) return formData.patientId;
    return `P-${Date.now().toString().slice(-6)}`;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const patientId = generatePatientId();
    const patientData = {
      ...formData,
      patientId,
    };

    // Save to localStorage (mock persist)
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    patients.push(patientData);
    localStorage.setItem("patients", JSON.stringify(patients));

    setSavedPatientId(patientId);
    setShowMedicalHistoryPrompt(true);
  };

  const handleAddMedicalHistoryNow = () => {
    navigate(`/patients/${savedPatientId}/medical-history/new`);
  };

  const handleAddMedicalHistoryLater = () => {
    setShowMedicalHistoryPrompt(false);
    navigate("/patients");
  };

  return (
    <div className="add-patient-page">
      <div className="form-container">
        <h1>Add New Patient</h1>

        <form onSubmit={handleSubmit} className="patient-form">
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter first name"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? "error" : ""}
                required
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter last name"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? "error" : ""}
                required
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label>Patient ID</label>
              <input
                type="text"
                name="patientId"
                placeholder="Auto-generated if left blank"
                value={formData.patientId}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Date of Birth (DOB) *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                className={errors.dob ? "error" : ""}
                required
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.dob && <span className="error-text">{errors.dob}</span>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="text"
                name="age"
                value={formData.age}
                readOnly
                className="readonly-field"
              />
            </div>

            <div className="form-group">
              <label>Marital Status</label>
              <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Nationality</label>
              <input
                type="text"
                name="nationality"
                placeholder="Enter nationality"
                value={formData.nationality}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="Enter city"
                value={formData.city}
                onChange={handleChange}
              />
            </div>

            <div className="form-group full-width">
              <label>Address</label>
              <textarea
                name="address"
                placeholder="Enter full address"
                rows="3"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? "error" : ""}
                required
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter email address"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? "error" : ""}
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-section-divider">
              <h3>Guardian Information</h3>
            </div>

            <div className="form-group">
              <label>Guardian Name</label>
              <input
                type="text"
                name="guardianName"
                placeholder="Enter guardian name"
                value={formData.guardianName}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Guardian Job</label>
              <input
                type="text"
                name="guardianJob"
                placeholder="Enter guardian job"
                value={formData.guardianJob}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label>Guardian Phone</label>
              <input
                type="tel"
                name="guardianPhone"
                placeholder="Enter guardian phone"
                value={formData.guardianPhone}
                onChange={handleChange}
                className={errors.guardianPhone ? "error" : ""}
              />
              {errors.guardianPhone && <span className="error-text">{errors.guardianPhone}</span>}
            </div>

            <div className="form-section-divider">
              <h3>Emergency Contact</h3>
            </div>

            <div className="form-group">
              <label>Emergency Contact Name</label>
              <input
                type="text"
                name="emergencyContactName"
                placeholder="Enter emergency contact name"
                value={formData.emergencyContactName}
                onChange={handleChange}
                disabled={formData.sameAsGuardian}
              />
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="sameAsGuardian"
                  checked={formData.sameAsGuardian}
                  onChange={handleChange}
                />
                Same as Guardian
              </label>
            </div>

            <div className="form-group">
              <label>Emergency Contact Phone</label>
              <input
                type="tel"
                name="emergencyContactPhone"
                placeholder="Enter emergency contact phone"
                value={formData.emergencyContactPhone}
                onChange={handleChange}
                disabled={formData.sameAsGuardianPhone}
                className={errors.emergencyContactPhone ? "error" : ""}
              />
              {errors.emergencyContactPhone && <span className="error-text">{errors.emergencyContactPhone}</span>}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="sameAsGuardianPhone"
                  checked={formData.sameAsGuardianPhone}
                  onChange={handleChange}
                />
                Same as Guardian Phone
              </label>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={() => navigate("/patients")}>
              Cancel
            </button>
            <button type="submit" className="btn-save">
              Save Patient
            </button>
          </div>
        </form>
      </div>

      {showMedicalHistoryPrompt && (
        <div className="modal-overlay">
          <div className="modal-content-prompt">
            <h2>Add New Medical History</h2>
            <p>Patient saved successfully! Would you like to add medical history now?</p>
            <div className="modal-actions">
              <button className="btn-secondary" onClick={handleAddMedicalHistoryLater}>
                Later
              </button>
              <button className="btn-primary" onClick={handleAddMedicalHistoryNow}>
                Add Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
