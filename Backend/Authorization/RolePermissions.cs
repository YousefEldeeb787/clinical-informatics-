namespace ClinicSystemBackend.Authorization
{
    /// <summary>
    /// Centralized role permissions mapping based on real-world clinic requirements
    /// Enforces strict RBAC for Clinician, Receptionist, Patient, and Admin roles
    /// </summary>
    public static class RolePermissions
    {
        // ==================== PATIENT PERMISSIONS ====================
        public const string ViewOwnPatientDetails = "Patients.ViewOwn";
        public const string UpdateOwnPersonalInfo = "Patients.UpdateOwnPersonal";
        
        // ==================== PATIENT MANAGEMENT PERMISSIONS ====================
        public const string ViewPatients = "Patients.View";
        public const string ViewPatientDetails = "Patients.ViewDetails";
        public const string CreatePatient = "Patients.Create";
        public const string UpdatePatient = "Patients.Update";
        public const string UpdatePatientPersonalInfo = "Patients.UpdatePersonal";
        public const string UpdatePatientInsuranceInfo = "Patients.UpdateInsurance";
        public const string DeletePatient = "Patients.Delete";
        
        // ==================== MEDICAL HISTORY PERMISSIONS ====================
        public const string ViewOwnMedicalHistory = "MedicalHistory.ViewOwn";
        public const string ViewMedicalHistory = "MedicalHistory.View";
        public const string CreateMedicalHistory = "MedicalHistory.Create";
        public const string UpdateMedicalHistory = "MedicalHistory.Update";
        
        // ==================== APPOINTMENTS PERMISSIONS ====================
        public const string ViewOwnAppointments = "Appointments.ViewOwn";
        public const string ViewAppointments = "Appointments.View";
        public const string ViewAppointmentsSummary = "Appointments.ViewSummary";
        public const string CreateAppointment = "Appointments.Create";
        public const string UpdateAppointment = "Appointments.Update";
        public const string CancelAppointment = "Appointments.Cancel";
        public const string CheckInAppointment = "Appointments.CheckIn";
        
        // ==================== PRESCRIPTIONS PERMISSIONS ====================
        public const string ViewOwnPrescriptions = "Prescriptions.ViewOwn";
        public const string ViewPrescriptions = "Prescriptions.View";
        public const string CreatePrescription = "Prescriptions.Create";
        public const string ApprovePrescriptionRefill = "Prescriptions.ApproveRefill";
        public const string RequestPrescriptionRefill = "Prescriptions.RequestRefill";
        
        // ==================== SURGERIES PERMISSIONS ====================
        public const string ViewOwnSurgeries = "Surgeries.ViewOwn";
        public const string ViewSurgeries = "Surgeries.View";
        public const string ViewSurgeriesSummary = "Surgeries.ViewSummary";
        public const string CreateSurgery = "Surgeries.Create";
        public const string UpdateSurgery = "Surgeries.Update";
        public const string PerformSurgery = "Surgeries.Perform";
        
        // ==================== LAB RESULTS PERMISSIONS ====================
        public const string ViewOwnLabResults = "LabResults.ViewOwn";
        public const string ViewLabResults = "LabResults.View";
        public const string CreateLabResults = "LabResults.Create";
        
        // ==================== BILLING PERMISSIONS ====================
        public const string ViewOwnBilling = "Billing.ViewOwn";
        public const string ViewBilling = "Billing.View";
        public const string ViewBillingSummary = "Billing.ViewSummary";
        public const string CreateInvoice = "Billing.CreateInvoice";
        public const string ProcessPayment = "Billing.ProcessPayment";
        public const string ConfigureBillingPrices = "Billing.ConfigurePrices";
        public const string ViewFinancialReports = "Billing.ViewFinancialReports";
        
        // ==================== ROOMS & EQUIPMENT PERMISSIONS ====================
        public const string ManageRooms = "Rooms.Manage";
        public const string ViewRooms = "Rooms.View";
        public const string ManageEquipment = "Equipment.Manage";
        public const string ViewEquipment = "Equipment.View";
        
        // ==================== SYSTEM ADMINISTRATION PERMISSIONS ====================
        public const string ManageUsers = "Users.Manage";
        public const string ViewUsers = "Users.View";
        public const string ViewUserActivity = "Users.ViewActivity";
        public const string ResetPasswords = "Users.ResetPassword";
        public const string ManageRoles = "Users.ManageRoles";
        
        public const string ViewAuditLogs = "Audit.ViewLogs";
        public const string ExportAuditLogs = "Audit.ExportLogs";
        
        public const string ViewReports = "Reports.View";
        public const string ViewSystemReports = "Reports.ViewSystem";
        public const string ViewOperationalReports = "Reports.ViewOperational";
        public const string ExportReports = "Reports.Export";
        
        public const string ConfigureSystem = "System.Configure";
        public const string ConfigureSecurity = "System.ConfigureSecurity";
        public const string ConfigureEmailSettings = "System.ConfigureEmail";
        public const string ManageBackups = "System.ManageBackups";
        public const string ViewSystemHealth = "System.ViewHealth";
        public const string ManageMaintenanceMode = "System.ManageMaintenance";
        
        /// <summary>
        /// Role-to-Permissions mapping
        /// </summary>
        public static readonly Dictionary<string, HashSet<string>> Permissions = new()
        {
            // ????? CLINICIAN (Doctor / Surgeon) - Medical decision maker
            // ? CAN: Diagnose, prescribe, schedule surgeries, write medical notes
            // ?? CANNOT: Manage users, configure billing, manage rooms, process payments
            ["Clinician"] = new HashSet<string>
            {
                // Patients - Full clinical access
                ViewPatients,
                ViewPatientDetails,
                UpdatePatient, // Can update medical info
                
                // Medical History - Full access (diagnose, write notes)
                ViewMedicalHistory,
                CreateMedicalHistory,
                UpdateMedicalHistory,
                
                // Appointments - View and manage
                ViewAppointments,
                CreateAppointment,
                UpdateAppointment,
                CancelAppointment,
                
                // Prescriptions - Full control (prescribe medications)
                ViewPrescriptions,
                CreatePrescription,
                ApprovePrescriptionRefill,
                
                // Surgeries - Full control (schedule & perform)
                ViewSurgeries,
                CreateSurgery,
                UpdateSurgery,
                PerformSurgery,
                
                // Lab Results - View and interpret
                ViewLabResults,
                
                // Reports - Medical reports
                ViewReports
                
                // ? EXPLICITLY EXCLUDED:
                // - ManageUsers (cannot manage system users)
                // - ConfigureBillingPrices (cannot configure billing prices)
                // - ManageRooms (cannot manage rooms inventory)
                // - ProcessPayment (cannot process payments)
                // - ConfigureSystem (cannot configure system)
            },
            
            // ????? RECEPTIONIST - Administrative front desk (NO CLINICAL ACCESS)
            // ? CAN: Register patients, schedule appointments, manage billing, assign rooms
            // ?? CANNOT: View full medical history, prescribe, schedule surgeries, view lab interpretations
            ["Receptionist"] = new HashSet<string>
            {
                // Patients - Registration and basic info ONLY
                ViewPatients, // Basic info only (name, contact, insurance)
                CreatePatient, // Register new patients
                UpdatePatientPersonalInfo, // Personal info only
                UpdatePatientInsuranceInfo, // Insurance info only
                
                // Appointments - Full scheduling control
                ViewAppointments,
                CreateAppointment,
                UpdateAppointment,
                CancelAppointment,
                CheckInAppointment, // Manage check-in/check-out
                
                // Billing - Financial operations
                ViewBilling,
                CreateInvoice,
                ProcessPayment,
                
                // Rooms - Manage availability
                ManageRooms,
                ViewRooms
                
                // ? EXPLICITLY EXCLUDED (Critical - No Clinical Access):
                // - ViewPatientDetails (no full medical history)
                // - ViewMedicalHistory (no medical notes)
                // - CreateMedicalHistory (cannot write medical notes)
                // - CreatePrescription (cannot prescribe)
                // - CreateSurgery (cannot schedule surgeries)
                // - ViewLabResults (no lab interpretations)
            },
            
            // ?? PATIENT - Self-access only (Read-only medical data)
            // ? CAN: View own records, request appointments, request refills, update personal info
            // ?? CANNOT: Add diagnosis, create prescriptions, modify medical history
            ["Patient"] = new HashSet<string>
            {
                // Own data only - Read access
                ViewOwnPatientDetails, // Own record only
                UpdateOwnPersonalInfo, // Personal info only (not medical)
                
                // Appointments - View and request own
                ViewOwnAppointments, // Own appointments only
                CreateAppointment, // Request appointment
                CancelAppointment, // Cancel own appointments only
                
                // Medical History - View own only (READ-ONLY)
                ViewOwnMedicalHistory, // Own history only (cannot add/modify)
                
                // Prescriptions - View and request refill
                ViewOwnPrescriptions, // Own prescriptions only
                RequestPrescriptionRefill, // Request refill only
                
                // Surgeries - View own (READ-ONLY)
                ViewOwnSurgeries, // Own surgeries only
                
                // Lab Results - View own (READ-ONLY)
                ViewOwnLabResults, // Own results only
                
                // Billing - View own
                ViewOwnBilling // Own billing only
                
                // ? EXPLICITLY EXCLUDED (Critical - No Medical Modification):
                // - CreateMedicalHistory (cannot add diagnosis)
                // - UpdateMedicalHistory (cannot modify medical history)
                // - CreatePrescription (cannot create prescriptions)
                // - CreateSurgery (cannot add surgery)
                // - CreateLabResults (cannot upload lab results)
            },
            
            // ????? ADMIN - System Administrator (NON-CLINICAL ROLE)
            // ? CAN: System config, security, user management, reports, monitoring
            // ?? CANNOT: Create prescriptions, schedule surgeries, modify diagnoses, perform clinical actions
            // ?? Admin ? Medical staff | Admin = IT + Operations Manager
            ["Admin"] = new HashSet<string>
            {
                // ==================== USER & ROLE MANAGEMENT ====================
                ManageUsers,          // Create, update, delete users
                ViewUsers,            // View all users
                ViewUserActivity,     // View user activity logs
                ResetPasswords,       // Reset user passwords
                ManageRoles,          // Assign/change user roles
                
                // ==================== SECURITY & AUDIT ====================
                ViewAuditLogs,        // View full audit trail
                ExportAuditLogs,      // Export audit reports
                ConfigureSecurity,    // JWT, CORS, password policies
                
                // ==================== SYSTEM CONFIGURATION ====================
                ConfigureSystem,           // System settings
                ConfigureEmailSettings,    // SMTP configuration
                ManageBackups,            // Database backups
                ViewSystemHealth,         // System monitoring
                ManageMaintenanceMode,    // Maintenance mode control
                
                // ==================== FINANCIAL OVERSIGHT (VIEW ONLY) ====================
                ViewBilling,              // View all billing data
                ViewBillingSummary,       // Financial summaries
                ViewFinancialReports,     // Revenue analytics
                ConfigureBillingPrices,   // Configure service pricing
                
                // ==================== RESOURCE MANAGEMENT (ADMINISTRATIVE) ====================
                ManageRooms,          // Create/update/delete rooms
                ViewRooms,            // View room availability
                ManageEquipment,      // Equipment inventory management
                ViewEquipment,        // View equipment status
                
                // ==================== REPORTING & ANALYTICS (METADATA ONLY) ====================
                ViewReports,              // Access reports section
                ViewSystemReports,        // System performance reports
                ViewOperationalReports,   // Operational KPIs
                ExportReports,            // Export reports
                ViewAppointmentsSummary,  // Appointment statistics (metadata)
                ViewSurgeriesSummary,     // Surgery volume (metadata, not clinical details)
                
                // ==================== PATIENT DATA (VIEW ONLY - NO MODIFICATION) ====================
                ViewPatients,             // View patient list (administrative)
                // ? NOT ViewPatientDetails - Admin cannot see medical history
                
                
                // ??? EXPLICITLY EXCLUDED - ZERO CLINICAL AUTHORITY ???
                // 
                // Admin is IT/Operations, NOT medical staff
                // 
                // ?? ViewPatientDetails      - Cannot view medical history
                // ?? ViewMedicalHistory      - Cannot view diagnoses
                // ?? CreateMedicalHistory    - Cannot create diagnoses
                // ?? UpdateMedicalHistory    - Cannot modify diagnoses
                // 
                // ?? ViewPrescriptions       - Cannot view prescriptions
                // ?? CreatePrescription      - Cannot prescribe medications
                // ?? ApprovePrescriptionRefill - Cannot approve refills
                // 
                // ?? ViewSurgeries           - Cannot view surgery details (only summaries)
                // ?? CreateSurgery           - Cannot schedule surgeries
                // ?? UpdateSurgery           - Cannot modify surgery records
                // ?? PerformSurgery          - Cannot perform surgeries
                // 
                // ?? ViewLabResults          - Cannot view lab results
                // ?? CreateLabResults        - Cannot upload lab results
                // 
                // ?? CheckInAppointment      - Cannot check-in patients (receptionist duty)
                // ?? ProcessPayment          - Cannot process payments (receptionist duty)
                // 
                // ?? Admin never touches clinical workflows
                // ?? Admin = System Governance, NOT Healthcare Delivery
            }
        };

        /// <summary>
        /// Check if a role has a specific permission
        /// </summary>
        public static bool HasPermission(string role, string permission)
        {
            return Permissions.ContainsKey(role) && Permissions[role].Contains(permission);
        }

        /// <summary>
        /// Get all permissions for a role
        /// </summary>
        public static HashSet<string> GetRolePermissions(string role)
        {
            return Permissions.ContainsKey(role) ? Permissions[role] : new HashSet<string>();
        }

        /// <summary>
        /// Get role display name
        /// </summary>
        public static string GetRoleDisplayName(string role)
        {
            return role switch
            {
                "Clinician" => "????? Clinician (Doctor/Surgeon)",
                "Receptionist" => "????? Receptionist (Front Desk)",
                "Patient" => "?? Patient",
                "Admin" => "????? Administrator (System/IT)",
                _ => role
            };
        }

        /// <summary>
        /// Get role description
        /// </summary>
        public static string GetRoleDescription(string role)
        {
            return role switch
            {
                "Clinician" => "Medical decision maker - Diagnoses, prescribes, performs surgeries",
                "Receptionist" => "Front desk administrator - Scheduling, billing, patient registration (no clinical access)",
                "Patient" => "Self-service portal - Read-only access to own medical data",
                "Admin" => "System administrator - IT operations, security, monitoring (no clinical authority)",
                _ => "Unknown role"
            };
        }
    }
}
