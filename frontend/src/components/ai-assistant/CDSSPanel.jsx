import { useSelector, useDispatch } from 'react-redux';
import { reviewRecommendation } from '../../store/slices/aiAssistantSlice';
import './CDSSPanel.css';

export default function CDSSPanel({ showReviewActions = true }) {
  const dispatch = useDispatch();
  const { recommendations, loading } = useSelector((state) => state.aiAssistant);

  const handleReview = async (recommendationId, isAccepted) => {
    const reviewNotes = prompt(
      isAccepted 
        ? 'Add notes for accepting this recommendation (optional):'
        : 'Add notes for rejecting this recommendation (optional):'
    );

    try {
      await dispatch(
        reviewRecommendation({ recommendationId, isAccepted, reviewNotes })
      ).unwrap();
      
      alert(`Recommendation ${isAccepted ? 'accepted' : 'rejected'} successfully!`);
    } catch (error) {
      alert(`Failed to review recommendation: ${error.message}`);
    }
  };

  const getSeverityClass = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'urgent':
        return 'severity-urgent';
      case 'warning':
        return 'severity-warning';
      case 'info':
        return 'severity-info';
      default:
        return 'severity-normal';
    }
  };

  const getSeverityIcon = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'urgent':
        return '🚨';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✓';
    }
  };

  const getTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'diagnosis':
        return '🔍';
      case 'treatment':
        return '💊';
      case 'alert':
        return '🔔';
      case 'followup':
        return '📅';
      default:
        return '📋';
    }
  };

  if (loading.recommendations) {
    return (
      <div className="cdss-panel loading">
        <div className="loading-spinner"></div>
        <p>Generating clinical recommendations...</p>
      </div>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="cdss-panel empty">
        <div className="empty-state">
          <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3>No Recommendations Yet</h3>
          <p>Upload and analyze a document to receive AI-powered clinical recommendations</p>
        </div>
      </div>
    );
  }

  // Group recommendations by type
  const groupedRecommendations = recommendations.reduce((acc, rec) => {
    const type = rec.recommendationType || 'Other';
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(rec);
    return acc;
  }, {});

  // Sort by severity
  const severityOrder = { 'Urgent': 1, 'Warning': 2, 'Normal': 3, 'Info': 4 };
  const sortedRecommendations = [...recommendations].sort(
    (a, b) => (severityOrder[a.severity] || 5) - (severityOrder[b.severity] || 5)
  );

  return (
    <div className="cdss-panel">
      <div className="cdss-header">
        <h3>🤖 Clinical Decision Support Recommendations</h3>
        <div className="cdss-stats">
          <span className="stat-badge urgent">{recommendations.filter(r => r.severity === 'Urgent').length} Urgent</span>
          <span className="stat-badge warning">{recommendations.filter(r => r.severity === 'Warning').length} Warnings</span>
          <span className="stat-badge total">{recommendations.length} Total</span>
        </div>
      </div>

      <div className="recommendations-list">
        {sortedRecommendations.map((rec, index) => (
          <div 
            key={index} 
            className={`recommendation-card ${getSeverityClass(rec.severity)} ${rec.isReviewed ? 'reviewed' : ''}`}
          >
            <div className="recommendation-header">
              <div className="recommendation-type">
                <span className="type-icon">{getTypeIcon(rec.recommendationType)}</span>
                <span className="type-text">{rec.recommendationType}</span>
              </div>
              <div className="recommendation-severity">
                <span className="severity-icon">{getSeverityIcon(rec.severity)}</span>
                <span className="severity-text">{rec.severity}</span>
              </div>
            </div>

            <div className="recommendation-content">
              <p className="recommendation-text">{rec.recommendationText}</p>
              
              {rec.confidenceScore && (
                <div className="confidence-score">
                  <span className="confidence-label">Confidence:</span>
                  <div className="confidence-bar">
                    <div 
                      className="confidence-fill" 
                      style={{ width: `${rec.confidenceScore * 100}%` }}
                    ></div>
                  </div>
                  <span className="confidence-value">{(rec.confidenceScore * 100).toFixed(0)}%</span>
                </div>
              )}

              {rec.supportingEvidence && rec.supportingEvidence.length > 0 && (
                <div className="supporting-evidence">
                  <strong>Supporting Evidence:</strong>
                  <ul>
                    {rec.supportingEvidence.map((evidence, idx) => (
                      <li key={idx}>{evidence}</li>
                    ))}
                  </ul>
                </div>
              )}

              {rec.rulesApplied && rec.rulesApplied.length > 0 && (
                <div className="rules-applied">
                  <strong>Clinical Rules:</strong> {rec.rulesApplied.join(', ')}
                </div>
              )}
            </div>

            {showReviewActions && !rec.isReviewed && (
              <div className="recommendation-actions">
                <button
                  className="btn-accept"
                  onClick={() => handleReview(rec.id, true)}
                >
                  ✓ Accept
                </button>
                <button
                  className="btn-reject"
                  onClick={() => handleReview(rec.id, false)}
                >
                  ✗ Reject
                </button>
              </div>
            )}

            {rec.isReviewed && (
              <div className="review-status">
                <span className={rec.isAccepted ? 'status-accepted' : 'status-rejected'}>
                  {rec.isAccepted ? '✓ Accepted' : '✗ Rejected'}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary by Type */}
      <div className="recommendations-summary">
        <h4>Summary by Type</h4>
        <div className="summary-grid">
          {Object.entries(groupedRecommendations).map(([type, recs]) => (
            <div key={type} className="summary-card">
              <span className="summary-icon">{getTypeIcon(type)}</span>
              <span className="summary-type">{type}</span>
              <span className="summary-count">{recs.length}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
