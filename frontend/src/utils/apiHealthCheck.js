/**
 * API Health Check Utility
 * Quick utility to test API connectivity and authentication
 */

import apiClient from '../services/api';
import { HEALTH_CHECK } from '../config/apiEndpoints';

export const apiHealthCheck = {
  /**
   * Check if API is reachable
   * @returns {Promise<boolean>}
   */
  checkConnection: async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}${HEALTH_CHECK}`);
      return response.ok;
    } catch (error) {
      console.error('API connection failed:', error);
      return false;
    }
  },

  /**
   * Check if user is authenticated with valid token
   * @returns {Promise<boolean>}
   */
  checkAuth: async () => {
    try {
      const response = await apiClient.get('/api/auth/me');
      return response.status === 200;
    } catch (error) {
      return false;
    }
  },

  /**
   * Get API status and info
   * @returns {Promise<Object>}
   */
  getStatus: async () => {
    const status = {
      connected: false,
      authenticated: false,
      apiUrl: import.meta.env.VITE_API_BASE_URL,
      token: !!localStorage.getItem('token'),
      user: localStorage.getItem('user'),
      timestamp: new Date().toISOString(),
    };

    try {
      status.connected = await apiHealthCheck.checkConnection();
      if (status.token) {
        status.authenticated = await apiHealthCheck.checkAuth();
      }
    } catch (error) {
      console.error('Status check failed:', error);
    }

    return status;
  },

  /**
   * Run complete diagnostics
   * @returns {Promise<Object>}
   */
  runDiagnostics: async () => {
    console.log('?? Running API Diagnostics...');
    console.log('?'.repeat(50));

    const diagnostics = {
      environment: {
        apiUrl: import.meta.env.VITE_API_BASE_URL,
        mode: import.meta.env.MODE,
        dev: import.meta.env.DEV,
      },
      localStorage: {
        hasToken: !!localStorage.getItem('token'),
        hasUser: !!localStorage.getItem('user'),
        hasRole: !!localStorage.getItem('role'),
        role: localStorage.getItem('role'),
      },
      connectivity: {
        apiReachable: false,
        healthCheck: false,
        authenticated: false,
      },
      errors: [],
    };

    // Test API connection
    try {
      const healthResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}${HEALTH_CHECK}`);
      diagnostics.connectivity.healthCheck = healthResponse.ok;
      diagnostics.connectivity.apiReachable = true;
      console.log('? API is reachable');
    } catch (error) {
      diagnostics.errors.push(`Health check failed: ${error.message}`);
      console.error('? API is not reachable:', error.message);
    }

    // Test authentication
    if (diagnostics.localStorage.hasToken) {
      try {
        const authResponse = await apiClient.get('/api/auth/me');
        diagnostics.connectivity.authenticated = authResponse.status === 200;
        console.log('? Authentication valid');
      } catch (error) {
        diagnostics.errors.push(`Auth check failed: ${error.message}`);
        console.error('? Authentication failed:', error.message);
      }
    } else {
      console.log('??  No token found (not logged in)');
    }

    console.log('?'.repeat(50));
    console.log('?? Diagnostics Results:', diagnostics);

    return diagnostics;
  },

  /**
   * Log API configuration
   */
  logConfig: () => {
    console.group('?? API Configuration');
    console.log('Base URL:', import.meta.env.VITE_API_BASE_URL);
    console.log('Mode:', import.meta.env.MODE);
    console.log('Dev Mode:', import.meta.env.DEV);
    console.log('Token Present:', !!localStorage.getItem('token'));
    console.log('User Role:', localStorage.getItem('role'));
    console.groupEnd();
  },
};

// Add to window for easy access in console
if (import.meta.env.DEV) {
  window.apiHealthCheck = apiHealthCheck;
  console.log('?? API Health Check available as: window.apiHealthCheck');
  console.log('   Try: await window.apiHealthCheck.runDiagnostics()');
}

export default apiHealthCheck;
