import api from './api';

// AI Assistant Service for Clinical Decision Support System
const aiAssistantService = {
  // Upload a medical document
  uploadDocument: async (patientId, file, documentType) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('patientId', patientId);
      formData.append('documentType', documentType);

      const response = await api.post('/aiassistant/upload-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error uploading document:', error);
      throw error;
    }
  },

  // Process OCR on uploaded document
  processOCR: async (documentId) => {
    try {
      const response = await api.post(`/aiassistant/${documentId}/process-ocr`);
      return response.data;
    } catch (error) {
      console.error('Error processing OCR:', error);
      throw error;
    }
  },

  // Extract medical entities from OCR text
  extractEntities: async (documentId) => {
    try {
      const response = await api.post(`/aiassistant/${documentId}/extract-entities`);
      return response.data;
    } catch (error) {
      console.error('Error extracting entities:', error);
      throw error;
    }
  },

  // Map entities to medical ontologies (SNOMED CT, ICD-10, UMLS)
  mapOntologies: async (documentId) => {
    try {
      const response = await api.post(`/aiassistant/${documentId}/map-ontologies`);
      return response.data;
    } catch (error) {
      console.error('Error mapping ontologies:', error);
      throw error;
    }
  },

  // Generate CDSS recommendations
  generateRecommendations: async (documentId, additionalContext = null) => {
    try {
      const response = await api.post(
        `/aiassistant/${documentId}/generate-recommendations`,
        { additionalContext }
      );
      return response.data;
    } catch (error) {
      console.error('Error generating recommendations:', error);
      throw error;
    }
  },

  // Complete AI analysis workflow (OCR + NLP + Ontology + CDSS)
  completeAnalysis: async (documentId, additionalContext = null) => {
    try {
      const response = await api.post(
        `/aiassistant/${documentId}/complete-analysis`,
        { additionalContext }
      );
      return response.data;
    } catch (error) {
      console.error('Error performing complete analysis:', error);
      throw error;
    }
  },

  // Get AI analysis summary for a patient
  getPatientAISummary: async (patientId) => {
    try {
      const response = await api.get(`/aiassistant/patient/${patientId}/summary`);
      return response.data;
    } catch (error) {
      console.error('Error getting patient AI summary:', error);
      throw error;
    }
  },

  // Review and accept/reject recommendations
  reviewRecommendation: async (recommendationId, isAccepted, reviewNotes = null) => {
    try {
      const response = await api.post(
        `/aiassistant/recommendations/${recommendationId}/review`,
        { isAccepted, reviewNotes }
      );
      return response.data;
    } catch (error) {
      console.error('Error reviewing recommendation:', error);
      throw error;
    }
  },
};

export default aiAssistantService;
