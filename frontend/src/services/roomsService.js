import apiClient, { createQueryString } from './api';
import { ROOMS_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Rooms Service
 * Handles all room-related API calls
 */

const roomsService = {
  /**
   * Get all rooms
   * @param {Object} params - Query parameters { type, status }
   * @returns {Promise} List of rooms
   */
  getAllRooms: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${ROOMS_ENDPOINTS.BASE}${queryString}`);
    return response.data;
  },

  /**
   * Get room by ID
   * @param {number} id - Room ID
   * @returns {Promise} Room data
   */
  getRoomById: async (id) => {
    const response = await apiClient.get(ROOMS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Create new room
   * @param {Object} roomData - Room data
   * @returns {Promise} Created room
   */
  createRoom: async (roomData) => {
    const response = await apiClient.post(ROOMS_ENDPOINTS.BASE, roomData);
    return response.data;
  },

  /**
   * Update room
   * @param {number} id - Room ID
   * @param {Object} roomData - Updated room data
   * @returns {Promise} Updated room
   */
  updateRoom: async (id, roomData) => {
    const response = await apiClient.put(ROOMS_ENDPOINTS.BY_ID(id), roomData);
    return response.data;
  },

  /**
   * Delete room
   * @param {number} id - Room ID
   * @returns {Promise} Response
   */
  deleteRoom: async (id) => {
    const response = await apiClient.delete(ROOMS_ENDPOINTS.BY_ID(id));
    return response.data;
  },

  /**
   * Get available rooms
   * @param {Object} params - Query parameters { date, startTime, endTime, type }
   * @returns {Promise} Available rooms
   */
  getAvailableRooms: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${ROOMS_ENDPOINTS.AVAILABLE}${queryString}`);
    return response.data;
  },

  /**
   * Update room status
   * @param {number} id - Room ID
   * @param {Object} statusData - { status, notes }
   * @returns {Promise} Response
   */
  updateRoomStatus: async (id, statusData) => {
    const response = await apiClient.patch(ROOMS_ENDPOINTS.STATUS(id), statusData);
    return response.data;
  },

  /**
   * Get room schedule
   * @param {number} id - Room ID
   * @param {Object} params - Query parameters { startDate, endDate }
   * @returns {Promise} Room schedule
   */
  getRoomSchedule: async (id, params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${ROOMS_ENDPOINTS.SCHEDULE(id)}${queryString}`);
    return response.data;
  },

  /**
   * Get room occupancy statistics
   * @param {Object} params - Query parameters { startDate, endDate }
   * @returns {Promise} Occupancy statistics
   */
  getRoomStatistics: async (params = {}) => {
    const queryString = params ? `?${createQueryString(params)}` : '';
    const response = await apiClient.get(`${ROOMS_ENDPOINTS.BASE}/statistics${queryString}`);
    return response.data;
  },
};

export default roomsService;
