import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPatientAISummary } from '../../store/slices/aiAssistantSlice';
import './AISummaryDashboard.css';

export default function AISummaryDashboard({ patientId }) {
  const dispatch = useDispatch();
  const { patientSummary, loading, ocrText, entities, ontologyMappings } = useSelector(
    (state) => state.aiAssistant
  );

  useEffect(() => {
    if (patientId) {
      dispatch(getPatientAISummary(patientId));
    }
  }, [dispatch, patientId]);

  if (loading.summary) {
    return (
      <div className="ai-summary-dashboard loading">
        <div className="loading-spinner"></div>
        <p>Loading AI Summary...</p>
      </div>
    );
  }

  if (!patientSummary && !ocrText && !entities?.length) {
    return (
      <div className="ai-summary-dashboard empty">
        <div className="empty-state">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3>No AI Data Available</h3>
          <p>Upload and analyze documents to see AI-powered insights</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ai-summary-dashboard">
      <div className="dashboard-header">
        <h2>🤖 AI Clinical Assistant Dashboard</h2>
        <p className="dashboard-subtitle">Comprehensive AI-powered medical analysis and recommendations</p>
      </div>

      {/* Statistics Overview */}
      {patientSummary && (
        <div className="stats-overview">
          <div className="stat-card documents">
            <div className="stat-icon">📄</div>
            <div className="stat-content">
              <div className="stat-value">{patientSummary.totalDocuments}</div>
              <div className="stat-label">Documents</div>
              <div className="stat-detail">{patientSummary.processedDocuments} Processed</div>
            </div>
          </div>

          <div className="stat-card entities">
            <div className="stat-icon">🏷️</div>
            <div className="stat-content">
              <div className="stat-value">{patientSummary.totalEntities}</div>
              <div className="stat-label">Medical Entities</div>
              <div className="stat-detail">Extracted & Classified</div>
            </div>
          </div>

          <div className="stat-card recommendations">
            <div className="stat-icon">💡</div>
            <div className="stat-content">
              <div className="stat-value">{patientSummary.totalRecommendations}</div>
              <div className="stat-label">Recommendations</div>
              <div className="stat-detail">
                {patientSummary.urgentAlerts} Urgent, {patientSummary.warnings} Warnings
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OCR Text Section */}
      {ocrText && (
        <div className="section-card ocr-section">
          <div className="section-header">
            <h3>📝 Extracted Text (OCR)</h3>
            <span className="section-badge">Tesseract OCR</span>
          </div>
          <div className="ocr-text-box">
            <pre>{ocrText}</pre>
          </div>
        </div>
      )}

      {/* Entity Breakdown */}
      {patientSummary?.entityBreakdown && (
        <div className="section-card entities-section">
          <div className="section-header">
            <h3>🏷️ Medical Entities Breakdown</h3>
            <span className="section-badge">NLP Extraction</span>
          </div>
          <div className="entities-grid">
            {patientSummary.entityBreakdown.map((entity, index) => (
              <div key={index} className="entity-type-card">
                <div className="entity-icon">{getEntityIcon(entity.entityType)}</div>
                <div className="entity-info">
                  <div className="entity-type">{entity.entityType}</div>
                  <div className="entity-count">{entity.count}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Current Session Entities */}
      {entities && entities.length > 0 && (
        <div className="section-card current-entities-section">
          <div className="section-header">
            <h3>🔍 Current Document Entities</h3>
            <span className="section-badge">Latest Analysis</span>
          </div>
          <div className="entities-table">
            <table>
              <thead>
                <tr>
                  <th>Type</th>
                  <th>Text</th>
                  <th>Ontology</th>
                  <th>Confidence</th>
                </tr>
              </thead>
              <tbody>
                {entities.map((entity, index) => (
                  <tr key={index}>
                    <td>
                      <span className="entity-type-badge">{entity.entityType}</span>
                    </td>
                    <td>{entity.entityText}</td>
                    <td>
                      {entity.ontologyCode ? (
                        <div className="ontology-info">
                          <strong>{entity.ontologySystem}:</strong> {entity.ontologyCode}
                          <br />
                          <small>{entity.ontologyDescription}</small>
                        </div>
                      ) : (
                        <span className="text-muted">Not mapped</span>
                      )}
                    </td>
                    <td>
                      {entity.confidenceScore && (
                        <div className="confidence-indicator">
                          <div className="confidence-bar-mini">
                            <div
                              className="confidence-fill-mini"
                              style={{ width: `${entity.confidenceScore * 100}%` }}
                            ></div>
                          </div>
                          <span>{(entity.confidenceScore * 100).toFixed(0)}%</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Ontology Mappings */}
      {ontologyMappings && ontologyMappings.length > 0 && (
        <div className="section-card ontology-section">
          <div className="section-header">
            <h3>🗂️ Ontology Mappings</h3>
            <span className="section-badge">SNOMED CT / ICD-10 / UMLS</span>
          </div>
          <div className="ontology-grid">
            {ontologyMappings.map((mapping, index) => (
              <div key={index} className="ontology-card">
                <div className="ontology-system">{mapping.ontologySystem}</div>
                <div className="ontology-code">{mapping.ontologyCode}</div>
                <div className="ontology-term">{mapping.entityText}</div>
                <div className="ontology-description">{mapping.description}</div>
                {mapping.confidence && (
                  <div className="ontology-confidence">
                    Confidence: {(mapping.confidence * 100).toFixed(0)}%
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Recommendations */}
      {patientSummary?.recentRecommendations && patientSummary.recentRecommendations.length > 0 && (
        <div className="section-card recommendations-section">
          <div className="section-header">
            <h3>💡 Recent Recommendations</h3>
            <span className="section-badge">CDSS</span>
          </div>
          <div className="recommendations-preview">
            {patientSummary.recentRecommendations.map((rec, index) => (
              <div key={index} className="recommendation-preview-card">
                <div className="rec-preview-header">
                  <span className="rec-type">{rec.recommendationType}</span>
                  <span className={`rec-severity severity-${rec.severity.toLowerCase()}`}>
                    {rec.severity}
                  </span>
                </div>
                <div className="rec-preview-text">{rec.recommendationText}</div>
                <div className="rec-preview-meta">
                  <span>{new Date(rec.generatedAt).toLocaleDateString()}</span>
                  <span className={rec.isReviewed ? 'reviewed' : 'pending'}>
                    {rec.isReviewed ? '✓ Reviewed' : '⏳ Pending Review'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get entity icons
function getEntityIcon(entityType) {
  const icons = {
    'Symptom': '🤒',
    'Medication': '💊',
    'Diagnosis': '🔍',
    'LabValue': '🧪',
    'VitalSign': '❤️',
    'Procedure': '⚕️',
  };
  return icons[entityType] || '📋';
}
