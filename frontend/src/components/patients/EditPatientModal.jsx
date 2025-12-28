import { useState, useEffect } from "react";
import "./addPatient.css"; // Reuse styles
import "../doctors/doctorInfoModal.css"; // Reuse modal styles

export default function EditPatientModal({ isOpen, onClose, patientId, onSave }) {
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

    const [errors, setErrors] = useState({});
    const [showToast, setShowToast] = useState(false);

    useEffect(() => {
        if (isOpen && patientId) {
            // Load patient data
            // Try to find in localStorage "patients"
            const patients = JSON.parse(localStorage.getItem("patients") || "[]");
            const patient = patients.find(p => p.patientId === patientId || p.id === patientId);

            if (patient) {
                setFormData({
                    ...patient,
                    firstName: patient.firstName || patient.name?.split(' ')[0] || "",
                    lastName: patient.lastName || patient.name?.split(' ').slice(1).join(' ') || "",
                });
            } else {
                // Fallback for mock data (read-only mostly, but editable here)
                // In real app, fetch from API
                const mockPatients = {
                    "P001": { firstName: "John", lastName: "Doe", dob: "1989-05-15", phone: "555-0101", age: "34" },
                    "P002": { firstName: "Jane", lastName: "Smith", dob: "1995-08-22", phone: "555-0102", age: "28" },
                    "P003": { firstName: "Sam", lastName: "Wilson", dob: "1978-03-10", phone: "555-0103", age: "45" },
                    "P004": { firstName: "Emily", lastName: "Jones", dob: "1971-11-30", phone: "555-0104", age: "52" },
                    "P005": { firstName: "Chris", lastName: "Lee", dob: "1984-07-05", phone: "555-0105", age: "39" },
                };
                const mock = mockPatients[patientId];
                if (mock) {
                    setFormData(prev => ({ ...prev, ...mock, patientId }));
                }
            }
        }
    }, [isOpen, patientId]);

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

        if (name === "dob") {
            newFormData.age = calculateAge(value);
        }

        if (name === "sameAsGuardian" && checked) {
            newFormData.emergencyContactName = formData.guardianName;
        }
        if (name === "sameAsGuardianPhone" && checked) {
            newFormData.emergencyContactPhone = formData.guardianPhone;
        }

        setFormData(newFormData);

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
        if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
        if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = (e) => {
        e.preventDefault();
        if (!validate()) return;

        // Update localStorage
        const patients = JSON.parse(localStorage.getItem("patients") || "[]");
        const index = patients.findIndex(p => p.patientId === patientId || p.id === patientId);

        const updatedPatient = {
            ...formData,
            name: `${formData.firstName} ${formData.lastName}`, // Update full name
            id: formData.patientId || patientId
        };

        if (index !== -1) {
            patients[index] = updatedPatient;
        } else {
            // If editing a mock patient not in storage, add it
            patients.push(updatedPatient);
        }

        localStorage.setItem("patients", JSON.stringify(patients));

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            if (onSave) onSave();
            onClose();
        }, 1500);
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="doctor-info-modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px', width: '90%' }}>
                <div className="modal-header">
                    <h2>Edit Patient</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-content" style={{ maxHeight: '70vh', overflowY: 'auto', padding: '20px' }}>
                    <form id="edit-patient-form" onSubmit={handleSave} className="patient-form">
                        {/* Reusing form grid from AddPatientForm but simplified structure for modal */}
                        <div className="form-grid">
                            <div className="form-group">
                                <label>First Name *</label>
                                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} className={errors.firstName ? "error" : ""} />
                                {errors.firstName && <span className="error-text">{errors.firstName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Last Name *</label>
                                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} className={errors.lastName ? "error" : ""} />
                                {errors.lastName && <span className="error-text">{errors.lastName}</span>}
                            </div>
                            <div className="form-group">
                                <label>Date of Birth *</label>
                                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className={errors.dob ? "error" : ""} />
                                {errors.dob && <span className="error-text">{errors.dob}</span>}
                            </div>
                            <div className="form-group">
                                <label>Age</label>
                                <input type="text" value={formData.age} readOnly className="readonly-field" />
                            </div>
                            <div className="form-group">
                                <label>Phone *</label>
                                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={errors.phone ? "error" : ""} />
                                {errors.phone && <span className="error-text">{errors.phone}</span>}
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Marital Status</label>
                                <select name="maritalStatus" value={formData.maritalStatus} onChange={handleChange}>
                                    <option value="">Select Status</option>
                                    <option value="Single">Single</option>
                                    <option value="Married">Married</option>
                                    <option value="Divorced">Divorced</option>
                                    <option value="Widowed">Widowed</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Nationality</label>
                                <input type="text" name="nationality" value={formData.nationality} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>City</label>
                                <input type="text" name="city" value={formData.city} onChange={handleChange} />
                            </div>
                            <div className="form-group full-width">
                                <label>Address</label>
                                <textarea name="address" rows="2" value={formData.address} onChange={handleChange} />
                            </div>

                            <div className="form-section-divider full-width"><h3>Guardian Info</h3></div>

                            <div className="form-group">
                                <label>Guardian Name</label>
                                <input type="text" name="guardianName" value={formData.guardianName} onChange={handleChange} />
                            </div>
                            <div className="form-group">
                                <label>Guardian Phone</label>
                                <input type="tel" name="guardianPhone" value={formData.guardianPhone} onChange={handleChange} />
                            </div>

                            <div className="form-section-divider full-width"><h3>Emergency Contact</h3></div>

                            <div className="form-group">
                                <label>Contact Name</label>
                                <input type="text" name="emergencyContactName" value={formData.emergencyContactName} onChange={handleChange} disabled={formData.sameAsGuardian} />
                                <label className="checkbox-label"><input type="checkbox" name="sameAsGuardian" checked={formData.sameAsGuardian} onChange={handleChange} /> Same as Guardian</label>
                            </div>
                            <div className="form-group">
                                <label>Contact Phone</label>
                                <input type="tel" name="emergencyContactPhone" value={formData.emergencyContactPhone} onChange={handleChange} disabled={formData.sameAsGuardianPhone} />
                                <label className="checkbox-label"><input type="checkbox" name="sameAsGuardianPhone" checked={formData.sameAsGuardianPhone} onChange={handleChange} /> Same as Guardian Phone</label>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="modal-footer">
                    <button className="btn-cancel" onClick={onClose}>Cancel</button>
                    <button className="btn-save" onClick={handleSave}>Save Changes</button>
                </div>

                {showToast && (
                    <div className="toast success">
                        ✅ Patient updated successfully!
                    </div>
                )}
            </div>
        </div>
    );
}
