import apiClient, { createQueryString } from './api';
import { EQUIPMENT_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Equipment Service
 * Handles all equipment-related API calls
 */

const equipmentService = {
  /**
   * Get all equipment
   * @param {Object} params - Query parameters { type, status }
   * @returns {Promise} List of equipment
   */
  getAllEquipment: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINTS.BASE}${queryString}`);
    return response.data;
  },

  /**
   * Get equipment by ID
   * @param {number} id - Equipment ID
   * @returns {Promise} Equipment data
   */
  getEquipmentById: async (id) => {
    const response = await apiClient.get(EQUIPMENT_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new equipment
   * @param {Object} equipmentData - Equipment data
   * @returns {Promise} Created equipment
   */
  createEquipment: async (equipmentData) => {
    const response = await apiClient.post(EQUIPMENT_ENDPOINTS.BASE, equipmentData);
    return response.data;
  },

  /**
   * Update equipment
   * @param {number} id - Equipment ID
   * @param {Object} equipmentData - Updated equipment data
   * @returns {Promise} Updated equipment
   */
  updateEquipment: async (id, equipmentData) => {
    const response = await apiClient.put(EQUIPMENT_ENDPOINTS.BY_ID(id), equipmentData);
    return response.data;
  },

  /**
   * Delete equipment
   * @param {number} id - Equipment ID
   * @returns {Promise} Response
   */
  deleteEquipment: async (id) => {
    const response = await apiClient.delete(EQUIPMENT_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get available equipment
   * @param {Object} params - Query parameters { type, date }
   * @returns {Promise} Available equipment
   */
  getAvailableEquipment: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINTS.AVAILABLE}${queryString}`);
    return response.data;
  },

  /**
   * Request equipment maintenance
   * @param {number} id - Equipment ID
   * @param {Object} maintenanceData - { description, priority, scheduledDate }
   * @returns {Promise} Response
   */
  requestMaintenance: async (id, maintenanceData) => {
    const response = await apiClient.post(EQUIPMENT_ENDPOINTS.MAINTENANCE(id), maintenanceData);
    return response.data;
  },

  /**
   * Update equipment status
   * @param {number} id - Equipment ID
   * @param {Object} statusData - { status, notes }
   * @returns {Promise} Response
   */
  updateEquipmentStatus: async (id, statusData) => {
    const response = await apiClient.patch(EQUIPMENT_ENDPOINTS.STATUS(id), statusData);
    return response.data;
  },

  /**
   * Get equipment maintenance history
   * @param {number} id - Equipment ID
   * @returns {Promise} Maintenance history
   */
  getMaintenanceHistory: async (id) => {
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINTS.BY_ID(id)}/maintenance-history`);
    return response.data;
  },

  /**
   * Get equipment statistics
   * @param {Object} params - Query parameters { startDate, endDate }
   * @returns {Promise} Equipment statistics
   */
  getEquipmentStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${EQUIPMENT_ENDPOINTS.BASE}/statistics${queryString}`);
    return response.data;
  },
};

export default equipmentService;
