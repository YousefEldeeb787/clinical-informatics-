import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./doctorInfoModal.css";

export default function DoctorInfoModal({ isOpen, onClose, onClinicNameUpdate, embedded = false }) {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [doctorData, setDoctorData] = useState({
    photo: "https://cdn-icons-png.flaticon.com/512/921/921056.png",
    name: "Dr. Mahmoud Badran",
    clinicName: "Clinical System",
    specialty: "Cardiology",
    contactPhone: "+20 1228893334",
    officeHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    clinicAddress: "Cairo - Masr el Gadeda - El Hegaz street",
    shortBio: "Experienced cardiologist with 3 years of practice.",
    theme: "light",
    // Visibility toggles for each field
    showName: true,
    showClinicName: true,
    showSpecialty: true,
    showContactPhone: true,
    showOfficeHours: true,
    showClinicAddress: true,
    showShortBio: true,
  });

  const [errors, setErrors] = useState({});
  const [photoPreview, setPhotoPreview] = useState(doctorData.photo);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Load doctor data from localStorage or default
    const saved = localStorage.getItem("doctorData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDoctorData(parsed);
      setPhotoPreview(parsed.photo);
      if (onClinicNameUpdate) {
        onClinicNameUpdate(parsed.clinicName);
      }
      // Apply theme
      if (parsed.theme) {
        document.documentElement.setAttribute("data-theme", parsed.theme);
      }
    }
  }, []);

  if (!isOpen && !embedded) return null;

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setDoctorData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!file.type.match(/^image\/(jpg|jpeg|png)$/i)) {
        setErrors((prev) => ({ ...prev, photo: "Please upload a JPG or PNG image" }));
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
        setDoctorData((prev) => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!doctorData.name.trim()) newErrors.name = "Doctor name is required";
    if (!doctorData.clinicName.trim()) newErrors.clinicName = "Clinic name is required";
    if (!doctorData.specialty.trim()) newErrors.specialty = "Specialty is required";
    if (doctorData.contactPhone && !/^\+?[\d\s-()]+$/.test(doctorData.contactPhone)) {
      newErrors.contactPhone = "Invalid phone number format";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    // Save to localStorage
    localStorage.setItem("doctorData", JSON.stringify(doctorData));
    
    // Also save theme separately for global access
    localStorage.setItem("theme", doctorData.theme);
    
    // Update clinic name in parent (navbar) and dispatch event
    if (onClinicNameUpdate) {
      onClinicNameUpdate(doctorData.clinicName);
    }
    window.dispatchEvent(new CustomEvent('clinicNameUpdated', { detail: doctorData.clinicName }));

    setIsEditing(false);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCancel = () => {
    // Reload from localStorage
    const saved = localStorage.getItem("doctorData");
    if (saved) {
      const parsed = JSON.parse(saved);
      setDoctorData(parsed);
      setPhotoPreview(parsed.photo);
    }
    setIsEditing(false);
    setErrors({});
  };

  const handleThemeToggle = () => {
    const newTheme = doctorData.theme === "light" ? "dark" : "light";
    setDoctorData((prev) => ({ ...prev, theme: newTheme }));
    // Apply theme to document immediately
    document.documentElement.setAttribute("data-theme", newTheme);
    // Save theme to localStorage (will be saved with doctorData on Save, but also save immediately for global access)
    localStorage.setItem("theme", newTheme);
  };

  const content = (
    <div className={`doctor-info-modal ${embedded ? "embedded" : ""}`} onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Doctor Information</h2>
          {!embedded && <button className="close-btn" onClick={onClose}>×</button>}
        </div>

        <div className="modal-content">
          {/* Photo Section */}
          <div className="photo-section">
            <div className="photo-container">
              <img src={photoPreview} alt="Doctor" />
              {isEditing && (
                <label className="photo-upload-btn">
                  📷 Change Photo
                  <input
                    type="file"
                    accept="image/jpeg,image/jpg,image/png"
                    onChange={handlePhotoChange}
                    style={{ display: "none" }}
                  />
                </label>
              )}
            </div>
            {errors.photo && <span className="error-text">{errors.photo}</span>}
          </div>

          {/* Editable Fields */}
          <div className="fields-section">
            <div className="field-group">
              <label>Doctor Name *</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={doctorData.name}
                    onChange={handleInputChange}
                    className={errors.name ? "error" : ""}
                  />
                  {errors.name && <span className="error-text">{errors.name}</span>}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showName"
                      checked={doctorData.showName}
                      onChange={handleInputChange}
                    />
                    Visible to Patients
                  </label>
                </>
              ) : (
                <p>{doctorData.name}</p>
              )}
            </div>

            <div className="field-group">
              <label>Clinic Name *</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="clinicName"
                    value={doctorData.clinicName}
                    onChange={handleInputChange}
                    className={errors.clinicName ? "error" : ""}
                  />
                  {errors.clinicName && <span className="error-text">{errors.clinicName}</span>}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showClinicName"
                      checked={doctorData.showClinicName}
                      onChange={handleInputChange}
                    />
                    Visible to Patients
                  </label>
                </>
              ) : (
                <p>{doctorData.clinicName}</p>
              )}
            </div>

            <div className="field-group">
              <label>Specialty *</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="specialty"
                    value={doctorData.specialty}
                    onChange={handleInputChange}
                    className={errors.specialty ? "error" : ""}
                  />
                  {errors.specialty && <span className="error-text">{errors.specialty}</span>}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showSpecialty"
                      checked={doctorData.showSpecialty}
                      onChange={handleInputChange}
                    />
                    Visible to Patients
                  </label>
                </>
              ) : (
                <p>{doctorData.specialty}</p>
              )}
            </div>

            <div className="field-group">
              <label>Contact Phone</label>
              {isEditing ? (
                <>
                  <input
                    type="tel"
                    name="contactPhone"
                    value={doctorData.contactPhone}
                    onChange={handleInputChange}
                    className={errors.contactPhone ? "error" : ""}
                  />
                  {errors.contactPhone && <span className="error-text">{errors.contactPhone}</span>}
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showContactPhone"
                      checked={doctorData.showContactPhone}
                      onChange={handleInputChange}
                    />
                    Visible to Patients
                  </label>
                </>
              ) : (
                <p>{doctorData.contactPhone}</p>
              )}
            </div>

            <div className="field-group">
              <label>Office Hours</label>
              {isEditing ? (
                <>
                  <input
                    type="text"
                    name="officeHours"
                    value={doctorData.officeHours}
                    onChange={handleInputChange}
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showOfficeHours"
                      checked={doctorData.showOfficeHours}
                      onChange={handleInputChange}
                    />
                    Visible to Patients
                  </label>
                </>
              ) : (
                <p>{doctorData.officeHours}</p>
              )}
            </div>

            <div className="field-group">
              <label>Clinic Address</label>
              {isEditing ? (
                <>
                  <textarea
                    name="clinicAddress"
                    value={doctorData.clinicAddress}
                    onChange={handleInputChange}
                    rows="2"
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showClinicAddress"
                      checked={doctorData.showClinicAddress}
                      onChange={handleInputChange}
                    />
                    Visible to Patients
                  </label>
                </>
              ) : (
                <p>{doctorData.clinicAddress}</p>
              )}
            </div>

            <div className="field-group">
              <label>Short Bio</label>
              {isEditing ? (
                <>
                  <textarea
                    name="shortBio"
                    value={doctorData.shortBio}
                    onChange={handleInputChange}
                    rows="3"
                  />
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="showShortBio"
                      checked={doctorData.showShortBio}
                      onChange={handleInputChange}
                    />
                    Visible to Patients
                  </label>
                </>
              ) : (
                <p>{doctorData.shortBio}</p>
              )}
            </div>

            {/* Theme Toggle */}
            <div className="field-group">
              <label>Theme</label>
              <div className="theme-toggle">
                <button
                  className={`theme-btn ${doctorData.theme === "light" ? "active" : ""}`}
                  onClick={handleThemeToggle}
                >
                  ☀️ Light
                </button>
                <button
                  className={`theme-btn ${doctorData.theme === "dark" ? "active" : ""}`}
                  onClick={handleThemeToggle}
                >
                  🌙 Dark
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="modal-footer">
          {isEditing ? (
            <>
              <button className="btn-cancel" onClick={handleCancel}>
                Cancel
              </button>
              <button className="btn-save" onClick={handleSave}>
                Save
              </button>
            </>
          ) : (
            <>
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            </>
          )}
        </div>

        {showToast && (
          <div className="toast success">
            ✅ Doctor information saved successfully!
          </div>
        )}
      </div>
  );

  if (embedded) {
    return content;
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      {content}
    </div>
  );
}

