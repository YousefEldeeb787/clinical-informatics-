// Authentication utilities
import { hasPermission as checkPermission, ROLES } from './permissions';

export const getCurrentUser = () => {
  const userStr = localStorage.getItem("currentUser");
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
};

export const getCurrentRole = () => {
  return localStorage.getItem("role") || null;
};

export const isAuthenticated = () => {
  return localStorage.getItem("auth") === "true" && localStorage.getItem("token") !== null;
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const hasRole = (role) => {
  return getCurrentRole() === role;
};

/**
 * Check if current user has a specific permission
 * @param {string} permission - Permission to check (use PERMISSIONS constants)
 * @returns {boolean}
 */
export const hasPermission = (permission) => {
  const role = getCurrentRole();
  if (!role || !permission) return false;
  
  return checkPermission(role, permission);
};

/**
 * Check if current user is a Clinician (Doctor)
 */
export const isClinician = () => {
  return getCurrentRole() === ROLES.CLINICIAN;
};

/**
 * Check if current user is a Receptionist
 */
export const isReceptionist = () => {
  return getCurrentRole() === ROLES.RECEPTIONIST;
};

/**
 * Check if current user is a Patient
 */
export const isPatient = () => {
  return getCurrentRole() === ROLES.PATIENT;
};

/**
 * Set authentication data
 */
export const setAuthData = (token, user, role) => {
  localStorage.setItem("auth", "true");
  localStorage.setItem("token", token);
  localStorage.setItem("currentUser", JSON.stringify(user));
  localStorage.setItem("role", role);
};

/**
 * Clear authentication data
 */
export const clearAuthData = () => {
  localStorage.removeItem("auth");
  localStorage.removeItem("token");
  localStorage.removeItem("currentUser");
  localStorage.removeItem("role");
};

/**
 * Logout user
 */
export const logout = () => {
  clearAuthData();
  window.location.href = "/login";
};

/**
 * Get user initials for avatar
 */
export const getUserInitials = () => {
  const user = getCurrentUser();
  if (!user || !user.firstName) return "?";
  
  const firstInitial = user.firstName.charAt(0).toUpperCase();
  const lastInitial = user.lastName ? user.lastName.charAt(0).toUpperCase() : "";
  
  return firstInitial + lastInitial;
};

/**
 * Get user full name
 */
export const getUserFullName = () => {
  const user = getCurrentUser();
  if (!user) return "Unknown User";
  
  return `${user.firstName || ""} ${user.lastName || ""}`.trim();
};

/**
 * Get role display name
 */
export const getRoleDisplayName = (role) => {
  const roleNames = {
    [ROLES.CLINICIAN]: "Doctor",
    [ROLES.RECEPTIONIST]: "Receptionist",
    [ROLES.PATIENT]: "Patient",
  };
  
  return roleNames[role] || role;
};

