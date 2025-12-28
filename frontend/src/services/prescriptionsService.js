import apiClient, { createQueryString } from './api';
import { PRESCRIPTIONS_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Prescriptions Service
 * Handles all prescription-related API calls
 */

const prescriptionsService = {
  /**
   * Get all prescriptions with optional filters
   * @param {Object} params - Query parameters { patientId, status, pageNumber, pageSize }
   * @returns {Promise} Paginated list of prescriptions
   */
  getAllPrescriptions: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${PRESCRIPTIONS_ENDPOINTS.BASE}${queryString}`);
    return response.data;
  },

  /**
   * Get prescription by ID
   * @param {number} id - Prescription ID
   * @returns {Promise} Prescription data
   */
  getPrescriptionById: async (id) => {
    const response = await apiClient.get(PRESCRIPTIONS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new prescription
   * @param {Object} prescriptionData - Prescription data
   * @returns {Promise} Created prescription
   */
  createPrescription: async (prescriptionData) => {
    const response = await apiClient.post(PRESCRIPTIONS_ENDPOINTS.BASE, prescriptionData);
    return response.data;
  },

  /**
   * Update prescription
   * @param {number} id - Prescription ID
   * @param {Object} prescriptionData - Updated prescription data
   * @returns {Promise} Updated prescription
   */
  updatePrescription: async (id, prescriptionData) => {
    const response = await apiClient.put(PRESCRIPTIONS_ENDPOINTS.BY_ID(id), prescriptionData);
    return response.data;
  },

  /**
   * Update prescription status
   * @param {number} id - Prescription ID
   * @param {Object} statusData - { status, filledDate, notes }
   * @returns {Promise} Response
   */
  updatePrescriptionStatus: async (id, statusData) => {
    const response = await apiClient.patch(PRESCRIPTIONS_ENDPOINTS.STATUS(id), statusData);
    return response.data;
  },

  /**
   * Request prescription refill
   * @param {number} id - Prescription ID
   * @returns {Promise} Response
   */
  requestRefill: async (id) => {
    const response = await apiClient.post(PRESCRIPTIONS_ENDPOINTS.REFILL(id));
    return response.data;
  },

  /**
   * Delete prescription
   * @param {number} id - Prescription ID
   * @returns {Promise} Response
   */
  deletePrescription: async (id) => {
    const response = await apiClient.delete(PRESCRIPTIONS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get active prescriptions for a patient
   * @param {number} patientId - Patient ID
   * @returns {Promise} Active prescriptions
   */
  getActivePrescriptions: async (patientId) => {
    const response = await apiClient.get(PRESCRIPTIONS_ENDPOINTS.ACTIVE(patientId));
    return response.data;
  },

  /**
   * Get patient prescriptions
   * @param {number} patientId - Patient ID
   * @returns {Promise} Patient prescriptions
   */
  getPatientPrescriptions: async (patientId) => {
    const response = await apiClient.get(`${PRESCRIPTIONS_ENDPOINTS.BASE}?patientId=${patientId}`);
    return response.data;
  },

  /**
   * Mark prescription as filled
   * @param {number} id - Prescription ID
   * @param {Object} fillData - { filledDate, pharmacy, pharmacistNotes }
   * @returns {Promise} Response
   */
  markAsFilled: async (id, fillData) => {
    const response = await apiClient.post(`${PRESCRIPTIONS_ENDPOINTS.BY_ID(id)}/fill`, fillData);
    return response.data;
  },

  /**
   * Cancel prescription
   * @param {number} id - Prescription ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Response
   */
  cancelPrescription: async (id, reason) => {
    const response = await apiClient.post(`${PRESCRIPTIONS_ENDPOINTS.BY_ID(id)}/cancel`, { reason });
    return response.data;
  },
};

export default prescriptionsService;
