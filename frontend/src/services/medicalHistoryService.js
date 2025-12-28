import apiClient, { createQueryString } from './api';
import { MEDICAL_HISTORY_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Medical History Service
 * Handles all medical history-related API calls
 */

const medicalHistoryService = {
  /**
   * Get all medical history records with optional filters
   * @param {Object} params - Query parameters { patientId, pageNumber, pageSize }
   * @returns {Promise} Paginated list of medical history records
   */
  getAllMedicalHistory: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${MEDICAL_HISTORY_ENDPOINTS.BASE}${queryString}`);
    return response.data;
  },

  /**
   * Get medical history by ID
   * @param {number} id - Medical history ID
   * @returns {Promise} Medical history data
   */
  getMedicalHistoryById: async (id) => {
    const response = await apiClient.get(MEDICAL_HISTORY_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get patient's medical history
   * @param {number} patientId - Patient ID
   * @returns {Promise} Patient medical history
   */
  getPatientMedicalHistory: async (patientId) => {
    const response = await apiClient.get(MEDICAL_HISTORY_ENDPOINTS.BY_PATIENT(patientId));
    return response.data;
  },

  /**
   * Create new medical history record
   * @param {Object} medicalHistoryData - Medical history data
   * @returns {Promise} Created medical history
   */
  createMedicalHistory: async (medicalHistoryData) => {
    const response = await apiClient.post(MEDICAL_HISTORY_ENDPOINTS.BASE, medicalHistoryData);
    return response.data;
  },

  /**
   * Update medical history
   * @param {number} id - Medical history ID
   * @param {Object} medicalHistoryData - Updated medical history data
   * @returns {Promise} Updated medical history
   */
  updateMedicalHistory: async (id, medicalHistoryData) => {
    const response = await apiClient.put(MEDICAL_HISTORY_ENDPOINTS.BY_ID(id), medicalHistoryData);
    return response.data;
  },

  /**
   * Delete medical history record
   * @param {number} id - Medical history ID
   * @returns {Promise} Response
   */
  deleteMedicalHistory: async (id) => {
    const response = await apiClient.delete(MEDICAL_HISTORY_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get patient's conditions
   * @param {number} patientId - Patient ID
   * @returns {Promise} Patient conditions
   */
  getPatientConditions: async (patientId) => {
    const response = await apiClient.get(MEDICAL_HISTORY_ENDPOINTS.CONDITIONS(patientId));
    return response.data;
  },

  /**
   * Get patient's allergies
   * @param {number} patientId - Patient ID
   * @returns {Promise} Patient allergies
   */
  getPatientAllergies: async (patientId) => {
    const response = await apiClient.get(MEDICAL_HISTORY_ENDPOINTS.ALLERGIES(patientId));
    return response.data;
  },

  /**
   * Add allergy to patient
   * @param {number} patientId - Patient ID
   * @param {Object} allergyData - Allergy data
   * @returns {Promise} Created allergy
   */
  addAllergy: async (patientId, allergyData) => {
    const response = await apiClient.post(`${MEDICAL_HISTORY_ENDPOINTS.BY_PATIENT(patientId)}/allergies`, allergyData);
    return response.data;
  },

  /**
   * Add condition to patient
   * @param {number} patientId - Patient ID
   * @param {Object} conditionData - Condition data
   * @returns {Promise} Created condition
   */
  addCondition: async (patientId, conditionData) => {
    const response = await apiClient.post(`${MEDICAL_HISTORY_ENDPOINTS.BY_PATIENT(patientId)}/conditions`, conditionData);
    return response.data;
  },
};

export default medicalHistoryService;
