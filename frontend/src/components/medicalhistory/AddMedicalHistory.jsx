import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

export default function AddMedicalHistory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState(new Set());
  const [categoryData, setCategoryData] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    // Load draft from localStorage if exists
    const draft = localStorage.getItem(`medicalHistoryDraft_${id}`);
    if (draft) {
      const parsed = JSON.parse(draft);
      setSelectedCategories(new Set(parsed.selectedCategories));
      setCategoryData(parsed.categoryData || {});
      // Attachments are hard to persist in local storage draft without converting to base64, skipping for draft
    }
  }, [id]);

  const toggleCategory = (categoryId) => {
    const newSelected = new Set(selectedCategories);
    if (newSelected.has(categoryId)) {
      newSelected.delete(categoryId);
      const newData = { ...categoryData };
      delete newData[categoryId];
      setCategoryData(newData);
    } else {
      newSelected.add(categoryId);
      setCategoryData({
        ...categoryData,
        [categoryId]: [],
      });
    }
    setSelectedCategories(newSelected);
    saveDraft(newSelected, categoryData);
  };

  const saveDraft = (selected, data) => {
    localStorage.setItem(
      `medicalHistoryDraft_${id}`,
      JSON.stringify({
        selectedCategories: Array.from(selected),
        categoryData: data,
      })
    );
  };

  const addEntry = (categoryId) => {
    const category = CATEGORIES.find((c) => c.id === categoryId);
    const baseEntry = getBaseEntryForCategory(categoryId);

    setCategoryData({
      ...categoryData,
      [categoryId]: [...(categoryData[categoryId] || []), baseEntry],
    });
  };

  const getBaseEntryForCategory = (categoryId) => {
    const entry = { id: Date.now(), visibleToPatient: false };
    switch (categoryId) {
      case "allergies":
        return { ...entry, name: "", reaction: "", severity: "" };
      case "surgeries":
        return { ...entry, name: "", year: "", notes: "" };
      case "chronic":
        return { ...entry, name: "", diagnosisYear: "", status: "" };
      case "family":
        return { ...entry, relation: "", condition: "" };
      case "medications":
        return { ...entry, name: "", dose: "", frequency: "" };
      case "immunizations":
        return { ...entry, name: "", date: "" };
      case "lifestyle":
        return { ...entry, type: "", details: "", status: "" };
      case "social":
        return { ...entry, occupation: "", livingSituation: "" };
      case "genetic":
        return { ...entry, condition: "", notes: "" };
      default:
        return { ...entry, text: "" };
    }
  };

  const updateEntry = (categoryId, entryId, field, value) => {
    setCategoryData({
      ...categoryData,
      [categoryId]: categoryData[categoryId].map((entry) =>
        entry.id === entryId ? { ...entry, [field]: value } : entry
      ),
    });
  };

  const removeEntry = (categoryId, entryId) => {
    setCategoryData({
      ...categoryData,
      [categoryId]: categoryData[categoryId].filter((entry) => entry.id !== entryId),
    });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setAttachments((prev) => [...prev, ...files]);
  };

  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    const medicalHistory = {
      patientId: id,
      categories: categoryData,
      attachments: attachments.map(f => f.name), // Mock saving file names
      createdAt: new Date().toISOString(),
    };

    // Save to localStorage
    const histories = JSON.parse(localStorage.getItem("medicalHistories") || "[]");
    const existingIndex = histories.findIndex((h) => h.patientId === id);
    if (existingIndex >= 0) {
      // Merge new data with existing
      const existing = histories[existingIndex];
      const mergedCategories = { ...existing.categories };

      Object.keys(categoryData).forEach(catId => {
        if (mergedCategories[catId]) {
          mergedCategories[catId] = [...mergedCategories[catId], ...categoryData[catId]];
        } else {
          mergedCategories[catId] = categoryData[catId];
        }
      });

      histories[existingIndex] = {
        ...existing,
        categories: mergedCategories,
        attachments: [...(existing.attachments || []), ...medicalHistory.attachments]
      };
    } else {
      histories.push(medicalHistory);
    }
    localStorage.setItem("medicalHistories", JSON.stringify(histories));

    // Clear draft
    localStorage.removeItem(`medicalHistoryDraft_${id}`);

    setShowToast(true);
    setTimeout(() => {
      navigate(`/patients/${id}/medical-history`);
    }, 2000);
  };

  const renderCategoryInput = (categoryId) => {
    const entries = categoryData[categoryId] || [];
    const category = CATEGORIES.find((c) => c.id === categoryId);

    return (
      <div key={categoryId} className="category-section">
        <div className="category-header">
          <h3>
            {category.icon} {category.name}
          </h3>
          <button
            type="button"
            className="btn-add-entry"
            onClick={() => addEntry(categoryId)}
          >
            ➕ Add Entry
          </button>
        </div>

        {entries.map((entry) => (
          <div key={entry.id} className="entry-row">
            {categoryId === "allergies" && (
              <>
                <input
                  placeholder="Allergy name"
                  value={entry.name || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Reaction"
                  value={entry.reaction || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "reaction", e.target.value)
                  }
                />
                <select
                  value={entry.severity || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "severity", e.target.value)
                  }
                >
                  <option value="">Severity</option>
                  <option value="Mild">Mild</option>
                  <option value="Moderate">Moderate</option>
                  <option value="Severe">Severe</option>
                </select>
              </>
            )}

            {categoryId === "surgeries" && (
              <>
                <input
                  placeholder="Surgery name"
                  value={entry.name || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Year"
                  value={entry.year || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "year", e.target.value)
                  }
                />
                <textarea
                  placeholder="Notes"
                  value={entry.notes || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "notes", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "chronic" && (
              <>
                <input
                  placeholder="Disease name"
                  value={entry.name || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "name", e.target.value)
                  }
                />
                <input
                  type="number"
                  placeholder="Diagnosis year"
                  value={entry.diagnosisYear || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "diagnosisYear", e.target.value)
                  }
                />
                <input
                  placeholder="Current status"
                  value={entry.status || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "status", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "family" && (
              <>
                <input
                  placeholder="Relation"
                  value={entry.relation || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "relation", e.target.value)
                  }
                />
                <input
                  placeholder="Condition"
                  value={entry.condition || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "condition", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "medications" && (
              <>
                <input
                  placeholder="Medication name"
                  value={entry.name || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "name", e.target.value)
                  }
                />
                <input
                  placeholder="Dose"
                  value={entry.dose || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "dose", e.target.value)
                  }
                />
                <input
                  placeholder="Frequency"
                  value={entry.frequency || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "frequency", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "immunizations" && (
              <>
                <input
                  placeholder="Vaccine name"
                  value={entry.name || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "name", e.target.value)
                  }
                />
                <input
                  type="date"
                  placeholder="Date"
                  value={entry.date || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "date", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "lifestyle" && (
              <>
                <select
                  value={entry.type || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "type", e.target.value)
                  }
                >
                  <option value="">Type</option>
                  <option value="Smoking">Smoking</option>
                  <option value="Alcohol">Alcohol</option>
                  <option value="Exercise">Exercise</option>
                </select>
                <input
                  placeholder="Details"
                  value={entry.details || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "details", e.target.value)
                  }
                />
                <input
                  placeholder="Status"
                  value={entry.status || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "status", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "social" && (
              <>
                <input
                  placeholder="Occupation"
                  value={entry.occupation || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "occupation", e.target.value)
                  }
                />
                <input
                  placeholder="Living situation"
                  value={entry.livingSituation || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "livingSituation", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "genetic" && (
              <>
                <input
                  placeholder="Condition"
                  value={entry.condition || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "condition", e.target.value)
                  }
                />
                <textarea
                  placeholder="Notes"
                  value={entry.notes || ""}
                  onChange={(e) =>
                    updateEntry(categoryId, entry.id, "notes", e.target.value)
                  }
                />
              </>
            )}

            {categoryId === "others" && (
              <textarea
                placeholder="Free text entry"
                value={entry.text || ""}
                onChange={(e) =>
                  updateEntry(categoryId, entry.id, "text", e.target.value)
                }
              />
            )}

            <label className="visibility-toggle">
              <input
                type="checkbox"
                checked={entry.visibleToPatient || false}
                onChange={(e) =>
                  updateEntry(categoryId, entry.id, "visibleToPatient", e.target.checked)
                }
              />
              Show to patient
            </label>

            <button
              type="button"
              className="btn-remove-entry"
              onClick={() => removeEntry(categoryId, entry.id)}
            >
              🗑️
            </button>
          </div>
        ))
        }
      </div >
    );
  };

  return (
    <div className="medical-history-page">
      <h1>Add Medical History</h1>
      <p>Patient ID: {id}</p>

      <div className="categories-grid">
        {CATEGORIES.map((category) => (
          <button
            key={category.id}
            type="button"
            className={`category-chip ${selectedCategories.has(category.id) ? "selected" : ""}`}
            onClick={() => toggleCategory(category.id)}
          >
            {category.icon} {category.name}
          </button>
        ))}
      </div>

      <div className="selected-categories">
        {Array.from(selectedCategories).map((categoryId) =>
          renderCategoryInput(categoryId)
        )}
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
          {attachments.length > 0 && (
            <div className="attachments-list">
              {attachments.map((file, index) => (
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

      <div className="form-actions">
        <button
          type="button"
          className="btn-cancel"
          onClick={() => navigate(`/patients/${id}/medical-history`)}
        >
          Cancel
        </button>
        <button type="button" className="btn-save" onClick={handleSave}>
          Save Medical History
        </button>
      </div>

      {showToast && (
        <div className="toast success">
          ✅ Medical history saved successfully!
        </div>
      )}
    </div>
  );
}

