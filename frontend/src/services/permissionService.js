/**
 * Permission Service
 * Centralized role-based access control (RBAC) for frontend
 * Matches backend RolePermissions.cs exactly
 */

// ==================== PERMISSION CONSTANTS ====================
export const PERMISSIONS = {
  // Patient Own Data
  VIEW_OWN_PATIENT_DETAILS: 'Patients.ViewOwn',
  UPDATE_OWN_PERSONAL_INFO: 'Patients.UpdateOwnPersonal',

  // Patient Management
  VIEW_PATIENTS: 'Patients.View',
  VIEW_PATIENT_DETAILS: 'Patients.ViewDetails',
  CREATE_PATIENT: 'Patients.Create',
  UPDATE_PATIENT: 'Patients.Update',
  UPDATE_PATIENT_PERSONAL_INFO: 'Patients.UpdatePersonal',
  UPDATE_PATIENT_INSURANCE_INFO: 'Patients.UpdateInsurance',
  DELETE_PATIENT: 'Patients.Delete',

  // Medical History
  VIEW_OWN_MEDICAL_HISTORY: 'MedicalHistory.ViewOwn',
  VIEW_MEDICAL_HISTORY: 'MedicalHistory.View',
  CREATE_MEDICAL_HISTORY: 'MedicalHistory.Create',
  UPDATE_MEDICAL_HISTORY: 'MedicalHistory.Update',

  // Appointments
  VIEW_OWN_APPOINTMENTS: 'Appointments.ViewOwn',
  VIEW_APPOINTMENTS: 'Appointments.View',
  VIEW_APPOINTMENTS_SUMMARY: 'Appointments.ViewSummary',
  CREATE_APPOINTMENT: 'Appointments.Create',
  UPDATE_APPOINTMENT: 'Appointments.Update',
  CANCEL_APPOINTMENT: 'Appointments.Cancel',
  CHECK_IN_APPOINTMENT: 'Appointments.CheckIn',

  // Prescriptions
  VIEW_OWN_PRESCRIPTIONS: 'Prescriptions.ViewOwn',
  VIEW_PRESCRIPTIONS: 'Prescriptions.View',
  CREATE_PRESCRIPTION: 'Prescriptions.Create',
  APPROVE_PRESCRIPTION_REFILL: 'Prescriptions.ApproveRefill',
  REQUEST_PRESCRIPTION_REFILL: 'Prescriptions.RequestRefill',

  // Surgeries
  VIEW_OWN_SURGERIES: 'Surgeries.ViewOwn',
  VIEW_SURGERIES: 'Surgeries.View',
  VIEW_SURGERIES_SUMMARY: 'Surgeries.ViewSummary',
  CREATE_SURGERY: 'Surgeries.Create',
  UPDATE_SURGERY: 'Surgeries.Update',
  PERFORM_SURGERY: 'Surgeries.Perform',

  // Lab Results
  VIEW_OWN_LAB_RESULTS: 'LabResults.ViewOwn',
  VIEW_LAB_RESULTS: 'LabResults.View',
  CREATE_LAB_RESULTS: 'LabResults.Create',

  // Billing
  VIEW_OWN_BILLING: 'Billing.ViewOwn',
  VIEW_BILLING: 'Billing.View',
  VIEW_BILLING_SUMMARY: 'Billing.ViewSummary',
  CREATE_INVOICE: 'Billing.CreateInvoice',
  PROCESS_PAYMENT: 'Billing.ProcessPayment',
  CONFIGURE_BILLING_PRICES: 'Billing.ConfigurePrices',
  VIEW_FINANCIAL_REPORTS: 'Billing.ViewFinancialReports',

  // Rooms & Equipment
  MANAGE_ROOMS: 'Rooms.Manage',
  VIEW_ROOMS: 'Rooms.View',
  MANAGE_EQUIPMENT: 'Equipment.Manage',
  VIEW_EQUIPMENT: 'Equipment.View',

  // System Administration
  MANAGE_USERS: 'Users.Manage',
  VIEW_USERS: 'Users.View',
  VIEW_USER_ACTIVITY: 'Users.ViewActivity',
  RESET_PASSWORDS: 'Users.ResetPassword',
  MANAGE_ROLES: 'Users.ManageRoles',

  VIEW_AUDIT_LOGS: 'Audit.ViewLogs',
  EXPORT_AUDIT_LOGS: 'Audit.ExportLogs',

  VIEW_REPORTS: 'Reports.View',
  VIEW_SYSTEM_REPORTS: 'Reports.ViewSystem',
  VIEW_OPERATIONAL_REPORTS: 'Reports.ViewOperational',
  EXPORT_REPORTS: 'Reports.Export',

  CONFIGURE_SYSTEM: 'System.Configure',
  CONFIGURE_SECURITY: 'System.ConfigureSecurity',
  CONFIGURE_EMAIL_SETTINGS: 'System.ConfigureEmail',
  MANAGE_BACKUPS: 'System.ManageBackups',
  VIEW_SYSTEM_HEALTH: 'System.ViewHealth',
  MANAGE_MAINTENANCE_MODE: 'System.ManageMaintenance',
};

// ==================== ROLE PERMISSIONS MAPPING ====================
const rolePermissions = {
  // ????? CLINICIAN - Medical decision maker
  Clinician: new Set([
    // Patients - Clinical access
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.VIEW_PATIENT_DETAILS,
    PERMISSIONS.UPDATE_PATIENT,

    // Medical History - Full access
    PERMISSIONS.VIEW_MEDICAL_HISTORY,
    PERMISSIONS.CREATE_MEDICAL_HISTORY,
    PERMISSIONS.UPDATE_MEDICAL_HISTORY,

    // Appointments
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.UPDATE_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,

    // Prescriptions - Full control
    PERMISSIONS.VIEW_PRESCRIPTIONS,
    PERMISSIONS.CREATE_PRESCRIPTION,
    PERMISSIONS.APPROVE_PRESCRIPTION_REFILL,

    // Surgeries - Full control
    PERMISSIONS.VIEW_SURGERIES,
    PERMISSIONS.CREATE_SURGERY,
    PERMISSIONS.UPDATE_SURGERY,
    PERMISSIONS.PERFORM_SURGERY,

    // Lab Results
    PERMISSIONS.VIEW_LAB_RESULTS,

    // Reports
    PERMISSIONS.VIEW_REPORTS,
  ],),

  // ????? RECEPTIONIST - Administrative front desk (NO CLINICAL ACCESS)
  Receptionist: new Set([
    // Patients - Basic info only
    PERMISSIONS.VIEW_PATIENTS,
    PERMISSIONS.CREATE_PATIENT,
    PERMISSIONS.UPDATE_PATIENT_PERSONAL_INFO,
    PERMISSIONS.UPDATE_PATIENT_INSURANCE_INFO,

    // Appointments - Full control
    PERMISSIONS.VIEW_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.UPDATE_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,
    PERMISSIONS.CHECK_IN_APPOINTMENT,

    // Billing
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.CREATE_INVOICE,
    PERMISSIONS.PROCESS_PAYMENT,

    // Rooms
    PERMISSIONS.MANAGE_ROOMS,
    PERMISSIONS.VIEW_ROOMS,
  ],),

  // ?? PATIENT - Read-only medical access to own data
  Patient: new Set([
    // Own data
    PERMISSIONS.VIEW_OWN_PATIENT_DETAILS,
    PERMISSIONS.UPDATE_OWN_PERSONAL_INFO,

    // Own appointments
    PERMISSIONS.VIEW_OWN_APPOINTMENTS,
    PERMISSIONS.CREATE_APPOINTMENT,
    PERMISSIONS.CANCEL_APPOINTMENT,

    // Own medical history (READ-ONLY)
    PERMISSIONS.VIEW_OWN_MEDICAL_HISTORY,

    // Own prescriptions
    PERMISSIONS.VIEW_OWN_PRESCRIPTIONS,
    PERMISSIONS.REQUEST_PRESCRIPTION_REFILL,

    // Own surgeries (READ-ONLY)
    PERMISSIONS.VIEW_OWN_SURGERIES,

    // Own lab results (READ-ONLY)
    PERMISSIONS.VIEW_OWN_LAB_RESULTS,

    // Own billing
    PERMISSIONS.VIEW_OWN_BILLING,
  ],),

  // ????? ADMIN - System Administrator (NON-CLINICAL ROLE)
  // ? CAN: System config, security, user management, reports, monitoring
  // ?? CANNOT: Create prescriptions, schedule surgeries, modify diagnoses
  Admin: new Set([
    // User & Role Management
    PERMISSIONS.MANAGE_USERS,
    PERMISSIONS.VIEW_USERS,
    PERMISSIONS.VIEW_USER_ACTIVITY,
    PERMISSIONS.RESET_PASSWORDS,
    PERMISSIONS.MANAGE_ROLES,

    // Security & Audit
    PERMISSIONS.VIEW_AUDIT_LOGS,
    PERMISSIONS.EXPORT_AUDIT_LOGS,
    PERMISSIONS.CONFIGURE_SECURITY,

    // System Configuration
    PERMISSIONS.CONFIGURE_SYSTEM,
    PERMISSIONS.CONFIGURE_EMAIL_SETTINGS,
    PERMISSIONS.MANAGE_BACKUPS,
    PERMISSIONS.VIEW_SYSTEM_HEALTH,
    PERMISSIONS.MANAGE_MAINTENANCE_MODE,

    // Financial Oversight (VIEW ONLY)
    PERMISSIONS.VIEW_BILLING,
    PERMISSIONS.VIEW_BILLING_SUMMARY,
    PERMISSIONS.VIEW_FINANCIAL_REPORTS,
    PERMISSIONS.CONFIGURE_BILLING_PRICES,

    // Resource Management
    PERMISSIONS.MANAGE_ROOMS,
    PERMISSIONS.VIEW_ROOMS,
    PERMISSIONS.MANAGE_EQUIPMENT,
    PERMISSIONS.VIEW_EQUIPMENT,

    // Reporting & Analytics (METADATA ONLY)
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.VIEW_SYSTEM_REPORTS,
    PERMISSIONS.VIEW_OPERATIONAL_REPORTS,
    PERMISSIONS.EXPORT_REPORTS,
    PERMISSIONS.VIEW_APPOINTMENTS_SUMMARY,
    PERMISSIONS.VIEW_SURGERIES_SUMMARY,

    // Patient Data (VIEW LIST ONLY - NO MEDICAL HISTORY)
    PERMISSIONS.VIEW_PATIENTS,
    // ? NOT ViewPatientDetails - Admin cannot see medical history

    // ??? EXPLICITLY EXCLUDED - ZERO CLINICAL AUTHORITY ???
    // ?? ViewPatientDetails, ViewMedicalHistory, CreateMedicalHistory
    // ?? ViewPrescriptions, CreatePrescription, ApprovePrescriptionRefill
    // ?? ViewSurgeries, CreateSurgery, UpdateSurgery, PerformSurgery
    // ?? ViewLabResults, CreateLabResults
    // ?? CheckInAppointment, ProcessPayment (receptionist duties)
  ]),
};

/**
 * Permission Service Class
 */
class PermissionService {
  /**
   * Get current user's role from localStorage
   */
  getCurrentRole() {
    return localStorage.getItem('role');
  }

  /**
   * Check if current user has a specific permission
   * @param {string} permission - Permission constant
   * @returns {boolean}
   */
  hasPermission(permission) {
    const role = this.getCurrentRole();
    if (!role) return false;

    const permissions = rolePermissions[role];
    return permissions ? permissions.has(permission) : false;
  }

  /**
   * Check if current user has ANY of the specified permissions
   * @param {string[]} permissions - Array of permission constants
   * @returns {boolean}
   */
  hasAnyPermission(permissions) {
    return permissions.some((permission) => this.hasPermission(permission));
  }

  /**
   * Check if current user has ALL of the specified permissions
   * @param {string[]} permissions - Array of permission constants
   * @returns {boolean}
   */
  hasAllPermissions(permissions) {
    return permissions.every((permission) => this.hasPermission(permission));
  }

  /**
   * Get all permissions for current user's role
   * @returns {Set<string>}
   */
  getRolePermissions() {
    const role = this.getCurrentRole();
    return rolePermissions[role] || new Set();
  }

  /**
   * Check if current user can view all patients
   * @returns {boolean}
   */
  canViewPatients() {
    return this.hasPermission(PERMISSIONS.VIEW_PATIENTS);
  }

  /**
   * Check if current user can view full patient details (medical history)
   * @returns {boolean}
   */
  canViewPatientDetails() {
    return this.hasPermission(PERMISSIONS.VIEW_PATIENT_DETAILS);
  }

  /**
   * Check if current user can create patients
   * @returns {boolean}
   */
  canCreatePatient() {
    return this.hasPermission(PERMISSIONS.CREATE_PATIENT);
  }

  /**
   * Check if current user can update patients
   * @returns {boolean}
   */
  canUpdatePatient() {
    return this.hasPermission(PERMISSIONS.UPDATE_PATIENT);
  }

  /**
   * Check if current user can create prescriptions
   * @returns {boolean}
   */
  canCreatePrescription() {
    return this.hasPermission(PERMISSIONS.CREATE_PRESCRIPTION);
  }

  /**
   * Check if current user can create surgeries
   * @returns {boolean}
   */
  canCreateSurgery() {
    return this.hasPermission(PERMISSIONS.CREATE_SURGERY);
  }

  /**
   * Check if current user can manage rooms
   * @returns {boolean}
   */
  canManageRooms() {
    return this.hasPermission(PERMISSIONS.MANAGE_ROOMS);
  }

  /**
   * Check if current user can manage billing
   * @returns {boolean}
   */
  canManageBilling() {
    return this.hasPermission(PERMISSIONS.VIEW_BILLING);
  }

  /**
   * Check if current user can check-in patients
   * @returns {boolean}
   */
  canCheckInAppointment() {
    return this.hasPermission(PERMISSIONS.CHECK_IN_APPOINTMENT);
  }

  /**
   * Check if current user can view medical history
   * @returns {boolean}
   */
  canViewMedicalHistory() {
    return this.hasPermission(PERMISSIONS.VIEW_MEDICAL_HISTORY);
  }

  /**
   * Check if current user can create medical history
   * @returns {boolean}
   */
  canCreateMedicalHistory() {
    return this.hasPermission(PERMISSIONS.CREATE_MEDICAL_HISTORY);
  }

  /**
   * Check if current user is a specific role
   * @param {string} role - Role name
   * @returns {boolean}
   */
  isRole(role) {
    return this.getCurrentRole() === role;
  }

  /**
   * Check if current user is Clinician
   * @returns {boolean}
   */
  isClinician() {
    return this.isRole('Clinician');
  }

  /**
   * Check if current user is Receptionist
   * @returns {boolean}
   */
  isReceptionist() {
    return this.isRole('Receptionist');
  }

  /**
   * Check if current user is Patient
   * @returns {boolean}
   */
  isPatient() {
    return this.isRole('Patient');
  }

  /**
   * Check if current user is Admin
   * @returns {boolean}
   */
  isAdmin() {
    return this.isRole('Admin');
  }

  /**
   * Get role display name
   * @param {string} role - Role name
   * @returns {string}
   */
  getRoleDisplayName(role = null) {
    const targetRole = role || this.getCurrentRole();
    const roleNames = {
      Clinician: '????? Clinician (Doctor/Surgeon)',
      Receptionist: '????? Receptionist (Front Desk)',
      Patient: '?? Patient',
      Admin: '????? Administrator',
    };
    return roleNames[targetRole] || targetRole;
  }

  /**
   * Get prohibited actions for current role
   * @returns {string[]}
   */
  getProhibitedActions() {
    const role = this.getCurrentRole();
    const prohibited = {
      Clinician: [
        '?? Manage system users',
        '?? Configure billing prices',
        '?? Manage rooms inventory',
        '?? Process payments',
      ],
      Receptionist: [
        '?? View full medical history',
        '?? Write medical notes',
        '?? Prescribe medications',
        '?? Schedule surgeries',
        '?? View lab interpretations',
      ],
      Patient: [
        '?? Add diagnosis',
        '?? Add prescription',
        '?? Add surgery',
        '?? Modify medical history',
        '?? Upload lab interpretations',
      ],
      Admin: [
        '?? Create prescriptions',
        '?? Schedule surgeries',
        '?? Modify patient diagnoses',
        '?? Perform clinical actions',
        '?? View medical history',
      ],
    };
    return prohibited[role] || [];
  }
}

// Export singleton instance
const permissionService = new PermissionService();
export default permissionService;
