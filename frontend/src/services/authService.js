import apiClient from './api';
import { AUTH_ENDPOINTS } from '../config/apiEndpoints';

/**
 * Authentication Service
 * Handles all authentication-related API calls
 */

const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} Response with token and user data
   */
  login: async (credentials) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.LOGIN, credentials);
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.role);
    }
    
    return response.data;
  },

  /**
   * Register new patient
   * @param {Object} userData - Registration data
   * @returns {Promise} Response with token and user data
   */
  register: async (userData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REGISTER, userData);
    
    // Store token and user data
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.role);
    }
    
    return response.data;
  },

  /**
   * Logout user
   * @returns {Promise} Response
   */
  logout: async () => {
    try {
      await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
    } catch (error) {
      console.error('Logout API call failed:', error);
    } finally {
      // Clear local storage regardless of API response
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User profile data
   */
  getCurrentUser: async () => {
    const response = await apiClient.get(AUTH_ENDPOINTS.ME);
    
    // Update stored user data
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    
    return response.data;
  },

  /**
   * Refresh authentication token
   * @returns {Promise} New token and user data
   */
  refreshToken: async () => {
    const response = await apiClient.post(AUTH_ENDPOINTS.REFRESH);
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('role', response.data.role);
    }
    
    return response.data;
  },

  /**
   * Change password
   * @param {Object} passwordData - { currentPassword, newPassword }
   * @returns {Promise} Response
   */
  changePassword: async (passwordData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return response.data;
  },

  /**
   * Request password reset
   * @param {string} email - User email
   * @returns {Promise} Response
   */
  requestPasswordReset: async (email) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.RESET_PASSWORD, { email });
    return response.data;
  },

  /**
   * Confirm password reset
   * @param {Object} resetData - { token, newPassword }
   * @returns {Promise} Response
   */
  confirmPasswordReset: async (resetData) => {
    const response = await apiClient.post(AUTH_ENDPOINTS.CONFIRM_RESET, resetData);
    return response.data;
  },

  /**
   * Check if user is authenticated
   * @returns {boolean} Authentication status
   */
  isAuthenticated: () => {
    const token = localStorage.getItem('token');
    if (!token) return false;
    
    try {
      // Optionally check if token is expired
      // This requires decoding JWT token
      return true;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get stored user data
   * @returns {Object|null} User data
   */
  getUser: () => {
    const userStr = localStorage.getItem('user');
    try {
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error('Error parsing user data:', error);
      return null;
    }
  },

  /**
   * Get user role
   * @returns {string|null} User role
   */
  getRole: () => {
    return localStorage.getItem('role');
  },

  /**
   * Check if user has specific role
   * @param {string} role - Role to check
   * @returns {boolean} Role match status
   */
  hasRole: (role) => {
    const userRole = localStorage.getItem('role');
    return userRole === role;
  },

  /**
   * Check if user has any of the specified roles
   * @param {Array} roles - Array of roles to check
   * @returns {boolean} Role match status
   */
  hasAnyRole: (roles) => {
    const userRole = localStorage.getItem('role');
    return roles.includes(userRole);
  },

  /**
   * Clear all stored authentication data
   */
  clearAuth: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
  },
};

export default authService;
