import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./medicalHistory.css";

const CATEGORIES = [
  { id: "allergies", icon: "⚠️", name: "Allergies" },
  { id: "surgeries", icon: "🏥", name: "Past Surgeries" },
  { id: "chronic", icon: "🫀", name: "Chronic Diseases" },
  { id: "family", icon: "👨‍👩‍👧‍👦", name: "Family History" },
  { id: "medications", icon: "💊", name: "Current Medications" },
  { id: "immunizations", icon: "💉", name: "Immunizations" },
  { id: "lifestyle", icon: "🚬", name: "Lifestyle / Habits" },
  { id: "social", icon: "🏠", name: "Social History" },
  { id: "genetic", icon: "🧬", name: "Genetic Conditions" },
  { id: "others", icon: "📝", name: "Others" },
];

export default function MedicalHistoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [medicalHistory, setMedicalHistory] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [expandedCategories, setExpandedCategories] = useState(new Set());

  // Edit Modal State
  const [editingEntry, setEditingEntry] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState(null);

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = () => {
    // Load medical history from localStorage
    const histories = JSON.parse(localStorage.getItem("medicalHistories") || "[]");
    const history = histories.find((h) => h.patientId === id);
    setMedicalHistory(history);

    // Load patient name (mock)
    const patients = JSON.parse(localStorage.getItem("patients") || "[]");
    const patient = patients.find(p => p.patientId === id || p.id === id);
    if (patient) {
      setPatientName(`${patient.firstName || ""} ${patient.lastName || patient.name || ""}`.trim());
    } else {
      const mockPatients = {
        "P001": "John Doe",
        "P002": "Jane Smith",
        "P003": "Sam Wilson",
        "P004": "Emily Jones",
        "P005": "Chris Lee"
      };
      setPatientName(mockPatients[id] || "Patient");
    }
  };

  const toggleCategory = (categoryId) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const getEntryCount = (categoryId) => {
    if (!medicalHistory || !medicalHistory.categories) return 0;
    return medicalHistory.categories[categoryId]?.length || 0;
  };

  const handleEditClick = (entry, categoryId) => {
    setEditingEntry({ ...entry });
    setEditCategoryId(categoryId);
  };

  const handleEditSave = () => {
    if (!medicalHistory || !editCategoryId || !editingEntry) return;

    const updatedCategories = { ...medicalHistory.categories };
    updatedCategories[editCategoryId] = updatedCategories[editCategoryId].map(e =>
      e.id === editingEntry.id ? editingEntry : e
    );

    const updatedHistory = { ...medicalHistory, categories: updatedCategories };

    // Save to localStorage
    const histories = JSON.parse(localStorage.getItem("medicalHistories") || "[]");
    const index = histories.findIndex(h => h.patientId === id);
    if (index !== -1) {
      histories[index] = updatedHistory;
      localStorage.setItem("medicalHistories", JSON.stringify(histories));
      setMedicalHistory(updatedHistory);
    }

    setEditingEntry(null);
    setEditCategoryId(null);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditingEntry(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const renderEntry = (entry, categoryId) => {
    return (
      <div key={entry.id} className="entry-item">
        {categoryId === "allergies" && (
          <div>
            <strong>{entry.name}</strong> - {entry.reaction} ({entry.severity})
          </div>
        )}
        {categoryId === "surgeries" && (
          <div>
            <strong>{entry.name}</strong> ({entry.year}) - {entry.notes}
          </div>
        )}
        {categoryId === "chronic" && (
          <div>
            <strong>{entry.name}</strong> (Diagnosed: {entry.diagnosisYear}) - Status: {entry.status}
          </div>
        )}
        {categoryId === "family" && (
          <div>
            <strong>{entry.relation}</strong> - {entry.condition}
          </div>
        )}
        {categoryId === "medications" && (
          <div>
            <strong>{entry.name}</strong> - {entry.dose}, {entry.frequency}
          </div>
        )}
        {categoryId === "immunizations" && (
          <div>
            <strong>{entry.name}</strong> - {entry.date}
          </div>
        )}
        {categoryId === "lifestyle" && (
          <div>
            <strong>{entry.type}</strong> - {entry.details} ({entry.status})
          </div>
        )}
        {categoryId === "social" && (
          <div>
            <strong>Occupation:</strong> {entry.occupation} | <strong>Living:</strong> {entry.livingSituation}
          </div>
        )}
        {categoryId === "genetic" && (
          <div>
            <strong>{entry.condition}</strong> - {entry.notes}
          </div>
        )}
        {categoryId === "others" && <div>{entry.text}</div>}

        <div className="entry-actions">
          <span className={`visibility-badge ${entry.visibleToPatient ? "visible" : "hidden"}`}>
            {entry.visibleToPatient ? "👁️ Visible to Patient" : "🔒 Private"}
          </span>
          <button
            className="btn-edit-entry"
            onClick={() => handleEditClick(entry, categoryId)}
          >
            Edit
          </button>
        </div>
      </div>
    );
  };

  if (!medicalHistory) {
    return (
      <div className="medical-history-page">
        <h1>{patientName}</h1>
        <p>No medical history found for this patient.</p>
        <button
          className="btn-primary"
          onClick={() => navigate(`/patients/${id}/medical-history/new`)}
        >
          Add Medical History
        </button>
      </div>
    );
  }

  return (
    <div className="medical-history-page">
      <div className="page-header">
        <h1>{patientName}</h1>
        <button
          className="btn-primary"
          onClick={() => navigate(`/patients/${id}/medical-history/new`)}
        >
          ➕ Add New Entry
        </button>
      </div>

      <div className="categories-list">
        {CATEGORIES.map((category) => {
          const count = getEntryCount(category.id);
          const isExpanded = expandedCategories.has(category.id);
          const entries = medicalHistory.categories[category.id] || [];

          return (
            <div key={category.id} className="category-card">
              <div
                className="category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div>
                  <span className="category-icon">{category.icon}</span>
                  <span className="category-name">{category.name}</span>
                  <span className="category-badge">({count})</span>
                </div>
                <span className="expand-icon">{isExpanded ? "▼" : "▶"}</span>
              </div>

              {isExpanded && entries.length > 0 && (
                <div className="category-content">
                  {entries.map((entry) => renderEntry(entry, category.id))}
                </div>
              )}

              {isExpanded && entries.length === 0 && (
                <div className="category-content empty">
                  No entries in this category.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingEntry && (
        <div className="modal-overlay" onClick={() => setEditingEntry(null)}>
          <div className="doctor-info-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Edit Entry</h2>
              <button className="close-btn" onClick={() => setEditingEntry(null)}>×</button>
            </div>
            <div className="modal-content">
              {editCategoryId === "allergies" && (
                <>
                  <label>Name <input name="name" value={editingEntry.name} onChange={handleEditChange} /></label>
                  <label>Reaction <input name="reaction" value={editingEntry.reaction} onChange={handleEditChange} /></label>
                  <label>Severity
                    <select name="severity" value={editingEntry.severity} onChange={handleEditChange}>
                      <option value="Mild">Mild</option>
                      <option value="Moderate">Moderate</option>
                      <option value="Severe">Severe</option>
                    </select>
                  </label>
                </>
              )}
              {editCategoryId === "surgeries" && (
                <>
                  <label>Name <input name="name" value={editingEntry.name} onChange={handleEditChange} /></label>
                  <label>Year <input name="year" value={editingEntry.year} onChange={handleEditChange} /></label>
                  <label>Notes <textarea name="notes" value={editingEntry.notes} onChange={handleEditChange} /></label>
                </>
              )}
              {editCategoryId === "chronic" && (
                <>
                  <label>Name <input name="name" value={editingEntry.name} onChange={handleEditChange} /></label>
                  <label>Diagnosis Year <input name="diagnosisYear" value={editingEntry.diagnosisYear} onChange={handleEditChange} /></label>
                  <label>Status <input name="status" value={editingEntry.status} onChange={handleEditChange} /></label>
                </>
              )}
              {/* Add other categories as needed, fallback for generic text */}
              {editCategoryId === "others" && (
                <label>Text <textarea name="text" value={editingEntry.text} onChange={handleEditChange} /></label>
              )}

              <label className="checkbox-label" style={{ marginTop: '10px' }}>
                <input type="checkbox" name="visibleToPatient" checked={editingEntry.visibleToPatient} onChange={handleEditChange} />
                Visible to Patient
              </label>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={() => setEditingEntry(null)}>Cancel</button>
              <button className="btn-save" onClick={handleEditSave}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

