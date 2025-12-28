/**
 * Centralized API Services Export
 * Import all services from here for consistent API usage
 */

// Core API client
export { default as apiClient, createQueryString } from './api';

// Services
export { default as authService } from './authService';
export { default as patientsService } from './patientsService';
export { default as appointmentsService } from './appointmentsService';
export { default as surgeriesService } from './surgeriesService';
export { default as prescriptionsService } from './prescriptionsService';
export { default as medicalHistoryService } from './medicalHistoryService';
export { default as roomsService } from './roomsService';
export { default as equipmentService } from './equipmentService';
export { default as reportsService } from './reportsService';
export { default as permissionService, PERMISSIONS } from './permissionService';

// Utilities
export { default as errorHandler } from '../utils/errorHandler';

// API Endpoints
export { default as apiEndpoints } from '../config/apiEndpoints';

// Convenient auth functions
import authService from './authService';

export const {
  login,
  register,
  logout,
  getCurrentUser,
  refreshToken,
  changePassword,
  isAuthenticated,
  getUser,
  getRole,
  hasRole,
  hasAnyRole,
  clearAuth,
} = authService;
