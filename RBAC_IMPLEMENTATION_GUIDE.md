# ?? Role-Based Access Control (RBAC) Implementation Guide

## ?? Overview

This system implements **strict role-based access control** matching real-world healthcare clinic requirements and HIPAA compliance standards.

---

## ?? Roles & Permissions

### ????? 1. Clinician (Doctor / Surgeon)

**Role Purpose**: Medical decision maker

#### ? What Clinicians CAN Do

**Medical Operations** (Core Responsibilities):
- ? **Diagnose patients** (ICD-10 codes)
- ? **Create & update medical encounters**
- ? **Prescribe medications** (full control)
- ? **Schedule & perform surgeries**
- ? **Review & interpret lab results**
- ? **Write pre/post-operative notes**
- ? **Approve prescription refills**
- ? **Update patient medical information**
- ? **View full medical history**
- ? **Generate medical reports**

**Patient Management**:
- ? View all patients
- ? View full patient details (including medical history)
- ? Update patient medical information

**Appointments**:
- ? View all appointments
- ? Create appointments
- ? Update appointments
- ? Cancel appointments

#### ?? What Clinicians CANNOT Do

**Administrative/System Operations**:
- ?? **Manage system users** (cannot add/remove staff)
- ?? **Configure billing prices** (cannot set procedure costs)
- ?? **Manage rooms inventory** (cannot configure OR rooms)
- ?? **Process payments** (cannot handle billing transactions)

**Rationale**: Clinicians request services — they don't configure systems.

---

### ????? 2. Receptionist (Front Desk / Clinic Coordinator)

**Role Purpose**: Administrative support (NO CLINICAL ACCESS)

#### ? What Receptionists CAN Do

**Patient & Appointment Management**:
- ? **Register patients** (demographic info)
- ? **Update personal information** (contact, address)
- ? **Update insurance information**
- ? **Schedule appointments**
- ? **Reschedule appointments**
- ? **Cancel appointments**
- ? **Manage check-in / check-out**
- ? **Manage waiting room**
- ? **Assign rooms**
- ? **View today's appointments**
- ? **View patient list** (basic info only: name, contact, insurance)

**Financial & Admin Support**:
- ? **Generate invoices**
- ? **Collect payments**
- ? **Print receipts**
- ? **Submit insurance claims**

**Coordination**:
- ? **Manage room availability**
- ? **Notify clinicians & nurses**
- ? **Handle phone calls**

#### ?? What Receptionists CANNOT Do

**Clinical Operations** (Critical - No Medical Access):
- ?? **View full medical history** (no diagnoses, medical notes)
- ?? **Write medical notes**
- ?? **Prescribe medications**
- ?? **Schedule surgeries**
- ?? **View lab interpretations**
- ?? **Access encounter notes**
- ?? **View surgery details**

**Rationale**: Receptionists only see administrative medical data, never clinical decisions (standard in EHR front-desk modules).

---

### ?? 3. Patient

**Role Purpose**: Self-access to own medical records (READ-ONLY)

#### ? What Patients CAN Do

**View Own Data** (Read-Only Medical Access):
- ? **View medical records** (own only)
- ? **View prescriptions** (own only)
- ? **View lab results** (own only)
- ? **View surgeries** (own only)
- ? **View appointments** (own only)
- ? **View billing information** (own only)

**Request Actions**:
- ? **Request appointments** (book for self)
- ? **Request prescription refills** (refill request)
- ? **Cancel appointments** (own only)

**Update Personal Info**:
- ? **Update personal information** (contact, address)
- ?? **NOT medical information**

#### ?? What Patients CANNOT Do

**Medical Modification** (Critical - No Write Access):
- ?? **Add diagnosis**
- ?? **Add prescription**
- ?? **Add surgery**
- ?? **Modify medical history**
- ?? **Upload lab interpretations**
- ?? **Write medical notes**
- ?? **Schedule surgeries**
- ?? **View other patients' data**

**Rationale**: Matches HIPAA minimum-necessary principle and patient portal design standards.

---

### ????? 4. Administrator

**Role Purpose**: System configuration and full oversight

#### ? What Admins CAN Do

**Full System Access**:
- ? All Clinician permissions
- ? All Receptionist permissions
- ? **Manage users** (add/remove/edit staff)
- ? **Configure system settings**
- ? **Configure billing prices**
- ? **View audit logs**
- ? **Generate reports**
- ? **Manage rooms & equipment**

---

## ?? Implementation Details

### Backend (C# .NET)

#### Authorization Structure

```
Backend/
??? Authorization/
?   ??? PermissionRequirement.cs      # Custom authorization requirement
?   ??? PermissionHandler.cs          # Permission validation handler
?   ??? RolePermissions.cs            # Centralized permissions mapping
?   ??? PermissionAttribute.cs        # Custom [Permission] attribute
```

#### Controller Protection

```csharp
// Example: PrescriptionsController.cs

[HttpPost]
[Authorize(Policy = nameof(RolePermissions.CreatePrescription))]
public async Task<ActionResult<PrescriptionDto>> CreatePrescription(...)
{
    // Only Clinicians can reach this endpoint
}

[HttpGet("my")]
[Authorize(Policy = nameof(RolePermissions.ViewOwnPrescriptions))]
public async Task<ActionResult<List<PrescriptionDto>>> GetMyPrescriptions()
{
    // Patients can only view their own prescriptions
}
```

#### Key Controllers Updated

1. **PatientsController** - Strict RBAC for patient data access
2. **PrescriptionsController** - Clinician-only prescribing
3. **SurgeriesController** - Clinician-only surgery management
4. **AppointmentsController** - Role-based appointment access

### Frontend (React)

#### Permission Service

```javascript
// frontend/src/services/permissionService.js

// Check single permission
if (permissionService.hasPermission(PERMISSIONS.CREATE_PRESCRIPTION)) {
  // Show "Create Prescription" button
}

// Check role
if (permissionService.isClinician()) {
  // Show clinician-specific UI
}
```

#### Permission Guards

```jsx
// frontend/src/components/common/PermissionGuard.jsx

// Hide UI elements based on permissions
<PermissionGuard permission={PERMISSIONS.CREATE_PRESCRIPTION}>
  <button>Create Prescription</button>
</PermissionGuard>

// Protect routes
<ProtectedRoute permission={PERMISSIONS.CREATE_SURGERY}>
  <CreateSurgery />
</ProtectedRoute>

// Role-based rendering
<RoleGuard roles={['Clinician', 'Admin']}>
  <SurgeryManagement />
</RoleGuard>
```

---

## ?? Permission Matrix

| Feature | Admin | Clinician | Receptionist | Patient |
|---------|-------|-----------|--------------|---------|
| **Patients** |
| View patient list | ? | ? | ? (basic info) | ?? |
| View full medical history | ? | ? | ?? | ? (own only) |
| Register patients | ? | ? | ? | ?? |
| Update personal info | ? | ? | ? | ? (own only) |
| Update medical info | ? | ? | ?? | ?? |
| **Appointments** |
| View all appointments | ? | ? | ? | ?? |
| View own appointments | ? | ? | ? | ? |
| Schedule appointments | ? | ? | ? | ? (self only) |
| Check-in patients | ? | ?? | ? | ?? |
| **Prescriptions** |
| View prescriptions | ? | ? | ?? | ? (own only) |
| Create prescriptions | ? | ? | ?? | ?? |
| Approve refills | ? | ? | ?? | ?? |
| Request refills | ? | ? | ?? | ? |
| **Surgeries** |
| View surgeries | ? | ? | ?? | ? (own only) |
| Schedule surgeries | ? | ? | ?? | ?? |
| Perform surgeries | ? | ? | ?? | ?? |
| **Billing** |
| View billing | ? | ?? | ? | ? (own only) |
| Process payments | ? | ?? | ? | ?? |
| Configure prices | ? | ?? | ?? | ?? |
| **Rooms & Equipment** |
| Manage rooms | ? | ?? | ? | ?? |
| Manage equipment | ? | ?? | ?? | ?? |
| **System** |
| Manage users | ? | ?? | ?? | ?? |
| View reports | ? | ? | ?? | ?? |
| Configure system | ? | ?? | ?? | ?? |

---

## ??? Security Features

### Backend Security

1. **JWT Token Validation** - Every request validated
2. **Policy-Based Authorization** - Granular permission checks
3. **Own-Data Validation** - Patients can only access their own records
4. **Role Claims** - Role embedded in JWT token
5. **Audit Logging** - All access attempts logged

### Frontend Security

1. **Permission Service** - Client-side permission checks
2. **Route Protection** - Unauthorized routes redirect
3. **UI Hiding** - Hide unauthorized features
4. **Disabled Buttons** - Show but disable unauthorized actions
5. **403 Forbidden Page** - Clear unauthorized access page

---

## ?? API Endpoint Patterns

### Pattern 1: Full List (Staff Only)
```
GET /api/prescriptions
Authorization: Clinician, Admin only
Receptionist: ? Forbidden
Patient: ? Forbidden
```

### Pattern 2: Own Data (Patient Endpoint)
```
GET /api/prescriptions/my
Authorization: Patient only
Returns: Patient's own prescriptions
```

### Pattern 3: Single Item with Ownership Check
```
GET /api/prescriptions/{id}
Authorization: Clinician, Admin, Patient (own only)
Validation: Check if patient owns this prescription
```

### Pattern 4: Create (Role-Specific)
```
POST /api/prescriptions
Authorization: Clinician only
Receptionist: ? Forbidden
Patient: ? Forbidden
```

---

## ?? Testing Checklist

### Clinician Tests
- ? Can view all patients
- ? Can create prescriptions
- ? Can schedule surgeries
- ? Cannot manage users
- ? Cannot configure billing prices

### Receptionist Tests
- ? Can register patients
- ? Can schedule appointments
- ? Can process payments
- ? Cannot view medical history
- ? Cannot prescribe medications
- ? Cannot schedule surgeries

### Patient Tests
- ? Can view own medical records
- ? Can request appointments
- ? Can request refills
- ? Cannot view other patients' data
- ? Cannot create prescriptions
- ? Cannot modify medical history

---

## ?? Migration from Old System

### Database Changes
- ? No database schema changes required
- ? Existing user roles maintained
- ?? Nurse role deprecated (use Receptionist)

### Frontend Changes
- ? Add `permissionService.js`
- ? Add `PermissionGuard.jsx`
- ? Update all components to use permission guards
- ? Add `/unauthorized` route

### Backend Changes
- ? Add `Authorization/` folder
- ? Update `Program.cs` with policies
- ? Update all controllers with `[Authorize(Policy = ...)]`

---

## ?? Additional Resources

- **Backend**: `Backend/Authorization/RolePermissions.cs`
- **Frontend**: `frontend/src/services/permissionService.js`
- **Components**: `frontend/src/components/common/PermissionGuard.jsx`
- **Example Usage**: See updated controllers and components

---

## ?? Troubleshooting

### Issue: User gets 403 Forbidden
**Solution**: Check if user's role has the required permission in `RolePermissions.cs`

### Issue: Patient can see all prescriptions
**Solution**: Ensure using `/api/prescriptions/my` endpoint, not `/api/prescriptions`

### Issue: Receptionist can view medical history
**Solution**: Verify `ViewPatientDetails` permission is NOT in Receptionist role

---

## ?? Support

For questions about RBAC implementation, contact the development team.

**Last Updated**: January 2025  
**Version**: 1.0  
**Compliance**: HIPAA-aligned
