import "./Logout.css";
import { useNavigate } from "react-router-dom";

export default function LogoutConfirm() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("auth"); // إلغاء تسجيل الدخول
    navigate("/login"); // الرجوع لصفحة تسجيل الدخول
  };

  const handleCancel = () => {
    navigate(-1); // رجوع للصفحة السابقة فقط
  };

  return (
    <div className="logout-overlay">
      <div className="logout-modal">
        <div className="logout-icon">➡️</div>

        <h2>Confirm Logout</h2>
        <p>Are you sure you want to end your session? All unsaved changes will be lost.</p>

        <button className="logout-btn" onClick={handleLogout}>
          Confirm Logout
        </button>

        <button className="cancel-btn" onClick={handleCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
