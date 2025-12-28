import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Register.css";
import { API_BASE_URL } from "../../config";

const ROLES = [
  { id: "Clinician", name: "Doctor", icon: "🩺", color: "#e53935" },
  { id: "Receptionist", name: "Receptionist", icon: "👔", color: "#2196F3" },
  { id: "Patient", name: "Patient", icon: "🙂", color: "#4CAF50" },
];

export default function Register() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState(null);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setForm({ ...form, role: roleId });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      alert("❌ Please select a role first");
      return;
    }

    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      alert("❌ Please fill in all required fields");
      return;
    }

    try {
      // Call backend API based on role
      const endpoint = selectedRole === "Patient" 
        ? `${API_BASE_URL}/auth/register`
        : `${API_BASE_URL}/auth/register-staff`;

      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        phone: form.phone || "",
        ...(selectedRole !== "Patient" && { role: selectedRole })
      };

      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (response.ok) {
        alert("✅ Registration successful! Please login.");
        navigate("/login");
        return;
      } else {
        alert(`❌ Registration failed: ${data.message || "Unknown error"}`);
        return;
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Cannot connect to server. Make sure the backend is running on http://localhost:5000");
    }
  };

  return (
    <div className="register-container">
      <div className="register-card">
        <h2>Create Your Account</h2>
        <p className="subtitle">Join the future of clinical management.</p>

        {!selectedRole ? (
          <div className="role-selection">
            <h3>Select Your Role</h3>
            <div className="role-cards">
              {ROLES.map((role) => (
                <div
                  key={role.id}
                  className="role-card"
                  onClick={() => handleRoleSelect(role.id)}
                  style={{ borderColor: role.color }}
                >
                  <div className="role-icon" style={{ color: role.color }}>
                    {role.icon}
                  </div>
                  <h4>{role.name}</h4>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div className="role-header">
              <button
                type="button"
                className="back-btn"
                onClick={() => {
                  setSelectedRole(null);
                  setForm({ ...form, role: "" });
                }}
              >
                ← Back
              </button>
              <div className="selected-role-badge">
                {ROLES.find((r) => r.id === selectedRole)?.icon}{" "}
                {ROLES.find((r) => r.id === selectedRole)?.name}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            placeholder="Enter your first name"
            value={form.firstName}
            onChange={handleChange}
            required
          />

          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={form.lastName}
            onChange={handleChange}
            required
          />

          <label>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your professional email"
            value={form.email}
            onChange={handleChange}
            required
          />

          <label>Phone (Optional)</label>
          <input
            type="tel"
            name="phone"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={handleChange}
          />

          <label>Password</label>
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowPassword(!showPassword)} className="eye">
              {showPassword ? "👁‍🗨" : "👁"}
            </span>
          </div>

          <label>Confirm Password</label>
          <div className="password-wrapper">
            <input
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={handleChange}
              required
            />
            <span onClick={() => setShowConfirm(!showConfirm)} className="eye">
              {showConfirm ? "👁‍🗨" : "👁"}
            </span>
          </div>

              <button className="btn-register" type="submit">
                Register
              </button>
            </form>
          </>
        )}

        <p className="switch-auth">
          Already have an account? <Link to="/login">Log In</Link>
        </p>
      </div>
    </div>
  );
}
