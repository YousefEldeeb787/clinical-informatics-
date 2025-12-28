import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { uploadDocument, completeAnalysis } from '../../store/slices/aiAssistantSlice';
import './DocumentUpload.css';

export default function DocumentUpload({ patientId, onAnalysisComplete }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.aiAssistant);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [documentType, setDocumentType] = useState('Prescription');
  const [dragActive, setDragActive] = useState(false);

  const documentTypes = [
    'Prescription',
    'Lab Result',
    'Imaging Report',
    'Medical Certificate',
    'Referral Letter',
    'Other'
  ];

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !patientId) {
      alert('Please select a file and ensure patient is selected');
      return;
    }

    try {
      const uploadResult = await dispatch(
        uploadDocument({ patientId, file: selectedFile, documentType })
      ).unwrap();

      alert('Document uploaded successfully!');
      
      // Optionally auto-start complete analysis
      const shouldAnalyze = window.confirm(
        'Would you like to start AI analysis now? This includes OCR, entity extraction, ontology mapping, and CDSS recommendations.'
      );

      if (shouldAnalyze && uploadResult.documentId) {
        await handleCompleteAnalysis(uploadResult.documentId);
      }
    } catch (error) {
      alert(`Upload failed: ${error.message || 'Unknown error'}`);
    }
  };

  const handleCompleteAnalysis = async (documentId) => {
    try {
      const result = await dispatch(
        completeAnalysis({ documentId, additionalContext: null })
      ).unwrap();

      alert('AI analysis completed successfully!');
      
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (error) {
      alert(`Analysis failed: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="document-upload-container">
      <div className="upload-header">
        <h3>📄 Upload Medical Document</h3>
        <p className="upload-subtitle">Upload prescriptions, lab results, or medical reports for AI analysis</p>
      </div>

      <div className="upload-form">
        {/* Document Type Selection */}
        <div className="form-group">
          <label htmlFor="documentType">Document Type:</label>
          <select
            id="documentType"
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
            className="form-control"
          >
            {documentTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* Drag and Drop Area */}
        <div
          className={`drag-drop-area ${dragActive ? 'drag-active' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="drag-drop-content">
            <svg className="upload-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="drag-drop-text">
              {selectedFile ? selectedFile.name : 'Drag and drop file here, or click to select'}
            </p>
            
            <input
              type="file"
              id="fileInput"
              className="file-input"
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            
            <label htmlFor="fileInput" className="file-input-label">
              Choose File
            </label>
          </div>
        </div>

        {/* File Info */}
        {selectedFile && (
          <div className="file-info">
            <div className="file-details">
              <strong>Selected File:</strong> {selectedFile.name}
            </div>
            <div className="file-details">
              <strong>Size:</strong> {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </div>
            <div className="file-details">
              <strong>Type:</strong> {selectedFile.type || 'Unknown'}
            </div>
          </div>
        )}

        {/* Error Display */}
        {error.upload && (
          <div className="error-message">
            ⚠️ {error.upload}
          </div>
        )}

        {/* Upload Button */}
        <div className="upload-actions">
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={!selectedFile || loading.upload || loading.completeAnalysis}
          >
            {loading.upload ? '📤 Uploading...' : loading.completeAnalysis ? '🤖 Analyzing...' : '📤 Upload & Analyze'}
          </button>

          {selectedFile && (
            <button
              className="btn btn-secondary"
              onClick={() => setSelectedFile(null)}
              disabled={loading.upload || loading.completeAnalysis}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* AI Workflow Info */}
      <div className="ai-workflow-info">
        <h4>🤖 AI Analysis Workflow</h4>
        <ol>
          <li><strong>OCR:</strong> Extract text from document using Tesseract OCR</li>
          <li><strong>NLP:</strong> Identify symptoms, medications, lab values, diagnoses</li>
          <li><strong>Ontology Mapping:</strong> Map to SNOMED CT, ICD-10, UMLS codes</li>
          <li><strong>CDSS:</strong> Generate clinical recommendations and alerts</li>
        </ol>
      </div>
    </div>
  );
}
