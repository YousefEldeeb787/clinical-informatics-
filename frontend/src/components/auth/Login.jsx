import "./Login-new.css";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { API_BASE_URL } from "../../config";

const ROLES = [
  { id: "Clinician", name: "Doctor", icon: "🩺", color: "#e53935" },
  { id: "Receptionist", name: "Receptionist", icon: "👔", color: "#2196F3" },
  { id: "Patient", name: "Patient", icon: "🙂", color: "#4CAF50" },
];

export default function Login() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
    setError("");
    setEmail("");
    setPassword("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!selectedRole) {
      setError("Please select a role first");
      setLoading(false);
      return;
    }

    if (!email || !password) {
      setError("Please enter both email and password");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({ message: "Server error" }));
        setError(data.message || "Invalid email or password");
        setLoading(false);
        return;
      }

      const data = await response.json();

      if (data.token) {
        // Verify role matches what user selected
        if (data.role !== selectedRole) {
          setError(`This account is registered as ${data.role}, not ${selectedRole}`);
          setLoading(false);
          return;
        }

        // Store authentication data
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("auth", "true");
        
        // Redirect based on role
        redirectByRole(data.role);
      } else {
        setError("Invalid response from server");
        setLoading(false);
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Cannot connect to server. Make sure the backend is running on http://localhost:5000");
      setLoading(false);
    }
  };

  const redirectByRole = (role) => {
    setLoading(false);
    switch (role) {
      case "Clinician":
        navigate("/dashboard");
        break;
      case "Receptionist":
        navigate("/reception-dashboard");
        break;
      case "Patient":
        navigate("/patient/dashboard");
        break;
      default:
        navigate("/dashboard");
    }
  };

  return (
    <div className="login-page">
      <h1 className="brand">CLINI-SYS</h1>

      {!selectedRole ? (
        <div className="role-selection">
          <h2>Select Your Role</h2>
          <p className="subtitle">Choose how you want to access the system</p>
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
                <h3>{role.name} Login</h3>
                <p>Access as {role.name.toLowerCase()}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <form className="login-card" onSubmit={handleLogin}>
          <div className="role-header">
            <button
              type="button"
              className="back-btn"
              onClick={() => {
                setSelectedRole(null);
                setError("");
              }}
            >
              ← Back
            </button>
            <div className="selected-role-badge">
              {ROLES.find((r) => r.id === selectedRole)?.icon}{" "}
              {ROLES.find((r) => r.id === selectedRole)?.name}
            </div>
          </div>

          <h2>Secure Login</h2>
          <p className="subtitle">Enter your credentials to access the system</p>

          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="icon">🔒</span>
            </div>
            <Link to="#" className="forgot-password">
              Forgot Password?
            </Link>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "LOGIN"}
          </button>

          <p className="register-text">
            Don't have an account?{" "}
            <Link to="/register">Register Now</Link>
          </p>
        </form>
      )}

      <footer>© 2024 CLINI-SYS. All rights reserved.</footer>
    </div>
  );
}
