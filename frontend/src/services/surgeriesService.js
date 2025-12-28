import apiClient, { createQueryString } from './api';
import { SURGERIES_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Surgeries Service
 * Handles all surgery-related API calls
 */

const surgeriesService = {
  /**
   * Get all surgeries with optional filters
   * @param {Object} params - Query parameters { patientId, surgeonId, status, date, pageNumber, pageSize }
   * @returns {Promise} Paginated list of surgeries
   */
  getAllSurgeries: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${SURGERIES_ENDPOINTS.BASE}${queryString}`);
    return response.data;
  },

  /**
   * Get surgery by ID
   * @param {number} id - Surgery ID
   * @returns {Promise} Surgery data
   */
  getSurgeryById: async (id) => {
    const response = await apiClient.get(SURGERIES_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new surgery
   * @param {Object} surgeryData - Surgery data
   * @returns {Promise} Created surgery
   */
  createSurgery: async (surgeryData) => {
    const response = await apiClient.post(SURGERIES_ENDPOINTS.BASE, surgeryData);
    return response.data;
  },

  /**
   * Update surgery
   * @param {number} id - Surgery ID
   * @param {Object} surgeryData - Updated surgery data
   * @returns {Promise} Updated surgery
   */
  updateSurgery: async (id, surgeryData) => {
    const response = await apiClient.put(SURGERIES_ENDPOINTS.BY_ID(id), surgeryData);
    return response.data;
  },

  /**
   * Update surgery status
   * @param {number} id - Surgery ID
   * @param {Object} statusData - { status, notes }
   * @returns {Promise} Response
   */
  updateSurgeryStatus: async (id, statusData) => {
    const response = await apiClient.patch(SURGERIES_ENDPOINTS.STATUS(id), statusData);
    return response.data;
  },

  /**
   * Assign surgical team/staff
   * @param {number} id - Surgery ID
   * @param {Object} staffData - { anesthesiologistId, nurseId, assistantIds }
   * @returns {Promise} Response
   */
  assignSurgeryStaff: async (id, staffData) => {
    const response = await apiClient.post(SURGERIES_ENDPOINTS.ASSIGN_STAFF(id), staffData);
    return response.data;
  },

  /**
   * Start surgery
   * @param {number} id - Surgery ID
   * @returns {Promise} Response
   */
  startSurgery: async (id) => {
    const response = await apiClient.post(SURGERIES_ENDPOINTS.START(id));
    return response.data;
  },

  /**
   * Complete surgery
   * @param {number} id - Surgery ID
   * @param {Object} completionData - { postOpDiagnosis, postOpInstructions, postOpNotes, complications }
   * @returns {Promise} Response
   */
  completeSurgery: async (id, completionData) => {
    const response = await apiClient.post(SURGERIES_ENDPOINTS.COMPLETE(id), completionData);
    return response.data;
  },

  /**
   * Delete surgery
   * @param {number} id - Surgery ID
   * @returns {Promise} Response
   */
  deleteSurgery: async (id) => {
    const response = await apiClient.delete(SURGERIES_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get scheduled surgeries
   * @param {Object} params - Query parameters { startDate, endDate, surgeonId }
   * @returns {Promise} Scheduled surgeries
   */
  getScheduledSurgeries: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${SURGERIES_ENDPOINTS.SCHEDULED}${queryString}`);
    return response.data;
  },

  /**
   * Get today's surgeries
   * @param {Object} params - Query parameters { surgeonId, status }
   * @returns {Promise} Today's surgeries
   */
  getTodaySurgeries: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${SURGERIES_ENDPOINTS.TODAY}${queryString}`);
    return response.data;
  },

  /**
   * Get surgery statistics
   * @param {Object} params - Query parameters { startDate, endDate, surgeonId }
   * @returns {Promise} Surgery statistics
   */
  getSurgeryStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${SURGERIES_ENDPOINTS.STATISTICS}${queryString}`);
    return response.data;
  },

  /**
   * Get surgery history for patient
   * @param {number} patientId - Patient ID
   * @returns {Promise} Surgery history
   */
  getPatientSurgeryHistory: async (patientId) => {
    const response = await apiClient.get(`${SURGERIES_ENDPOINTS.BASE}?patientId=${patientId}`);
    return response.data;
  },

  /**
   * Cancel surgery
   * @param {number} id - Surgery ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Response
   */
  cancelSurgery: async (id, reason) => {
    const response = await apiClient.post(`${SURGERIES_ENDPOINTS.BY_ID(id)}/cancel`, { reason });
    return response.data;
  },
};

export default surgeriesService;
