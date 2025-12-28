/**
 * API Endpoints Configuration
 * Central location for all API endpoint definitions
 */

// Base API route
const API_BASE = '/api';

// Authentication Endpoints
export const AUTH_ENDPOINTS = {
  LOGIN: `${API_BASE}/auth/login`,
  REGISTER: `${API_BASE}/auth/register`,
  LOGOUT: `${API_BASE}/auth/logout`,
  ME: `${API_BASE}/auth/me`,
  REFRESH: `${API_BASE}/auth/refresh`,
  CHANGE_PASSWORD: `${API_BASE}/auth/change-password`,
  RESET_PASSWORD: `${API_BASE}/auth/reset-password`,
  CONFIRM_RESET: `${API_BASE}/auth/confirm-reset`,
};

// Patients Endpoints
export const PATIENTS_ENDPOINTS = {
  BASE: `${API_BASE}/patients`,
  BY_ID: (id) => `${API_BASE}/patients/${id}`,
  APPOINTMENTS: (id) => `${API_BASE}/patients/${id}/appointments`,
  MEDICAL_HISTORY: (id) => `${API_BASE}/patients/${id}/medical-history`,
  PRESCRIPTIONS: (id) => `${API_BASE}/patients/${id}/prescriptions`,
  LAB_RESULTS: (id) => `${API_BASE}/patients/${id}/lab-results`,
  BILLING: (id) => `${API_BASE}/patients/${id}/billing`,
  SEARCH: `${API_BASE}/patients/search`,
};

// Appointments Endpoints
export const APPOINTMENTS_ENDPOINTS = {
  BASE: `${API_BASE}/appointments`,
  BY_ID: (id) => `${API_BASE}/appointments/${id}`,
  STATUS: (id) => `${API_BASE}/appointments/${id}/status`,
  CHECKIN: (id) => `${API_BASE}/appointments/${id}/checkin`,
  CANCEL: (id) => `${API_BASE}/appointments/${id}/cancel`,
  TODAY: `${API_BASE}/appointments/today`,
  UPCOMING: `${API_BASE}/appointments/upcoming`,
  STATISTICS: `${API_BASE}/appointments/statistics`,
  AVAILABLE_SLOTS: `${API_BASE}/appointments/available-slots`,
};

// Surgeries Endpoints
export const SURGERIES_ENDPOINTS = {
  BASE: `${API_BASE}/surgeries`,
  BY_ID: (id) => `${API_BASE}/surgeries/${id}`,
  STATUS: (id) => `${API_BASE}/surgeries/${id}/status`,
  ASSIGN_STAFF: (id) => `${API_BASE}/surgeries/${id}/assign-staff`,
  START: (id) => `${API_BASE}/surgeries/${id}/start`,
  COMPLETE: (id) => `${API_BASE}/surgeries/${id}/complete`,
  SCHEDULED: `${API_BASE}/surgeries/scheduled`,
  TODAY: `${API_BASE}/surgeries/today`,
  STATISTICS: `${API_BASE}/surgeries/statistics`,
};

// Prescriptions Endpoints
export const PRESCRIPTIONS_ENDPOINTS = {
  BASE: `${API_BASE}/prescriptions`,
  BY_ID: (id) => `${API_BASE}/prescriptions/${id}`,
  STATUS: (id) => `${API_BASE}/prescriptions/${id}/status`,
  REFILL: (id) => `${API_BASE}/prescriptions/${id}/refill`,
  ACTIVE: (patientId) => `${API_BASE}/prescriptions/active?patientId=${patientId}`,
};

// Medical History Endpoints
export const MEDICAL_HISTORY_ENDPOINTS = {
  BASE: `${API_BASE}/medical-history`,
  BY_ID: (id) => `${API_BASE}/medical-history/${id}`,
  BY_PATIENT: (patientId) => `${API_BASE}/medical-history/patient/${patientId}`,
  CONDITIONS: (patientId) => `${API_BASE}/medical-history/patient/${patientId}/conditions`,
  ALLERGIES: (patientId) => `${API_BASE}/medical-history/patient/${patientId}/allergies`,
};

// Rooms Endpoints
export const ROOMS_ENDPOINTS = {
  BASE: `${API_BASE}/rooms`,
  BY_ID: (id) => `${API_BASE}/rooms/${id}`,
  AVAILABLE: `${API_BASE}/rooms/available`,
  STATUS: (id) => `${API_BASE}/rooms/${id}/status`,
  SCHEDULE: (id) => `${API_BASE}/rooms/${id}/schedule`,
};

// Equipment Endpoints
export const EQUIPMENT_ENDPOINTS = {
  BASE: `${API_BASE}/equipment`,
  BY_ID: (id) => `${API_BASE}/equipment/${id}`,
  AVAILABLE: `${API_BASE}/equipment/available`,
  MAINTENANCE: (id) => `${API_BASE}/equipment/${id}/maintenance`,
  STATUS: (id) => `${API_BASE}/equipment/${id}/status`,
};

// Reports Endpoints
export const REPORTS_ENDPOINTS = {
  DASHBOARD: `${API_BASE}/reports/dashboard`,
  PATIENTS: `${API_BASE}/reports/patients`,
  APPOINTMENTS: `${API_BASE}/reports/appointments`,
  SURGERIES: `${API_BASE}/reports/surgeries`,
  BILLING: `${API_BASE}/reports/billing`,
  REVENUE: `${API_BASE}/reports/revenue`,
  EXPORT: `${API_BASE}/reports/export`,
};

// Billing Endpoints
export const BILLING_ENDPOINTS = {
  BASE: `${API_BASE}/billing`,
  BY_ID: (id) => `${API_BASE}/billing/${id}`,
  PATIENT: (patientId) => `${API_BASE}/billing/patient/${patientId}`,
  OUTSTANDING: `${API_BASE}/billing/outstanding`,
  PAYMENT: (id) => `${API_BASE}/billing/${id}/payment`,
  INVOICE: (id) => `${API_BASE}/billing/${id}/invoice`,
};

// Lab Results Endpoints
export const LAB_RESULTS_ENDPOINTS = {
  BASE: `${API_BASE}/lab-results`,
  BY_ID: (id) => `${API_BASE}/lab-results/${id}`,
  PATIENT: (patientId) => `${API_BASE}/lab-results/patient/${patientId}`,
  PENDING: `${API_BASE}/lab-results/pending`,
  UPLOAD: (id) => `${API_BASE}/lab-results/${id}/upload`,
};

// Encounters Endpoints
export const ENCOUNTERS_ENDPOINTS = {
  BASE: `${API_BASE}/encounters`,
  BY_ID: (id) => `${API_BASE}/encounters/${id}`,
  PATIENT: (patientId) => `${API_BASE}/encounters/patient/${patientId}`,
  RECENT: `${API_BASE}/encounters/recent`,
};

// Insurance Endpoints
export const INSURANCE_ENDPOINTS = {
  BASE: `${API_BASE}/insurance`,
  BY_ID: (id) => `${API_BASE}/insurance/${id}`,
  PATIENT: (patientId) => `${API_BASE}/insurance/patient/${patientId}`,
  VERIFY: (id) => `${API_BASE}/insurance/${id}/verify`,
};

// Files Endpoints
export const FILES_ENDPOINTS = {
  UPLOAD: `${API_BASE}/files/upload`,
  DOWNLOAD: (id) => `${API_BASE}/files/${id}/download`,
  DELETE: (id) => `${API_BASE}/files/${id}`,
};

// Health Check
export const HEALTH_CHECK = '/health';

// Export all endpoints
export default {
  AUTH_ENDPOINTS,
  PATIENTS_ENDPOINTS,
  APPOINTMENTS_ENDPOINTS,
  SURGERIES_ENDPOINTS,
  PRESCRIPTIONS_ENDPOINTS,
  MEDICAL_HISTORY_ENDPOINTS,
  ROOMS_ENDPOINTS,
  EQUIPMENT_ENDPOINTS,
  REPORTS_ENDPOINTS,
  BILLING_ENDPOINTS,
  LAB_RESULTS_ENDPOINTS,
  ENCOUNTERS_ENDPOINTS,
  INSURANCE_ENDPOINTS,
  FILES_ENDPOINTS,
  HEALTH_CHECK,
};
