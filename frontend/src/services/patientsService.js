import apiClient, { createQueryString } from './api';
import { PATIENTS_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Patients Service
 * Handles all patient-related API calls
 */

const patientsService = {
  /**
   * Get all patients with optional filters
   * @param {Object} params - Query parameters { pageNumber, pageSize, search, status }
   * @returns {Promise} Paginated list of patients
   */
  getAllPatients: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${PATIENTS_ENDPOINTS.BASE}${queryString}`);
    return response.data;
  },

  /**
   * Get patient by ID
   * @param {number} id - Patient ID
   * @returns {Promise} Patient data
   */
  getPatientById: async (id) => {
    const response = await apiClient.get(PATIENTS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new patient
   * @param {Object} patientData - Patient data
   * @returns {Promise} Created patient
   */
  createPatient: async (patientData) => {
    const response = await apiClient.post(PATIENTS_ENDPOINTS.BASE, patientData);
    return response.data;
  },

  /**
   * Update patient
   * @param {number} id - Patient ID
   * @param {Object} patientData - Updated patient data
   * @returns {Promise} Updated patient
   */
  updatePatient: async (id, patientData) => {
    const response = await apiClient.put(PATIENTS_ENDPOINTS.BY_ID(id), patientData);
    return response.data;
  },

  /**
   * Delete patient (soft delete)
   * @param {number} id - Patient ID
   * @returns {Promise} Response
   */
  deletePatient: async (id) => {
    const response = await apiClient.delete(PATIENTS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Search patients
   * @param {string} query - Search query
   * @returns {Promise} Search results
   */
  searchPatients: async (query) => {
    const response = await apiClient.get(`${PATIENTS_ENDPOINTS.SEARCH}?query=${encodeURIComponent(query)}`);
    return response.data;
  },

  /**
   * Get patient medical history
   * @param {number} patientId - Patient ID
   * @returns {Promise} Medical history
   */
  getPatientMedicalHistory: async (patientId) => {
    const response = await apiClient.get(PATIENTS_ENDPOINTS.MEDICAL_HISTORY(patientId));
    return response.data;
  },

  /**
   * Get patient appointments
   * @param {number} patientId - Patient ID
   * @param {Object} params - Query parameters
   * @returns {Promise} Appointments list
   */
  getPatientAppointments: async (patientId, params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${PATIENTS_ENDPOINTS.APPOINTMENTS(patientId)}${queryString}`);
    return response.data;
  },

  /**
   * Get patient prescriptions
   * @param {number} patientId - Patient ID
   * @returns {Promise} Prescriptions list
   */
  getPatientPrescriptions: async (patientId) => {
    const response = await apiClient.get(PATIENTS_ENDPOINTS.PRESCRIPTIONS(patientId));
    return response.data;
  },

  /**
   * Get patient lab results
   * @param {number} patientId - Patient ID
   * @returns {Promise} Lab results list
   */
  getPatientLabResults: async (patientId) => {
    const response = await apiClient.get(PATIENTS_ENDPOINTS.LAB_RESULTS(patientId));
    return response.data;
  },

  /**
   * Get patient billing information
   * @param {number} patientId - Patient ID
   * @returns {Promise} Billing information
   */
  getPatientBilling: async (patientId) => {
    const response = await apiClient.get(PATIENTS_ENDPOINTS.BILLING(patientId));
    return response.data;
  },

  /**
   * Get patient statistics
   * @param {number} patientId - Patient ID
   * @returns {Promise} Patient statistics
   */
  getPatientStatistics: async (patientId) => {
    const response = await apiClient.get(`${PATIENTS_ENDPOINTS.BY_ID(patientId)}/statistics`);
    return response.data;
  },
};

export default patientsService;
