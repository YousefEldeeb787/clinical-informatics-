# ????? Admin Role - Complete Specification

## ?? Role Purpose

The **Admin** is a **System Administrator** responsible for:
- **IT Operations** & Infrastructure
- **Security & Compliance**
- **User & Access Management**  
- **System Configuration**
- **Monitoring & Reporting**

### ?? CRITICAL: Admin ? Medical Staff

**Admin is NON-CLINICAL**
- Admin = IT/Operations Manager
- Admin ? Healthcare Provider
- Admin has **ZERO clinical authority**

---

## ?? Core Principles

### 1. Administrative ? Clinical
- **Full system visibility**
- **Zero medical authority**
- **Cannot create or modify clinical data**

### 2. Controls Access, Not Treatment
- **Manages WHO can do WHAT**
- **Does NOT decide WHAT treatment is given**

### 3. IT + Operations Manager
- **Maintains system infrastructure**
- **Ensures compliance & security**
- **Provides operational support**

---

## ? What Admin CAN Do

### 1?? User & Role Management

**Full Control Over System Users**

**Permissions:**
- ? **Create users** (Clinicians, Receptionists, Patients, Admins)
- ? **Update users** (edit profiles, change roles)
- ? **Delete/deactivate users**
- ? **Assign roles** (RBAC)
- ? **Reset passwords**
- ? **Lock accounts** (after failed logins)
- ? **View user login history**
- ? **View user activity logs**

**Restrictions:**
- ?? Cannot impersonate users
- ?? Cannot perform actions on behalf of clinicians

**API Endpoints:**
```
POST   /api/users              - Create user
PUT    /api/users/{id}         - Update user
DELETE /api/users/{id}         - Delete user
POST   /api/users/{id}/reset-password - Reset password
GET    /api/users/{id}/activity - View user activity
```

---

### 2?? Authorization & Security Management

**System Security Configuration**

**Responsibilities:**
- ? **Configure JWT authentication**
  - Token expiration time
  - Refresh token rules
  - Secret key rotation
- ? **Manage authorization policies**
  - Role-based access control (RBAC)
  - Permission assignments
- ? **Configure password policies**
  - Minimum length
  - Complexity requirements
  - Expiration rules
- ? **Configure CORS policies**
  - Allowed origins
  - Allowed methods
- ? **Manage API access rules**
  - Rate limiting
  - IP whitelisting
- ? **Enable/disable endpoints by role**
- ? **Monitor failed login attempts**
- ? **Review suspicious activity**

**API Endpoints:**
```
GET  /api/admin/security-settings
PUT  /api/admin/security-settings
GET  /api/admin/failed-logins
GET  /api/admin/suspicious-activity
```

---

### 3?? System Configuration

**Control System Behavior**

**Settings:**
- ? **Email (SMTP) configuration**
  - Server, port, credentials
  - Email templates
- ? **File upload settings**
  - Maximum file size
  - Allowed file types (PDF, images, lab reports)
  - Storage location
- ? **Environment variables**
- ? **API rate limiting**
- ? **Feature toggles**
  - Enable/disable features
- ? **Maintenance mode**
  - Schedule downtime
  - Display maintenance message

**API Endpoints:**
```
GET  /api/admin/config
PUT  /api/admin/config/email
PUT  /api/admin/config/upload
PUT  /api/admin/config/features
POST /api/admin/maintenance-mode
```

---

### 4?? Resource Management (Administrative Only)

**Manage Physical Resources (NOT Clinical Usage)**

#### Rooms
- ? **Create/update/delete rooms**
- ? **Define room types**
  - Operating Room
  - Recovery Room
  - Consultation Room
- ? **Set availability schedules**
- ? **Mark room status**
  - Available
  - Maintenance
  - Disabled

**?? Note:** Admin defines room availability, but **does NOT assign rooms to surgeries** (that's clinical staff).

#### Equipment
- ? **Manage equipment inventory**
- ? **Track equipment status**
- ? **Assign equipment to rooms**
- ? **Define maintenance schedules**

**API Endpoints:**
```
GET    /api/rooms
POST   /api/rooms
PUT    /api/rooms/{id}
DELETE /api/rooms/{id}

GET    /api/equipment
POST   /api/equipment
PUT    /api/equipment/{id}
```

---

### 5?? Financial & Billing Oversight

**View Financial Data + Configure Pricing**

**Capabilities:**
- ? **View all invoices** (read-only)
- ? **View payment history** (read-only)
- ? **View revenue summaries**
- ? **Configure billing rates**
- ? **Configure service pricing**
- ? **Manage insurance providers**
- ? **View insurance claims status**
- ? **Export financial reports**

**Restrictions:**
- ?? **Cannot collect payments** (Receptionist duty)
- ?? **Cannot modify invoices manually**

**API Endpoints:**
```
GET  /api/billing              - View all billing (read-only)
GET  /api/billing/summary      - Financial summaries
GET  /api/billing/reports      - Financial reports
PUT  /api/admin/billing-rates  - Configure pricing
GET  /api/insurance            - Insurance providers
```

---

### 6?? Audit Logging & Compliance

**Ensure Traceability & Accountability**

**Access:**
- ? **View full audit logs**
  - Who did what
  - When
  - From where (IP address)
- ? **Filter logs by:**
  - User
  - Role
  - Action
  - Date range
- ? **Export audit reports**
- ? **Generate compliance reports**

**?? Required for HIPAA / ISO 27799 compliance**

**API Endpoints:**
```
GET  /api/audit-logs
GET  /api/audit-logs/export
GET  /api/audit-logs/compliance-report
```

---

### 7?? Reporting & Analytics

**Global Visibility (Metadata Only)**

**Reports:**
- ? **User activity reports**
- ? **Appointment statistics** (counts, not details)
- ? **Surgery volume reports** (metadata only, no clinical details)
- ? **Patient growth trends** (demographics)
- ? **Revenue analytics**
- ? **Resource utilization**
- ? **System performance metrics**

**Dashboards:**
- ? **System health status**
- ? **Active users count**
- ? **Daily operations summary**
- ? **Error & failure rates**

**Restrictions:**
- ?? **Cannot view clinical details** (diagnoses, medical notes)
- ?? **Cannot view individual patient medical records**

**API Endpoints:**
```
GET  /api/reports/users
GET  /api/reports/appointments-summary
GET  /api/reports/surgeries-summary
GET  /api/reports/financial
GET  /api/reports/system-health
```

---

### 8?? Database & Infrastructure Management

**Ensure System Continuity**

**Tasks:**
- ? **Run database migrations**
- ? **Perform backups**
- ? **Restore backups**
- ? **Seed initial data**
- ? **Monitor database health**
- ? **Monitor API uptime**

**API Endpoints:**
```
POST /api/admin/backup
POST /api/admin/restore
GET  /api/admin/db-health
GET  /api/admin/api-health
```

---

## ?? What Admin CANNOT Do

### ? ZERO Clinical Authority

**Admin is NOT a medical provider and has NO access to clinical workflows.**

#### ?? Cannot View/Modify Medical Data
- ?? **View full patient medical history**
- ?? **View diagnoses**
- ?? **Create diagnoses** (ICD-10)
- ?? **Modify diagnoses**

#### ?? Cannot Prescribe
- ?? **View prescriptions** (individual records)
- ?? **Create prescriptions**
- ?? **Approve prescription refills**

#### ?? Cannot Manage Surgeries
- ?? **View surgery details** (can only see summaries/counts)
- ?? **Schedule surgeries**
- ?? **Modify surgery records**
- ?? **Perform surgeries**

#### ?? Cannot Access Lab Results
- ?? **View lab results**
- ?? **Upload lab results**

#### ?? Cannot Perform Front-Desk Duties
- ?? **Check-in patients** (Receptionist duty)
- ?? **Process payments** (Receptionist duty)

### Rationale

**Admin = System Governance, NOT Healthcare Delivery**

This matches:
- **HIMSS RBAC** (Healthcare Information Management Systems Society)
- **ISO 27799** (Health data security standard)
- **HIPAA** minimum-necessary access principle

---

## ?? Admin Dashboard

### What Admin Sees

**System Overview:**
- ?? Total users by role (Clinicians, Receptionists, Patients)
- ?? Active patients count
- ?? Today's appointments count (summary only, no clinical details)
- ?? System health status (API uptime, database status)

**Recent Activity:**
- ?? Recent audit logs (last 10 actions)
- ?? Alerts (failed logins, errors, security events)

**Financial Overview:**
- ?? Revenue charts (daily, weekly, monthly)
- ?? Payment statistics
- ?? Pending insurance claims count

**Resource Status:**
- ?? Room availability
- ??? Equipment status
- ?? Resource utilization

---

## ?? Admin API Design Rules

### API Endpoint Pattern

**Admin endpoints MUST:**
1. ? Require `Admin` role claim
2. ? Be isolated from clinical endpoints
3. ? Write audit logs for all actions

**Admin CAN:**
- ? `GET` clinical data **summaries** (counts, statistics)
- ?? **NEVER** `POST`, `PUT`, `DELETE` clinical records

### Example: Correct Admin API

```csharp
// ? CORRECT - Admin can view summaries
[HttpGet("surgeries/summary")]
[Authorize(Policy = nameof(RolePermissions.ViewSurgeriesSummary))]
public async Task<ActionResult> GetSurgeriesSummary()
{
    var summary = new
    {
        TotalSurgeries = await _context.Surgeries.CountAsync(),
        ScheduledToday = await _context.Surgeries
            .CountAsync(s => s.ScheduledDate.Date == DateTime.Today),
        ByType = await _context.Surgeries
            .GroupBy(s => s.SurgeryType)
            .Select(g => new { Type = g.Key, Count = g.Count() })
            .ToListAsync()
    };
    return Ok(summary);
}

// ?? WRONG - Admin cannot view individual surgery details
[HttpGet("surgeries/{id}")]
[Authorize(Policy = nameof(RolePermissions.ViewSurgeries))] // ? Admin does NOT have this
public async Task<ActionResult> GetSurgery(int id)
{
    // Admin should NOT access this endpoint
}
```

---

## ?? Admin Testing Checklist

### ? Admin CAN Access

**User Management:**
- [ ] Can view user list
- [ ] Can create new user
- [ ] Can edit user profile
- [ ] Can reset user password
- [ ] Can change user role
- [ ] Can deactivate user

**System Configuration:**
- [ ] Can view system settings
- [ ] Can update SMTP settings
- [ ] Can configure JWT settings
- [ ] Can enable/disable features
- [ ] Can set maintenance mode

**Security & Audit:**
- [ ] Can view audit logs
- [ ] Can export audit logs
- [ ] Can view failed login attempts
- [ ] Can view user activity

**Financial:**
- [ ] Can view financial reports
- [ ] Can configure billing rates
- [ ] Can view revenue summaries

**Resources:**
- [ ] Can create/edit rooms
- [ ] Can manage equipment
- [ ] Can view room availability

**Reports:**
- [ ] Can view appointment summaries
- [ ] Can view surgery volume reports
- [ ] Can view system health

### ?? Admin CANNOT Access

**Clinical Data:**
- [ ] ? Cannot view patient medical history
- [ ] ? Cannot create prescriptions
- [ ] ? Cannot schedule surgeries
- [ ] ? Cannot view individual surgery details
- [ ] ? Cannot view lab results
- [ ] ? Cannot create diagnoses

**Front-Desk Duties:**
- [ ] ? Cannot check-in patients
- [ ] ? Cannot process payments

---

## ?? Permission Matrix - Admin

| Feature | Admin |
|---------|-------|
| **User Management** |
| View users | ? |
| Create users | ? |
| Edit users | ? |
| Delete users | ? |
| Reset passwords | ? |
| Assign roles | ? |
| **System** |
| Configure system | ? |
| Configure security | ? |
| View audit logs | ? |
| Manage backups | ? |
| View system health | ? |
| **Financial** |
| View billing data | ? |
| View financial reports | ? |
| Configure prices | ? |
| Process payments | ?? |
| **Resources** |
| Manage rooms | ? |
| Manage equipment | ? |
| **Clinical** |
| View medical history | ?? |
| Create prescriptions | ?? |
| Schedule surgeries | ?? |
| View lab results | ?? |
| **Operational** |
| View appointment summary | ? |
| View surgery summary | ? |
| Check-in patients | ?? |

---

## ?? Usage Examples

### Backend (C# Controller)

```csharp
// Admin User Management
[HttpGet("users")]
[Authorize(Policy = nameof(RolePermissions.ViewUsers))]
public async Task<ActionResult> GetUsers()
{
    // Only Admin can access
}

// Admin System Configuration
[HttpPut("config/security")]
[Authorize(Policy = nameof(RolePermissions.ConfigureSecurity))]
public async Task<ActionResult> UpdateSecuritySettings(...)
{
    // Only Admin can access
}

// Admin Financial Reports (View Only)
[HttpGet("financial-reports")]
[Authorize(Policy = nameof(RolePermissions.ViewFinancialReports))]
public async Task<ActionResult> GetFinancialReports()
{
    // Admin can view, but not modify
}
```

### Frontend (React)

```jsx
import { PermissionGuard, PERMISSIONS } from '@/services';

// Admin User Management
<PermissionGuard permission={PERMISSIONS.MANAGE_USERS}>
  <button onClick={createUser}>Create User</button>
</PermissionGuard>

// Admin System Config
<PermissionGuard permission={PERMISSIONS.CONFIGURE_SYSTEM}>
  <SystemSettings />
</PermissionGuard>

// Admin Reports
<PermissionGuard permission={PERMISSIONS.VIEW_SYSTEM_REPORTS}>
  <SystemReports />
</PermissionGuard>

// Clinical data - Admin CANNOT access
<PermissionGuard permission={PERMISSIONS.CREATE_PRESCRIPTION}>
  {/* This will NOT render for Admin */}
  <button>Create Prescription</button>
</PermissionGuard>
```

---

## ?? Summary

### Admin Role in 3 Sentences

1. **Admin is a System Administrator**, not a healthcare provider
2. **Admin manages IT operations, security, users, and system configuration**
3. **Admin has ZERO clinical authority** and cannot create/view/modify medical data

### Key Takeaway

**Admin = IT/Operations Manager**  
**Admin ? Medical Staff**

---

**Last Updated**: January 2025  
**Version**: 1.0  
**Compliance**: HIMSS RBAC, ISO 27799, HIPAA-aligned
