import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PERMISSIONS } from "../../utils/permissions";
import RoleRestricted from "../common/RoleRestricted";
import "./EncounterDetails.css";

export default function EncounterDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [encounter, setEncounter] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEncounterDetails();
  }, [id]);

  const fetchEncounterDetails = async () => {
    setLoading(true);
    try {
      // TODO: Replace with actual API call
      const mockData = {
        id: id,
        patientName: "John Doe",
        patientId: "P001",
        dateTime: "2024-12-28T10:30:00",
        chiefComplaint: "Severe headache for 3 days",
        presentIllness: "Patient reports persistent headache starting 3 days ago. Pain is throbbing in nature, located in frontal region. Associated with photophobia and mild nausea. No fever, vision changes, or neurological symptoms.",
        vitalSigns: {
          bloodPressure: "128/82 mmHg",
          heartRate: "76 bpm",
          temperature: "98.4°F (36.9°C)",
          respiratoryRate: "16 breaths/min",
          oxygenSaturation: "98%",
          weight: "165 lbs (75 kg)",
          height: "5'10\" (178 cm)",
        },
        physicalExam: "HEENT: No sinus tenderness. Pupils equal and reactive. Neck: Supple, no meningismus. Neurological: Alert and oriented x3. Cranial nerves II-XII intact. No focal deficits.",
        diagnosis: "Tension-type headache",
        treatment: "Prescribed ibuprofen 400mg TID PRN for pain. Advised rest, hydration, and stress management techniques.",
        notes: "Follow up in 1 week if symptoms persist. Return immediately if severe symptoms develop.",
        status: "Completed",
        duration: 30,
        signedBy: null,
        signedDate: null,
      };
      setEncounter(mockData);
    } catch (error) {
      console.error("Error fetching encounter details:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Loading encounter details...</div>;
  }

  if (!encounter) {
    return (
      <div className="error-state">
        <h3>Encounter not found</h3>
        <button onClick={() => navigate("/encounters")} className="btn-primary">
          Back to Encounters
        </button>
      </div>
    );
  }

  return (
    <div className="encounter-details-container">
      <div className="details-header">
        <div>
          <h1>📋 Encounter Details</h1>
          <p className="patient-name">{encounter.patientName} ({encounter.patientId})</p>
        </div>
        <div className="header-actions">
          {encounter.status !== "Signed" && (
            <RoleRestricted permission={PERMISSIONS.UPDATE_ENCOUNTER}>
              <button
                className="btn-secondary"
                onClick={() => navigate(`/encounters/${id}/edit`)}
              >
                ✏️ Edit
              </button>
            </RoleRestricted>
          )}
          {encounter.status === "Completed" && !encounter.signedBy && (
            <RoleRestricted permission={PERMISSIONS.SIGN_ENCOUNTER}>
              <button
                className="btn-primary"
                onClick={() => navigate(`/encounters/${id}/sign`)}
              >
                ✍️ Sign Encounter
              </button>
            </RoleRestricted>
          )}
          <button className="btn-back" onClick={() => navigate("/encounters")}>
            ← Back
          </button>
        </div>
      </div>

      <div className="details-grid">
        {/* Basic Information */}
        <div className="detail-card">
          <h3>📅 Basic Information</h3>
          <div className="detail-row">
            <span className="detail-label">Date & Time:</span>
            <span className="detail-value">
              {new Date(encounter.dateTime).toLocaleString()}
            </span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{encounter.duration} minutes</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Status:</span>
            <span className={`status-badge status-${encounter.status.toLowerCase()}`}>
              {encounter.status}
            </span>
          </div>
          {encounter.signedBy && (
            <>
              <div className="detail-row">
                <span className="detail-label">Signed By:</span>
                <span className="detail-value">{encounter.signedBy}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Signed Date:</span>
                <span className="detail-value">
                  {new Date(encounter.signedDate).toLocaleString()}
                </span>
              </div>
            </>
          )}
        </div>

        {/* Chief Complaint */}
        <div className="detail-card full-width">
          <h3>🩺 Chief Complaint</h3>
          <p className="detail-content">{encounter.chiefComplaint}</p>
        </div>

        {/* History of Present Illness */}
        <div className="detail-card full-width">
          <h3>📝 History of Present Illness</h3>
          <p className="detail-content">{encounter.presentIllness}</p>
        </div>

        {/* Vital Signs */}
        <div className="detail-card">
          <h3>💉 Vital Signs</h3>
          {Object.entries(encounter.vitalSigns).map(([key, value]) => (
            <div key={key} className="detail-row">
              <span className="detail-label">
                {key.replace(/([A-Z])/g, ' $1').trim()}:
              </span>
              <span className="detail-value">{value}</span>
            </div>
          ))}
        </div>

        {/* Physical Examination */}
        <div className="detail-card full-width">
          <h3>🔍 Physical Examination</h3>
          <p className="detail-content">{encounter.physicalExam}</p>
        </div>

        {/* Diagnosis */}
        <div className="detail-card">
          <h3>🎯 Diagnosis</h3>
          <p className="detail-content diagnosis">{encounter.diagnosis}</p>
        </div>

        {/* Treatment */}
        <div className="detail-card full-width">
          <h3>💊 Treatment Plan</h3>
          <p className="detail-content">{encounter.treatment}</p>
        </div>

        {/* Additional Notes */}
        {encounter.notes && (
          <div className="detail-card full-width">
            <h3>📌 Additional Notes</h3>
            <p className="detail-content">{encounter.notes}</p>
          </div>
        )}
      </div>
    </div>
  );
}
