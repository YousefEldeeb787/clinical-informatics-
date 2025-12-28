/**
 * RBAC Permissions System
 * 
 * Based on real-world healthcare standards:
 * - HIMSS (Healthcare Information and Management Systems Society)
 * - HL7 FHIR ownership models
 * - HIPAA minimum-necessary access principle
 * 
 * Three roles only: Clinician (Doctor), Receptionist, Patient
 */

// Role Constants
export const ROLES = {
  CLINICIAN: 'Clinician',
  RECEPTIONIST: 'Receptionist',
  PATIENT: 'Patient',
};

// Permission Actions
export const PERMISSIONS = {
  // Authentication
  LOGIN: 'auth:login',
  REGISTER: 'auth:register',
  CHANGE_PASSWORD: 'auth:change_password',
  
  // Patient Management
  VIEW_ALL_PATIENTS: 'patients:view_all',
  VIEW_PATIENT_DETAILS: 'patients:view_details',
  VIEW_OWN_PROFILE: 'patients:view_own',
  CREATE_PATIENT: 'patients:create',
  UPDATE_PATIENT_DEMOGRAPHICS: 'patients:update_demographics',
  UPDATE_PATIENT_CLINICAL: 'patients:update_clinical',
  UPDATE_OWN_PROFILE: 'patients:update_own',
  DELETE_PATIENT: 'patients:delete',
  
  // Appointments
  VIEW_ALL_APPOINTMENTS: 'appointments:view_all',
  VIEW_OWN_APPOINTMENTS: 'appointments:view_own',
  CREATE_APPOINTMENT: 'appointments:create',
  UPDATE_APPOINTMENT: 'appointments:update',
  CANCEL_APPOINTMENT: 'appointments:cancel',
  CHECKIN_APPOINTMENT: 'appointments:checkin',
  VIEW_APPOINTMENT_STATS: 'appointments:stats',
  
  // Medical History
  VIEW_MEDICAL_HISTORY: 'medical_history:view',
  VIEW_OWN_MEDICAL_HISTORY: 'medical_history:view_own',
  CREATE_MEDICAL_HISTORY: 'medical_history:create',
  UPDATE_MEDICAL_HISTORY: 'medical_history:update',
  VERIFY_MEDICAL_HISTORY: 'medical_history:verify',
  DELETE_MEDICAL_HISTORY: 'medical_history:delete',
  
  // Prescriptions
  VIEW_ALL_PRESCRIPTIONS: 'prescriptions:view_all',
  VIEW_OWN_PRESCRIPTIONS: 'prescriptions:view_own',
  CREATE_PRESCRIPTION: 'prescriptions:create',
  UPDATE_PRESCRIPTION: 'prescriptions:update',
  REQUEST_REFILL: 'prescriptions:request_refill',
  
  // Encounters
  VIEW_ALL_ENCOUNTERS: 'encounters:view_all',
  VIEW_OWN_ENCOUNTERS: 'encounters:view_own',
  CREATE_ENCOUNTER: 'encounters:create',
  UPDATE_ENCOUNTER: 'encounters:update',
  SIGN_ENCOUNTER: 'encounters:sign',
  
  // Lab Results
  VIEW_ALL_LAB_RESULTS: 'lab_results:view_all',
  VIEW_OWN_LAB_RESULTS: 'lab_results:view_own',
  CREATE_LAB_RESULT: 'lab_results:create',
  
  // Surgeries
  VIEW_ALL_SURGERIES: 'surgeries:view_all',
  VIEW_OWN_SURGERIES: 'surgeries:view_own',
  CREATE_SURGERY: 'surgeries:create',
  UPDATE_SURGERY: 'surgeries:update',
  ASSIGN_SURGERY_STAFF: 'surgeries:assign_staff',
  START_SURGERY: 'surgeries:start',
  COMPLETE_SURGERY: 'surgeries:complete',
  
  // Billing & Invoices
  VIEW_ALL_INVOICES: 'billing:view_all',
  VIEW_OWN_INVOICES: 'billing:view_own',
  CREATE_INVOICE: 'billing:create',
  RECORD_PAYMENT: 'billing:record_payment',
  VIEW_REVENUE_REPORT: 'billing:revenue_report',
  
  // Insurance
  VIEW_ALL_INSURANCE: 'insurance:view_all',
  VIEW_OWN_INSURANCE: 'insurance:view_own',
  CREATE_INSURANCE: 'insurance:create',
  UPDATE_INSURANCE: 'insurance:update',
  
  // Rooms Management
  VIEW_ROOMS: 'rooms:view',
  CREATE_ROOM: 'rooms:create',
  UPDATE_ROOM_STATUS: 'rooms:update_status',
  
  // Equipment Management
  VIEW_EQUIPMENT: 'equipment:view',
  CREATE_EQUIPMENT: 'equipment:create',
  
  // Reports & Analytics
  VIEW_DASHBOARD_STATS: 'reports:dashboard_stats',
  VIEW_APPOINTMENT_STATS: 'reports:appointment_stats',
  VIEW_SURGERY_STATS: 'reports:surgery_stats',
  EXPORT_PATIENTS: 'reports:export_patients',
  EXPORT_APPOINTMENTS: 'reports:export_appointments',
  
  // File Management
  UPLOAD_FILE: 'files:upload',
  DOWNLOAD_FILE: 'files:download',
  DELETE_FILE: 'files:delete',
};

/**
 * Role-Permission Mapping
 * 
 * Healthcare RBAC Rules:
 * - Clinician: Owns all CLINICAL data (diagnosis, prescriptions, encounters, surgeries, lab interpretation)
 * - Receptionist: Owns ADMINISTRATIVE workflows (scheduling, billing, insurance, patient registration)
 * - Patient: SELF-SERVICE + READ-ONLY medical access
 */
export const ROLE_PERMISSIONS = {
  [ROLES.CLINICIAN]: [
    // Authentication
    PERMISSIONS.LOGIN,
    PERMISSIONS.CHANGE_PASSWORD,
    
    // Patient Management - Full clinical access
    PERMISSIONS.VIEW_ALL_PATIENTS,
    PERMISSIONS.VIEW_PATIENT_DETAILS,
    PERMISSIONS.UPDATE_PATIENT_CLINICAL,
    
    // Appointments - Clinical management
    PERMISSIONS.VIEW_ALL_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT, // For follow-ups
    PERMISSIONS.UPDATE_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.VIEW_APPOINTMENT_STATS,
    
    // Medical History - Full access
    PERMISSIONS.VIEW_MEDICAL_HISTORY,
    PERMISSIONS.CREATE_MEDICAL_HISTORY,
    PERMISSIONS.UPDATE_MEDICAL_HISTORY,
    PERMISSIONS.VERIFY_MEDICAL_HISTORY,
    PERMISSIONS.DELETE_MEDICAL_HISTORY,
    
    // Prescriptions - Only clinicians can prescribe
    PERMISSIONS.VIEW_ALL_PRESCRIPTIONS,
    PERMISSIONS.CREATE_PRESCRIPTION,
    PERMISSIONS.UPDATE_PRESCRIPTION,
    
    // Encounters - Clinical documentation
    PERMISSIONS.VIEW_ALL_ENCOUNTERS,
    PERMISSIONS.CREATE_ENCOUNTER,
    PERMISSIONS.UPDATE_ENCOUNTER,
    PERMISSIONS.SIGN_ENCOUNTER,
    
    // Lab Results - Clinical interpretation
    PERMISSIONS.VIEW_ALL_LAB_RESULTS,
    PERMISSIONS.CREATE_LAB_RESULT,
    
    // Surgeries - Surgical procedures
    PERMISSIONS.VIEW_ALL_SURGERIES,
    PERMISSIONS.CREATE_SURGERY,
    PERMISSIONS.UPDATE_SURGERY,
    PERMISSIONS.ASSIGN_SURGERY_STAFF,
    PERMISSIONS.START_SURGERY,
    PERMISSIONS.COMPLETE_SURGERY,
    
    // No billing access (administrative)
    
    // Rooms - View only for availability
    PERMISSIONS.VIEW_ROOMS,
    
    // Equipment - View only
    PERMISSIONS.VIEW_EQUIPMENT,
    
    // Reports - Clinical analytics
    PERMISSIONS.VIEW_DASHBOARD_STATS,
    PERMISSIONS.VIEW_APPOINTMENT_STATS,
    PERMISSIONS.VIEW_SURGERY_STATS,
    
    // File Management - Clinical documents
    PERMISSIONS.UPLOAD_FILE,
    PERMISSIONS.DOWNLOAD_FILE,
    PERMISSIONS.DELETE_FILE,
  ],
  
  [ROLES.RECEPTIONIST]: [
    // Authentication
    PERMISSIONS.LOGIN,
    PERMISSIONS.CHANGE_PASSWORD,
    
    // Patient Management - Demographics & registration ONLY (no clinical data)
    PERMISSIONS.VIEW_ALL_PATIENTS,
    PERMISSIONS.VIEW_PATIENT_DETAILS, // Demographics + Insurance only
    PERMISSIONS.CREATE_PATIENT,
    PERMISSIONS.UPDATE_PATIENT_DEMOGRAPHICS,
    
    // Appointments - Administrative scheduling
    PERMISSIONS.VIEW_ALL_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.UPDATE_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.CHECKIN_APPOINTMENT, // Front desk duty
    PERMISSIONS.VIEW_APPOINTMENT_STATS,
    
    // NO medical history access
    
    // NO prescription access (medical data)
    
    // NO encounters access
    
    // NO lab results access
    
    // Surgeries - Schedule metadata only (no clinical details)
    PERMISSIONS.VIEW_ALL_SURGERIES, // For scheduling coordination
    
    // Billing & Invoices - Financial management
    PERMISSIONS.VIEW_ALL_INVOICES,
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.RECORD_PAYMENT,
    PERMISSIONS.VIEW_REVENUE_REPORT,
    
    // Insurance - Administrative
    PERMISSIONS.VIEW_ALL_INSURANCE,
    PERMISSIONS.CREATE_INSURANCE,
    PERMISSIONS.UPDATE_INSURANCE,
    
    // Rooms - Facility management
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.UPDATE_ROOM_STATUS,
    
    // Equipment - Facility management
    PERMISSIONS.VIEW_EQUIPMENT,
    
    // Reports - Administrative analytics
    PERMISSIONS.VIEW_DASHBOARD_STATS,
    PERMISSIONS.VIEW_APPOINTMENT_STATS,
    PERMISSIONS.EXPORT_PATIENTS,
    PERMISSIONS.EXPORT_APPOINTMENTS,
    
    // File Management - Administrative documents
    PERMISSIONS.UPLOAD_FILE,
    PERMISSIONS.DOWNLOAD_FILE,
  ],
  
  [ROLES.PATIENT]: [
    // Authentication
    PERMISSIONS.LOGIN,
    PERMISSIONS.REGISTER, // Self-registration
    PERMISSIONS.CHANGE_PASSWORD,
    
    // Patient Management - Own profile only
    PERMISSIONS.VIEW_OWN_PROFILE,
    PERMISSIONS.UPDATE_OWN_PROFILE,
    
    // Appointments - Self-service
    PERMISSIONS.VIEW_OWN_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT, // Request booking
    PERMISSIONS.CANCEL_APPOINTMENT, // Own appointments only
    
    // Medical History - Read own + report symptoms
    PERMISSIONS.VIEW_OWN_MEDICAL_HISTORY,
    PERMISSIONS.CREATE_MEDICAL_HISTORY, // Patient-reported data (requires doctor verification)
    
    // Prescriptions - View own
    PERMISSIONS.VIEW_OWN_PRESCRIPTIONS,
    PERMISSIONS.REQUEST_REFILL,
    
    // Encounters - Read-only own encounters
    PERMISSIONS.VIEW_OWN_ENCOUNTERS,
    
    // Lab Results - View own
    PERMISSIONS.VIEW_OWN_LAB_RESULTS,
    
    // Surgeries - View own
    PERMISSIONS.VIEW_OWN_SURGERIES,
    
    // Billing - View own invoices
    PERMISSIONS.VIEW_OWN_INVOICES,
    
    // Insurance - View & submit own
    PERMISSIONS.VIEW_OWN_INSURANCE,
    PERMISSIONS.CREATE_INSURANCE, // Self-submitted, pending verification
    
    // Rooms - View own room (if admitted)
    PERMISSIONS.VIEW_ROOMS,
    
    // File Management - Own documents
    PERMISSIONS.UPLOAD_FILE,
    PERMISSIONS.DOWNLOAD_FILE,
  ],
};

/**
 * Check if a role has a specific permission
 * @param {string} role - User role (Clinician, Receptionist, Patient)
 * @param {string} permission - Permission to check
 * @returns {boolean}
 */
export const hasPermission = (role, permission) => {
  if (!role || !permission) return false;
  
  const rolePermissions = ROLE_PERMISSIONS[role];
  if (!rolePermissions) return false;
  
  return rolePermissions.includes(permission);
};

/**
 * Check if a role has any of the specified permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const hasAnyPermission = (role, permissions) => {
  return permissions.some(permission => hasPermission(role, permission));
};

/**
 * Check if a role has all of the specified permissions
 * @param {string} role - User role
 * @param {string[]} permissions - Array of permissions
 * @returns {boolean}
 */
export const hasAllPermissions = (role, permissions) => {
  return permissions.every(permission => hasPermission(role, permission));
};

/**
 * Get all permissions for a role
 * @param {string} role - User role
 * @returns {string[]}
 */
export const getRolePermissions = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};

/**
 * Data Access Rules
 * Determines what data fields a role can view/edit
 */
export const DATA_ACCESS = {
  PATIENT_FIELDS: {
    [ROLES.CLINICIAN]: {
      view: ['all'], // Full access to all patient data
      edit: ['medical_history', 'clinical_notes', 'diagnoses', 'allergies', 'conditions'],
    },
    [ROLES.RECEPTIONIST]: {
      view: ['demographics', 'contact', 'insurance', 'billing'], // No clinical data
      edit: ['demographics', 'contact', 'insurance'],
    },
    [ROLES.PATIENT]: {
      view: ['all'], // Can see own full record
      edit: ['contact', 'emergency_contact', 'insurance'], // Limited self-edit
    },
  },
};

export default {
  ROLES,
  PERMISSIONS,
  ROLE_PERMISSIONS,
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  getRolePermissions,
  DATA_ACCESS,
};
