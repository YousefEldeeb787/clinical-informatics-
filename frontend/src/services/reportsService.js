import apiClient, { createQueryString } from './api';
import { REPORTS_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Reports Service
 * Handles all reporting and analytics API calls
 */

const reportsService = {
  /**
   * Get dashboard statistics
   * @returns {Promise} Dashboard statistics
   */
  getDashboardStats: async () => {
    const response = await apiClient.get(REPORTS_ENDPOINTS.DASHBOARD);
    return response.data;
  },

  /**
   * Get patient statistics
   * @param {Object} params - Query parameters { startDate, endDate }
   * @returns {Promise} Patient statistics
   */
  getPatientStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.PATIENTS}${queryString}`);
    return response.data;
  },

  /**
   * Get appointment statistics
   * @param {Object} params - Query parameters { startDate, endDate, clinicianId }
   * @returns {Promise} Appointment statistics
   */
  getAppointmentStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.APPOINTMENTS}${queryString}`);
    return response.data;
  },

  /**
   * Get surgery statistics
   * @param {Object} params - Query parameters { startDate, endDate, surgeonId }
   * @returns {Promise} Surgery statistics
   */
  getSurgeryStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.SURGERIES}${queryString}`);
    return response.data;
  },

  /**
   * Get billing statistics
   * @param {Object} params - Query parameters { startDate, endDate }
   * @returns {Promise} Billing statistics
   */
  getBillingStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.BILLING}${queryString}`);
    return response.data;
  },

  /**
   * Get revenue report
   * @param {Object} params - Query parameters { startDate, endDate, groupBy }
   * @returns {Promise} Revenue report
   */
  getRevenueReport: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.REVENUE}${queryString}`);
    return response.data;
  },

  /**
   * Export report
   * @param {Object} params - { reportType, format, startDate, endDate }
   * @returns {Promise} Report file blob
   */
  exportReport: async (params) => {
    const queryString = `?${createQueryString(params)}`;
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.EXPORT}${queryString}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  /**
   * Get clinician performance report
   * @param {Object} params - Query parameters { clinicianId, startDate, endDate }
   * @returns {Promise} Clinician performance data
   */
  getClinicianPerformance: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.DASHBOARD}/clinician-performance${queryString}`);
    return response.data;
  },

  /**
   * Get occupancy report (rooms, equipment, etc.)
   * @param {Object} params - Query parameters { startDate, endDate, type }
   * @returns {Promise} Occupancy report
   */
  getOccupancyReport: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${REPORTS_ENDPOINTS.DASHBOARD}/occupancy${queryString}`);
    return response.data;
  },

  /**
   * Get custom report
   * @param {Object} reportConfig - Custom report configuration
   * @returns {Promise} Custom report data
   */
  getCustomReport: async (reportConfig) => {
    const response = await apiClient.post(`${REPORTS_ENDPOINTS.DASHBOARD}/custom`, reportConfig);
    return response.data;
  },
};

export default reportsService;
