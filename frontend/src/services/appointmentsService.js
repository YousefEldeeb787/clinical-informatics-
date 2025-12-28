import apiClient, { createQueryString } from './api';
import { APPOINTMENTS_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Appointments Service
 * Handles all appointment-related API calls
 */

const appointmentsService = {
  /**
   * Get all appointments with optional filters
   * @param {Object} params - Query parameters { patientId, clinicianId, status, date, pageNumber, pageSize }
   * @returns {Promise} Paginated list of appointments
   */
  getAllAppointments: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${APPOINTMENTS_ENDPOINTS.BASE}${queryString}`);
    return response.data;
  },

  /**
   * Get appointment by ID
   * @param {number} id - Appointment ID
   * @returns {Promise} Appointment data
   */
  getAppointmentById: async (id) => {
    const response = await apiClient.get(APPOINTMENTS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new appointment
   * @param {Object} appointmentData - Appointment data
   * @returns {Promise} Created appointment
   */
  createAppointment: async (appointmentData) => {
    const response = await apiClient.post(APPOINTMENTS_ENDPOINTS.BASE, appointmentData);
    return response.data;
  },

  /**
   * Update appointment
   * @param {number} id - Appointment ID
   * @param {Object} appointmentData - Updated appointment data
   * @returns {Promise} Updated appointment
   */
  updateAppointment: async (id, appointmentData) => {
    const response = await apiClient.put(APPOINTMENTS_ENDPOINTS.BY_ID(id), appointmentData);
    return response.data;
  },

  /**
   * Update appointment status
   * @param {number} id - Appointment ID
   * @param {Object} statusData - { status, notes }
   * @returns {Promise} Response
   */
  updateAppointmentStatus: async (id, statusData) => {
    const response = await apiClient.patch(APPOINTMENTS_ENDPOINTS.STATUS(id), statusData);
    return response.data;
  },

  /**
   * Check in patient for appointment
   * @param {number} id - Appointment ID
   * @returns {Promise} Response
   */
  checkInAppointment: async (id) => {
    const response = await apiClient.post(APPOINTMENTS_ENDPOINTS.CHECKIN(id));
    return response.data;
  },

  /**
   * Cancel appointment
   * @param {number} id - Appointment ID
   * @param {string} reason - Cancellation reason
   * @returns {Promise} Response
   */
  cancelAppointment: async (id, reason) => {
    const response = await apiClient.post(APPOINTMENTS_ENDPOINTS.CANCEL(id), { reason });
    return response.data;
  },

  /**
   * Delete appointment
   * @param {number} id - Appointment ID
   * @returns {Promise} Response
   */
  deleteAppointment: async (id) => {
    const response = await apiClient.delete(APPOINTMENTS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get today's appointments
   * @param {Object} params - Query parameters { clinicianId, status }
   * @returns {Promise} Today's appointments
   */
  getTodayAppointments: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${APPOINTMENTS_ENDPOINTS.TODAY}${queryString}`);
    return response.data;
  },

  /**
   * Get upcoming appointments
   * @param {Object} params - Query parameters { patientId, clinicianId, days }
   * @returns {Promise} Upcoming appointments
   */
  getUpcomingAppointments: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${APPOINTMENTS_ENDPOINTS.UPCOMING}${queryString}`);
    return response.data;
  },

  /**
   * Get appointment statistics
   * @param {Object} params - Query parameters { startDate, endDate, clinicianId }
   * @returns {Promise} Appointment statistics
   */
  getAppointmentStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${APPOINTMENTS_ENDPOINTS.STATISTICS}${queryString}`);
    return response.data;
  },

  /**
   * Get available appointment slots
   * @param {Object} params - Query parameters { clinicianId, date, duration }
   * @returns {Promise} Available slots
   */
  getAvailableSlots: async (params) => {
    const queryString = `?${createQueryString(params)}`;
    const response = await apiClient.get(`${APPOINTMENTS_ENDPOINTS.AVAILABLE_SLOTS}${queryString}`);
    return response.data;
  },

  /**
   * Reschedule appointment
   * @param {number} id - Appointment ID
   * @param {Object} rescheduleData - { startTime, endTime, reason }
   * @returns {Promise} Updated appointment
   */
  rescheduleAppointment: async (id, rescheduleData) => {
    const response = await apiClient.post(`${APPOINTMENTS_ENDPOINTS.BY_ID(id)}/reschedule`, rescheduleData);
    return response.data;
  },
};

export default appointmentsService;
