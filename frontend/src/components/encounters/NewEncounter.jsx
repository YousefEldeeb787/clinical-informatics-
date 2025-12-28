import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import DocumentUpload from "../ai-assistant/DocumentUpload";
import CDSSPanel from "../ai-assistant/CDSSPanel";
import AISummaryDashboard from "../ai-assistant/AISummaryDashboard";
import "./NewEncounter.css";

export default function NewEncounter() {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { ocrText, entities, recommendations } = useSelector((state) => state.aiAssistant);
  
  const [formData, setFormData] = useState({
    patientId: "",
    dateTime: new Date().toISOString().slice(0, 16),
    chiefComplaint: "",
    presentIllness: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    respiratoryRate: "",
    oxygenSaturation: "",
    weight: "",
    height: "",
    physicalExam: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [activeTab, setActiveTab] = useState('form'); // 'form', 'ai-upload', 'ai-summary'

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAIAnalysisComplete = (result) => {
    // Auto-fill fields based on AI analysis
    if (result.ocrText) {
      console.log("AI Analysis completed:", result);
    }

    if (result.recommendations && result.recommendations.length > 0) {
      setShowAIPanel(true);
      setActiveTab('ai-summary');
    }
  };

  const applyAIRecommendations = () => {
    // Apply AI recommendations to form fields
    if (recommendations && recommendations.length > 0) {
      const diagnosisRecs = recommendations.filter(r => r.recommendationType === 'Diagnosis');
      const treatmentRecs = recommendations.filter(r => r.recommendationType === 'Treatment');

      if (diagnosisRecs.length > 0) {
        setFormData(prev => ({
          ...prev,
          diagnosis: diagnosisRecs.map(r => r.recommendationText).join('; ')
        }));
      }

      if (treatmentRecs.length > 0) {
        setFormData(prev => ({
          ...prev,
          treatment: treatmentRecs.map(r => r.recommendationText).join('\n')
        }));
      }

      alert('AI recommendations applied to form!');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // TODO: Replace with actual API call
      console.log("Creating new encounter:", formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert("Encounter created successfully!");
      navigate("/encounters");
    } catch (error) {
      console.error("Error creating encounter:", error);
      alert("Failed to create encounter. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isClinicianOrAdmin = user?.role === 'Clinician' || user?.role === 'Admin';

  return (
    <div className="new-encounter-container">
      <div className="form-header">
        <div>
          <h1>📋 New Encounter</h1>
          <p>Document a new patient visit {isClinicianOrAdmin && 'with AI assistance'}</p>
        </div>
        <div className="header-actions">
          {isClinicianOrAdmin && (
            <button 
              className="btn-ai-toggle" 
              onClick={() => setShowAIPanel(!showAIPanel)}
              title="Toggle AI Assistant"
            >
              🤖 {showAIPanel ? 'Hide' : 'Show'} AI Assistant
            </button>
          )}
          <button className="btn-back" onClick={() => navigate("/encounters")}>
            ← Back
          </button>
        </div>
      </div>

      {/* AI Panel Tabs (for Clinician/Admin only) */}
      {isClinicianOrAdmin && showAIPanel && (
        <div className="ai-tabs">
          <button
            className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
            onClick={() => setActiveTab('form')}
          >
            📝 Encounter Form
          </button>
          <button
            className={`tab-button ${activeTab === 'ai-upload' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-upload')}
          >
            📤 AI Document Upload
          </button>
          <button
            className={`tab-button ${activeTab === 'ai-summary' ? 'active' : ''}`}
            onClick={() => setActiveTab('ai-summary')}
          >
            🤖 AI Analysis & CDSS
          </button>
        </div>
      )}

      {/* Content Area */}
      <div className="encounter-content">
        {/* Regular Encounter Form */}
        {activeTab === 'form' && (
          <form onSubmit={handleSubmit} className="encounter-form">
            {/* Patient Selection */}
            <div className="form-section">
              <h3>👤 Patient Information</h3>
              <div className="form-group">
                <label htmlFor="patientId">Patient *</label>
                <select
                  id="patientId"
                  name="patientId"
                  value={formData.patientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Patient</option>
                  <option value="P001">John Doe (P001)</option>
                  <option value="P002">Jane Smith (P002)</option>
                  <option value="P003">Bob Johnson (P003)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="dateTime">Date & Time *</label>
                <input
                  type="datetime-local"
                  id="dateTime"
                  name="dateTime"
                  value={formData.dateTime}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Chief Complaint */}
            <div className="form-section">
              <h3>🩺 Chief Complaint</h3>
              <div className="form-group">
                <label htmlFor="chiefComplaint">Chief Complaint *</label>
                <textarea
                  id="chiefComplaint"
                  name="chiefComplaint"
                  value={formData.chiefComplaint}
                  onChange={handleChange}
                  placeholder="Brief description of patient's main concern"
                  rows="3"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="presentIllness">History of Present Illness *</label>
                <textarea
                  id="presentIllness"
                  name="presentIllness"
                  value={formData.presentIllness}
                  onChange={handleChange}
                  placeholder="Detailed history of the current illness"
                  rows="5"
                  required
                />
              </div>
            </div>

            {/* Vital Signs */}
            <div className="form-section">
              <h3>💉 Vital Signs</h3>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="bloodPressure">Blood Pressure</label>
                  <input
                    type="text"
                    id="bloodPressure"
                    name="bloodPressure"
                    value={formData.bloodPressure}
                    onChange={handleChange}
                    placeholder="e.g., 120/80 mmHg"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="heartRate">Heart Rate</label>
                  <input
                    type="text"
                    id="heartRate"
                    name="heartRate"
                    value={formData.heartRate}
                    onChange={handleChange}
                    placeholder="e.g., 72 bpm"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="temperature">Temperature</label>
                  <input
                    type="text"
                    id="temperature"
                    name="temperature"
                    value={formData.temperature}
                    onChange={handleChange}
                    placeholder="e.g., 98.6°F"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="respiratoryRate">Respiratory Rate</label>
                  <input
                    type="text"
                    id="respiratoryRate"
                    name="respiratoryRate"
                    value={formData.respiratoryRate}
                    onChange={handleChange}
                    placeholder="e.g., 16 breaths/min"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="oxygenSaturation">Oxygen Saturation</label>
                  <input
                    type="text"
                    id="oxygenSaturation"
                    name="oxygenSaturation"
                    value={formData.oxygenSaturation}
                    onChange={handleChange}
                    placeholder="e.g., 98%"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="weight">Weight</label>
                  <input
                    type="text"
                    id="weight"
                    name="weight"
                    value={formData.weight}
                    onChange={handleChange}
                    placeholder="e.g., 165 lbs"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="height">Height</label>
                  <input
                    type="text"
                    id="height"
                    name="height"
                    value={formData.height}
                    onChange={handleChange}
                    placeholder="e.g., 5'10&quot;"
                  />
                </div>
              </div>
            </div>

            {/* Physical Examination */}
            <div className="form-section">
              <h3>🔍 Physical Examination</h3>
              <div className="form-group">
                <label htmlFor="physicalExam">Physical Exam Findings</label>
                <textarea
                  id="physicalExam"
                  name="physicalExam"
                  value={formData.physicalExam}
                  onChange={handleChange}
                  placeholder="Document physical examination findings"
                  rows="5"
                />
              </div>
            </div>

            {/* Assessment & Plan */}
            <div className="form-section">
              <div className="section-header-with-action">
                <h3>🎯 Assessment & Plan</h3>
                {isClinicianOrAdmin && recommendations.length > 0 && (
                  <button
                    type="button"
                    className="btn-apply-ai"
                    onClick={applyAIRecommendations}
                  >
                    🤖 Apply AI Recommendations
                  </button>
                )}
              </div>
              
              <div className="form-group">
                <label htmlFor="diagnosis">Diagnosis *</label>
                <input
                  type="text"
                  id="diagnosis"
                  name="diagnosis"
                  value={formData.diagnosis}
                  onChange={handleChange}
                  placeholder="Primary diagnosis"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="treatment">Treatment Plan *</label>
                <textarea
                  id="treatment"
                  name="treatment"
                  value={formData.treatment}
                  onChange={handleChange}
                  placeholder="Treatment plan and recommendations"
                  rows="4"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="notes">Additional Notes</label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any additional notes or instructions"
                  rows="3"
                />
              </div>
            </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => navigate("/encounters")}
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-submit"
                disabled={loading}
              >
                {loading ? "Creating..." : "Create Encounter"}
              </button>
            </div>
          </form>
        )}

        {/* AI Document Upload Tab */}
        {activeTab === 'ai-upload' && isClinicianOrAdmin && (
          <div className="ai-upload-tab">
            <DocumentUpload 
              patientId={formData.patientId || null} 
              onAnalysisComplete={handleAIAnalysisComplete}
            />
          </div>
        )}

        {/* AI Summary & CDSS Tab */}
        {activeTab === 'ai-summary' && isClinicianOrAdmin && (
          <div className="ai-summary-tab">
            <CDSSPanel showReviewActions={true} />
            {formData.patientId && (
              <AISummaryDashboard patientId={formData.patientId} />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
