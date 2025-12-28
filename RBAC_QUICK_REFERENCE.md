# ?? RBAC Quick Reference Card

## ?? Default Test Credentials

| Role | Email | Password | Can Do | Cannot Do |
|------|-------|----------|---------|-----------|
| **????? Clinician** | doctor@clinic.com | Doctor123! | Prescribe, Surgery, Diagnose | Manage Users, Billing Config |
| **????? Receptionist** | receptionist@clinic.com | Reception123! | Register, Schedule, Billing | Medical History, Prescribe |
| **?? Patient** | patient@clinic.com | Patient123! | View Own Data, Request | Modify History, Prescribe |
| **????? Admin** | admin@clinic.com | Admin123! | Everything | Nothing (full access) |

---

## ?? Backend Usage (Controllers)

### Single Permission Check
```csharp
using ClinicSystemBackend.Authorization;

[HttpPost]
[Authorize(Policy = nameof(RolePermissions.CreatePrescription))]
public async Task<ActionResult> CreatePrescription(...)
{
    // Only Clinicians & Admin can access
}
```

### Multiple Roles (Legacy)
```csharp
[HttpGet]
[Authorize(Roles = "Clinician,Admin")]
public async Task<ActionResult> GetMedicalHistory(...)
{
    // Clinician or Admin only
}
```

### Own Data Check (Patient)
```csharp
[HttpGet("{id}")]
[Authorize]
public async Task<ActionResult> GetPrescription(int id)
{
    var currentRole = User.FindFirst(ClaimTypes.Role)?.Value;
    var currentUserId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value ?? "0");

    if (currentRole == "Patient")
    {
        var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == currentUserId);
        if (prescription.PatientId != patient.Id)
        {
            return Forbid(); // 403
        }
    }
}
```

---

## ?? Frontend Usage (Components)

### Permission Guard
```jsx
import { PermissionGuard, PERMISSIONS } from '@/services';

// Hide button if no permission
<PermissionGuard permission={PERMISSIONS.CREATE_PRESCRIPTION}>
  <button>Create Prescription</button>
</PermissionGuard>

// Multiple permissions (any)
<PermissionGuard permissions={[PERMISSIONS.CREATE_SURGERY, PERMISSIONS.UPDATE_SURGERY]}>
  <SurgeryActions />
</PermissionGuard>

// Multiple permissions (all required)
<PermissionGuard permissions={[PERMISSIONS.VIEW_PATIENTS, PERMISSIONS.UPDATE_PATIENT]} requireAll>
  <EditPatient />
</PermissionGuard>

// With fallback
<PermissionGuard permission={PERMISSIONS.CREATE_SURGERY} fallback={<p>No access</p>}>
  <button>Schedule Surgery</button>
</PermissionGuard>
```

### Role Guard
```jsx
import { RoleGuard } from '@/services';

// Single role
<RoleGuard role="Clinician">
  <ClinicianDashboard />
</RoleGuard>

// Multiple roles
<RoleGuard roles={['Clinician', 'Admin']}>
  <MedicalReports />
</RoleGuard>
```

### Protected Route
```jsx
import { ProtectedRoute, PERMISSIONS } from '@/services';

<Route 
  path="/prescriptions/create" 
  element={
    <ProtectedRoute permission={PERMISSIONS.CREATE_PRESCRIPTION}>
      <CreatePrescription />
    </ProtectedRoute>
  } 
/>

// Redirect to custom page
<Route 
  path="/admin" 
  element={
    <ProtectedRoute 
      permission={PERMISSIONS.MANAGE_USERS} 
      redirectTo="/access-denied"
    >
      <AdminPanel />
    </ProtectedRoute>
  } 
/>
```

### Permission Service (JavaScript)
```javascript
import permissionService, { PERMISSIONS } from '@/services/permissionService';

// Check permission
if (permissionService.hasPermission(PERMISSIONS.CREATE_PRESCRIPTION)) {
  // Show create button
}

// Check any permission
if (permissionService.hasAnyPermission([
  PERMISSIONS.CREATE_SURGERY, 
  PERMISSIONS.UPDATE_SURGERY
])) {
  // Show surgery management
}

// Check role
if (permissionService.isClinician()) {
  // Clinician-specific logic
}

// Helper methods
permissionService.canCreatePrescription()  // Returns boolean
permissionService.canViewMedicalHistory()  // Returns boolean
permissionService.canManageBilling()       // Returns boolean

// Get current role
const role = permissionService.getCurrentRole() // 'Clinician', 'Receptionist', etc.

// Get role display name
const displayName = permissionService.getRoleDisplayName() // '????? Clinician (Doctor/Surgeon)'
```

---

## ?? All Permissions Constants

### Patient Own Data
```javascript
PERMISSIONS.VIEW_OWN_PATIENT_DETAILS
PERMISSIONS.UPDATE_OWN_PERSONAL_INFO
PERMISSIONS.VIEW_OWN_MEDICAL_HISTORY
PERMISSIONS.VIEW_OWN_APPOINTMENTS
PERMISSIONS.VIEW_OWN_PRESCRIPTIONS
PERMISSIONS.VIEW_OWN_SURGERIES
PERMISSIONS.VIEW_OWN_LAB_RESULTS
PERMISSIONS.VIEW_OWN_BILLING
```

### Patient Management
```javascript
PERMISSIONS.VIEW_PATIENTS
PERMISSIONS.VIEW_PATIENT_DETAILS
PERMISSIONS.CREATE_PATIENT
PERMISSIONS.UPDATE_PATIENT
PERMISSIONS.UPDATE_PATIENT_PERSONAL_INFO
PERMISSIONS.UPDATE_PATIENT_INSURANCE_INFO
PERMISSIONS.DELETE_PATIENT
```

### Medical History
```javascript
PERMISSIONS.VIEW_MEDICAL_HISTORY
PERMISSIONS.CREATE_MEDICAL_HISTORY
PERMISSIONS.UPDATE_MEDICAL_HISTORY
```

### Appointments
```javascript
PERMISSIONS.VIEW_APPOINTMENTS
PERMISSIONS.CREATE_APPOINTMENT
PERMISSIONS.UPDATE_APPOINTMENT
PERMISSIONS.CANCEL_APPOINTMENT
PERMISSIONS.CHECK_IN_APPOINTMENT
```

### Prescriptions
```javascript
PERMISSIONS.VIEW_PRESCRIPTIONS
PERMISSIONS.CREATE_PRESCRIPTION
PERMISSIONS.APPROVE_PRESCRIPTION_REFILL
PERMISSIONS.REQUEST_PRESCRIPTION_REFILL
```

### Surgeries
```javascript
PERMISSIONS.VIEW_SURGERIES
PERMISSIONS.CREATE_SURGERY
PERMISSIONS.UPDATE_SURGERY
PERMISSIONS.PERFORM_SURGERY
```

### Billing
```javascript
PERMISSIONS.VIEW_BILLING
PERMISSIONS.CREATE_INVOICE
PERMISSIONS.PROCESS_PAYMENT
PERMISSIONS.CONFIGURE_BILLING_PRICES
```

### Rooms & Equipment
```javascript
PERMISSIONS.MANAGE_ROOMS
PERMISSIONS.VIEW_ROOMS
PERMISSIONS.MANAGE_EQUIPMENT
```

### System
```javascript
PERMISSIONS.MANAGE_USERS
PERMISSIONS.VIEW_REPORTS
PERMISSIONS.CONFIGURE_SYSTEM
```

---

## ?? Permission Matrix (Quick View)

| Action | Clinician | Receptionist | Patient | Admin |
|--------|-----------|--------------|---------|-------|
| **View Patients** | ? All | ? Basic | ?? | ? |
| **View Medical History** | ? | ?? | ? Own | ? |
| **Create Prescription** | ? | ?? | ?? | ? |
| **Schedule Surgery** | ? | ?? | ?? | ? |
| **Check-in Patient** | ?? | ? | ?? | ? |
| **Process Payment** | ?? | ? | ?? | ? |
| **Manage Rooms** | ?? | ? | ?? | ? |
| **Manage Users** | ?? | ?? | ?? | ? |

---

## ??? Common Patterns

### Pattern 1: List All (Staff)
```csharp
// Backend
[HttpGet]
[Authorize(Policy = nameof(RolePermissions.ViewPrescriptions))]
public async Task<ActionResult> GetPrescriptions() { }
```

### Pattern 2: My Items (Patient)
```csharp
// Backend
[HttpGet("my")]
[Authorize(Policy = nameof(RolePermissions.ViewOwnPrescriptions))]
public async Task<ActionResult> GetMyPrescriptions()
{
    var userId = int.Parse(User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
    var patient = await _context.Patients.FirstOrDefaultAsync(p => p.UserId == userId);
    return Ok(prescriptions.Where(p => p.PatientId == patient.Id));
}
```

### Pattern 3: Conditional UI
```jsx
// Frontend
function PrescriptionsPage() {
  return (
    <>
      {/* Staff see all */}
      {permissionService.hasPermission(PERMISSIONS.VIEW_PRESCRIPTIONS) && (
        <AllPrescriptions />
      )}

      {/* Patient sees own */}
      {permissionService.hasPermission(PERMISSIONS.VIEW_OWN_PRESCRIPTIONS) && (
        <MyPrescriptions />
      )}

      {/* Only clinician can create */}
      <PermissionGuard permission={PERMISSIONS.CREATE_PRESCRIPTION}>
        <button onClick={createPrescription}>New Prescription</button>
      </PermissionGuard>
    </>
  );
}
```

---

## ?? Common Pitfalls

### ? Don't Do This
```jsx
// BAD: Hardcoded role check
if (role === 'Clinician') {
  // What if Admin also needs access?
}

// BAD: No permission check
<button onClick={createPrescription}>Create</button>

// BAD: Using wrong endpoint
// Patient calling /api/prescriptions instead of /api/prescriptions/my
```

### ? Do This Instead
```jsx
// GOOD: Permission-based check
if (permissionService.hasPermission(PERMISSIONS.CREATE_PRESCRIPTION)) {
  // Works for Clinician, Admin, and any future roles with this permission
}

// GOOD: Permission guard
<PermissionGuard permission={PERMISSIONS.CREATE_PRESCRIPTION}>
  <button onClick={createPrescription}>Create</button>
</PermissionGuard>

// GOOD: Use role-specific endpoints
const prescriptions = permissionService.isPatient()
  ? await api.get('/api/prescriptions/my')
  : await api.get('/api/prescriptions');
```

---

## ?? Debugging

### Check User's Permissions
```javascript
// In browser console
const perms = permissionService.getRolePermissions();
console.log('My permissions:', Array.from(perms));
```

### Check Specific Permission
```javascript
console.log('Can create prescription?', 
  permissionService.hasPermission(PERMISSIONS.CREATE_PRESCRIPTION));
```

### Check Current Role
```javascript
console.log('Current role:', permissionService.getCurrentRole());
console.log('Display name:', permissionService.getRoleDisplayName());
```

### View Prohibited Actions
```javascript
console.log('What I cannot do:', permissionService.getProhibitedActions());
```

---

## ?? Quick Help

**403 Forbidden Error?**
? User doesn't have required permission. Check role permissions in `RolePermissions.cs`

**UI Not Showing?**
? Check if `<PermissionGuard>` is being used correctly

**Patient Sees All Data?**
? Make sure using `/api/{resource}/my` endpoint

**Receptionist Sees Medical Data?**
? Verify Receptionist role doesn't have `ViewMedicalHistory` permission

---

## ?? Full Documentation

- **Complete Guide**: `RBAC_IMPLEMENTATION_GUIDE.md`
- **Summary**: `RBAC_IMPLEMENTATION_SUMMARY.md`
- **Backend Code**: `Backend/Authorization/RolePermissions.cs`
- **Frontend Service**: `frontend/src/services/permissionService.js`

---

**Last Updated**: January 2025  
**Version**: 1.0
