import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./checkup.css";

export default function NewCheckUp() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        patientId: "",
        visitType: "",
        symptoms: "",
        vitals: { bp: "", hr: "", temp: "" },
        doctorExamination: "",
        finalDecision: "",
        attachments: [],
    });

    const [patients] = useState([
        { id: "P001", name: "John Doe" },
        { id: "P002", name: "Jane Smith" },
        { id: "P003", name: "Sam Wilson" },
    ]);

    const [showToast, setShowToast] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleVitalsChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            vitals: { ...prev.vitals, [name]: value },
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData((prev) => ({ ...prev, attachments: [...prev.attachments, ...files] }));
    };

    const removeAttachment = (index) => {
        setFormData((prev) => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index),
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Save check-up record
        const checkup = {
            ...formData,
            id: `CU-${Date.now()}`,
            date: new Date().toISOString().split('T')[0],
            status: "Completed", // Default status
        };

        const checkups = JSON.parse(localStorage.getItem("checkups") || "[]");
        checkups.push(checkup);
        localStorage.setItem("checkups", JSON.stringify(checkups));

        setShowToast(true);
        setTimeout(() => {
            setShowToast(false);
            navigate("/checkup"); // Redirect to list
        }, 2000);
    };

    return (
        <div className="checkup-page">
            <h1>New Check-Up</h1>

            <form onSubmit={handleSubmit} className="checkup-form">
                <div className="form-section">
                    <label>
                        Select Patient *
                        <input
                            type="text"
                            placeholder="Search patient by name or ID..."
                            value={formData.patientId}
                            onChange={(e) => {
                                const searchValue = e.target.value.toLowerCase();
                                const found = patients.find(
                                    (p) =>
                                        p.name.toLowerCase().includes(searchValue) ||
                                        p.id.toLowerCase().includes(searchValue)
                                );
                                if (found) {
                                    setFormData((prev) => ({ ...prev, patientId: found.id }));
                                } else {
                                    setFormData((prev) => ({ ...prev, patientId: e.target.value }));
                                }
                            }}
                            list="patients-list"
                            required
                        />
                        <datalist id="patients-list">
                            {patients.map((p) => (
                                <option key={p.id} value={`${p.name} (${p.id})`} />
                            ))}
                        </datalist>
                    </label>

                    <label>
                        Type of Visit *
                        <select
                            name="visitType"
                            value={formData.visitType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Type</option>
                            <option value="Diagnosis">Diagnosis</option>
                            <option value="Follow-Up">Follow-Up</option>
                        </select>
                    </label>
                </div>

                <div className="form-section">
                    <label>
                        Patient Statement
                        <textarea
                            name="symptoms"
                            placeholder="Patient statement..."
                            value={formData.symptoms}
                            onChange={handleChange}
                            rows="3"
                        />
                    </label>
                </div>

                <div className="form-section">
                    <h3>Vitals</h3>
                    <div className="vitals-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                        <label>
                            Blood Pressure
                            <input
                                type="text"
                                name="bp"
                                placeholder="e.g. 120/80"
                                value={formData.vitals.bp}
                                onChange={handleVitalsChange}
                            />
                        </label>
                        <label>
                            Heart Rate
                            <input
                                type="text"
                                name="hr"
                                placeholder="e.g. 72 bpm"
                                value={formData.vitals.hr}
                                onChange={handleVitalsChange}
                            />
                        </label>
                        <label>
                            Temperature
                            <input
                                type="text"
                                name="temp"
                                placeholder="e.g. 37 C"
                                value={formData.vitals.temp}
                                onChange={handleVitalsChange}
                            />
                        </label>
                    </div>
                </div>

                <div className="form-section">
                    <label>
                        Doctor Examination
                        <textarea
                            name="doctorExamination"
                            placeholder="Clinical examination notes"
                            value={formData.doctorExamination}
                            onChange={handleChange}
                            rows="6"
                        />
                    </label>
                </div>

                <div className="form-section">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <label style={{ flex: 1 }}>
                            Final Decision
                            <input
                                type="text"
                                name="finalDecision"
                                placeholder="Enter final decision"
                                value={formData.finalDecision || ""}
                                onChange={handleChange}
                                style={{ width: '100%' }}
                            />
                        </label>
                        <span style={{ fontSize: '1.5rem', marginTop: '1.5rem' }}>💡</span>
                    </div>
                </div>

                <div className="form-section">
                    <label>
                        Attachments (Optional)
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*,.pdf,.doc,.docx"
                        />
                        {formData.attachments.length > 0 && (
                            <div className="attachments-list">
                                {formData.attachments.map((file, index) => (
                                    <div key={index} className="attachment-item">
                                        <span>{file.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => removeAttachment(index)}
                                            className="remove-attachment"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </label>
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                    <button
                        type="button"
                        className="btn-cancel"
                        onClick={() => navigate("/checkup")}
                    >
                        Cancel
                    </button>
                    <button type="submit" className="btn-save">
                        Save Check-Up
                    </button>
                    <button
                        type="button"
                        className="btn-save"
                        onClick={(e) => {
                            e.preventDefault();
                            const checkup = {
                                ...formData,
                                id: `CU-${Date.now()}`,
                                date: new Date().toISOString().split('T')[0],
                                status: "Completed",
                            };
                            const checkups = JSON.parse(localStorage.getItem("checkups") || "[]");
                            checkups.push(checkup);
                            localStorage.setItem("checkups", JSON.stringify(checkups));
                            navigate(`/prescriptions/new?patientId=${formData.patientId}`);
                        }}
                        disabled={!formData.patientId}
                    >
                        Save & Add New Prescription
                    </button>
                </div>
            </form>

            {showToast && (
                <div className="toast success">
                    ✅ Check-Up saved successfully!
                </div>
            )}
        </div>
    );
}
