import "./addDoctor.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AddDoctorForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    gender: "",
    dob: "",
    phone: "",
    email: "",
    address: "",
    specialty: "",
    department: "",
    qualifications: "",
    experience: "",
    status: "Active",
    workingDays: [],
    startTime: "",
    endTime: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (day) => {
    setFormData((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Doctor Saved:", formData);
    alert("✅ Doctor information saved!");
    navigate("/doctors");
  };

  return (
    <div className="add-doctor-page">
      <header className="topbar">
        <div className="brand" onClick={() => navigate("/")}>
          <span className="dot" /> Clinical Management System
        </div>
        <div className="user-icon">👨‍⚕️</div>
      </header>

      <div className="form-container">
        <h1>Doctor Information</h1>
        <p className="subtitle">
          Add a new doctor or edit an existing doctor’s details.
        </p>

        <form onSubmit={handleSubmit} className="doctor-form">
          <div className="form-grid">
            <div className="form-group full">
              <label>Full Name *</label>
              <input
                type="text"
                name="fullName"
                placeholder="e.g. Dr. Johnathan Smith"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="Male">👨 Male</option>
                <option value="Female">👩 Female</option>
              </select>
            </div>

            <div className="form-group">
              <label>Date of Birth *</label>
              <input type="date" name="dob" onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="tel"
                name="phone"
                placeholder="+1 (555) 123-4567"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                placeholder="e.g. j.smith@clinic.com"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full">
              <label>Address *</label>
              <textarea
                name="address"
                rows="2"
                placeholder="123 Health Ave, Medicity, MC 12345"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Specialty *</label>
              <input
                type="text"
                name="specialty"
                placeholder="e.g. Cardiology"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Department *</label>
              <input
                type="text"
                name="department"
                placeholder="e.g. Cardiovascular Center"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full">
              <label>Qualifications *</label>
              <textarea
                name="qualifications"
                rows="2"
                placeholder="MD, Stanford University, Fellowship in Cardiology, Johns Hopkins"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Experience (Years) *</label>
              <input
                type="number"
                name="experience"
                placeholder="e.g. 12"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Status *</label>
              <select name="status" onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="working-days">
            <label>Working Days</label>
            <div className="days">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <label key={day}>
                  <input
                    type="checkbox"
                    checked={formData.workingDays.includes(day)}
                    onChange={() => handleCheckbox(day)}
                  />{" "}
                  {day}
                </label>
              ))}
            </div>
          </div>

          <div className="time-fields">
            <div>
              <label>Available Start Time</label>
              <input type="time" name="startTime" onChange={handleChange} />
            </div>
            <div>
              <label>Available End Time</label>
              <input type="time" name="endTime" onChange={handleChange} />
            </div>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={() => navigate("/doctors")}
            >
              Cancel / Back to List
            </button>
            <button type="submit" className="btn-save">
              Save Doctor
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
