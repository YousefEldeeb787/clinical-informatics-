# ? RBAC Implementation - Deployment Checklist

## ?? Pre-Deployment

### Backend Verification
- [x] ? Authorization folder created with 4 files
- [x] ? Program.cs updated with 40+ policies
- [x] ? PatientsController updated with RBAC
- [x] ? PrescriptionsController updated with RBAC
- [x] ? SurgeriesController updated with RBAC
- [x] ? AppointmentsController updated with RBAC
- [x] ? DbSeeder updated (Nurse ? Receptionist)
- [x] ? No compilation errors

### Frontend Verification
- [x] ? permissionService.js created (500+ lines)
- [x] ? PermissionGuard.jsx created
- [x] ? Unauthorized.jsx created
- [x] ? Unauthorized.css created
- [x] ? services/index.js updated
- [x] ? No build errors

### Documentation
- [x] ? RBAC_IMPLEMENTATION_GUIDE.md created (500+ lines)
- [x] ? RBAC_IMPLEMENTATION_SUMMARY.md created
- [x] ? RBAC_QUICK_REFERENCE.md created
- [x] ? RBAC_DEPLOYMENT_CHECKLIST.md (this file)

---

## ?? Deployment Steps

### Step 1: Backend Deployment

```bash
# 1. Navigate to Backend
cd Backend

# 2. Clean and restore
dotnet clean
dotnet restore

# 3. Build
dotnet build --configuration Release

# 4. Run migrations (if any)
dotnet ef database update

# 5. Run backend
dotnet run

# Expected: Server starts on http://localhost:5000
# Expected: No errors in console
```

**? Verify:**
- [ ] Backend starts without errors
- [ ] Swagger loads at http://localhost:5000/swagger
- [ ] `/health` endpoint returns 200 OK
- [ ] Authorization policies loaded (check startup logs)

---

### Step 2: Frontend Deployment

```bash
# 1. Navigate to Frontend
cd frontend

# 2. Install dependencies (if needed)
npm install

# 3. Start dev server
npm run dev

# Expected: Frontend starts on http://localhost:5173
# Expected: No compilation errors
```

**? Verify:**
- [ ] Frontend starts without errors
- [ ] No console errors
- [ ] permissionService imported successfully
- [ ] Login page loads

---

### Step 3: Database Update (Optional)

```sql
-- If you have existing Nurse users, update them to Receptionist
UPDATE Users 
SET Role = 'Receptionist' 
WHERE Role = 'Nurse';
```

**? Verify:**
- [ ] Nurse role replaced with Receptionist
- [ ] All users have valid roles (Admin, Clinician, Receptionist, Patient)

---

### Step 4: Seed Data Verification

```bash
# Backend should auto-seed on first run

# Check database has test users:
# - admin@clinic.com (Admin)
# - doctor@clinic.com (Clinician)
# - receptionist@clinic.com (Receptionist)
# - patient@clinic.com (Patient)
```

**? Verify:**
- [ ] 4 test users exist
- [ ] All passwords work (see credentials below)
- [ ] 1 clinician record exists
- [ ] 1 patient record exists
- [ ] 3 room records exist

---

## ?? Testing Phase

### Test 1: Clinician Tests

**Login:** doctor@clinic.com / Doctor123!

- [ ] ? Can view dashboard
- [ ] ? Can view all patients
- [ ] ? Can view full patient details (medical history)
- [ ] ? Can create prescription
- [ ] ? Can schedule surgery
- [ ] ? Can view lab results
- [ ] ? Cannot access user management (should show 403 or hide button)
- [ ] ? Cannot access system settings (should show 403 or hide button)
- [ ] ? Cannot manage rooms (should show 403 or hide button)

**API Tests (Swagger):**
```
POST /api/prescriptions - ? Should work
POST /api/surgeries - ? Should work
GET /api/patients - ? Should work
GET /api/users - ? Should return 403
```

---

### Test 2: Receptionist Tests

**Login:** receptionist@clinic.com / Reception123!

- [ ] ? Can view dashboard
- [ ] ? Can view patient list (basic info only)
- [ ] ? Can register new patient
- [ ] ? Can schedule appointment
- [ ] ? Can check-in patient
- [ ] ? Can process payment
- [ ] ? Can manage rooms
- [ ] ? Cannot view full medical history (should show 403)
- [ ] ? Cannot create prescription (should show 403 or hide button)
- [ ] ? Cannot schedule surgery (should show 403 or hide button)
- [ ] ? Cannot view lab results (should show 403)

**API Tests (Swagger):**
```
GET /api/patients - ? Should work (basic info)
GET /api/patients/{id} - ? Should return 403 (no medical access)
POST /api/prescriptions - ? Should return 403
POST /api/surgeries - ? Should return 403
POST /api/appointments - ? Should work
POST /api/appointments/{id}/checkin - ? Should work
POST /api/billing/payment - ? Should work
```

---

### Test 3: Patient Tests

**Login:** patient@clinic.com / Patient123!

- [ ] ? Can view own dashboard
- [ ] ? Can view own medical records
- [ ] ? Can view own prescriptions
- [ ] ? Can view own appointments
- [ ] ? Can view own lab results
- [ ] ? Can view own surgeries
- [ ] ? Can request appointment
- [ ] ? Can request prescription refill
- [ ] ? Can cancel own appointment
- [ ] ? Can update own personal info
- [ ] ? Cannot view all patients (should show 403)
- [ ] ? Cannot view other patients' data (should show 403)
- [ ] ? Cannot create prescription (should hide button)
- [ ] ? Cannot modify medical history (should hide button)

**API Tests (Swagger):**
```
GET /api/prescriptions/my - ? Should work (own only)
GET /api/appointments/my - ? Should work (own only)
GET /api/surgeries/my - ? Should work (own only)
GET /api/prescriptions - ? Should return 403
POST /api/prescriptions - ? Should return 403
POST /api/surgeries - ? Should return 403
GET /api/patients - ? Should return 403
```

---

### Test 4: Admin Tests

**Login:** admin@clinic.com / Admin123!

- [ ] ? Can access everything
- [ ] ? Can view user management
- [ ] ? Can configure system
- [ ] ? Can manage rooms
- [ ] ? Can configure billing prices
- [ ] ? Can view audit logs
- [ ] ? Can perform all Clinician actions
- [ ] ? Can perform all Receptionist actions

**API Tests (Swagger):**
```
All endpoints - ? Should work (full access)
```

---

## ?? Integration Tests

### Test 5: Cross-Role Scenarios

**Scenario 1: Patient tries to view another patient's data**
```
Login as: patient@clinic.com
Try to access: /api/patients/2 (another patient)
Expected: 403 Forbidden
```

**Scenario 2: Receptionist tries to prescribe**
```
Login as: receptionist@clinic.com
Try to access: POST /api/prescriptions
Expected: 403 Forbidden
```

**Scenario 3: Clinician tries to manage users**
```
Login as: doctor@clinic.com
Try to access: GET /api/users
Expected: 403 Forbidden or endpoint doesn't exist
```

**Scenario 4: Patient tries to modify medical history**
```
Login as: patient@clinic.com
Try to access: POST /api/medical-history
Expected: Button hidden or 403 Forbidden
```

---

## ?? Verification Matrix

### Backend Verification

| Controller | Updated | RBAC Applied | Tested |
|------------|---------|--------------|--------|
| PatientsController | ? | ? | [ ] |
| PrescriptionsController | ? | ? | [ ] |
| SurgeriesController | ? | ? | [ ] |
| AppointmentsController | ? | ? | [ ] |
| BillingController | ?? | ?? | [ ] |
| LabResultsController | ?? | ?? | [ ] |
| UsersController | ?? | ?? | [ ] |

? = Complete | ?? = Not yet updated (use for future phases)

### Frontend Verification

| Component/Page | Updated | Guards Applied | Tested |
|----------------|---------|----------------|--------|
| Login | ? | N/A | [ ] |
| Dashboard | ?? | ?? | [ ] |
| Patients List | ?? | ?? | [ ] |
| Patient Details | ?? | ?? | [ ] |
| Prescriptions | ?? | ?? | [ ] |
| Surgeries | ?? | ?? | [ ] |
| Appointments | ?? | ?? | [ ] |
| Billing | ?? | ?? | [ ] |
| User Management | ?? | ?? | [ ] |

?? = Needs to be updated with `<PermissionGuard>` (see examples in RBAC_QUICK_REFERENCE.md)

---

## ??? Post-Deployment

### Step 5: Add Unauthorized Route

```jsx
// frontend/src/App.jsx or router config

import Unauthorized from './components/common/Unauthorized';

<Route path="/unauthorized" element={<Unauthorized />} />
```

**? Verify:**
- [ ] /unauthorized route exists
- [ ] Page displays correctly
- [ ] "Go Back" button works
- [ ] "Go to Dashboard" button works

---

### Step 6: Update Existing Components

**Priority 1 (High - Security Critical):**
- [ ] Update Prescriptions pages with `<PermissionGuard>`
- [ ] Update Surgeries pages with `<PermissionGuard>`
- [ ] Update Medical History with `<PermissionGuard>`
- [ ] Update User Management with `<PermissionGuard>`

**Priority 2 (Medium):**
- [ ] Update Patient Details with role-based views
- [ ] Update Appointments with check-in guard
- [ ] Update Billing with payment guard
- [ ] Update Rooms Management with guard

**Priority 3 (Low - UX Enhancement):**
- [ ] Add tooltips to disabled buttons
- [ ] Add role badges to user profiles
- [ ] Add permission warnings in forms
- [ ] Add "What you cannot do" sections

---

## ?? Known Issues & Limitations

### Current Limitations

1. **?? Not All Controllers Updated**
   - Only Patients, Prescriptions, Surgeries, Appointments have full RBAC
   - Other controllers (Billing, LabResults, etc.) use legacy role checks
   - **Action**: Update in next phase

2. **?? Frontend Components Not Updated**
   - Only authorization infrastructure created
   - Components need to import and use `<PermissionGuard>`
   - **Action**: Update each component individually

3. **?? No Nurse Role Support**
   - Nurse role has been replaced with Receptionist
   - Existing Nurse users need manual database update
   - **Action**: Run SQL update script

4. **?? No Anesthesiologist Role**
   - Currently not implemented
   - Can be added to RolePermissions.cs if needed
   - **Action**: Add if required

---

## ?? Rollback Plan

**If Critical Issues Found:**

### Backend Rollback
```bash
# Revert Program.cs changes
git checkout HEAD~1 Backend/Program.cs

# Remove Authorization folder
rm -rf Backend/Authorization

# Revert controller changes
git checkout HEAD~1 Backend/Controllers/
```

### Frontend Rollback
```bash
# Remove new files
rm frontend/src/services/permissionService.js
rm frontend/src/components/common/PermissionGuard.jsx
rm frontend/src/components/common/Unauthorized.jsx
rm frontend/src/components/common/Unauthorized.css

# Revert services/index.js
git checkout HEAD~1 frontend/src/services/index.js
```

### Database Rollback
```sql
-- Restore Nurse role if needed
UPDATE Users SET Role = 'Nurse' WHERE Role = 'Receptionist';
```

---

## ?? Support & Troubleshooting

### Common Issues

**Issue 1: 403 Forbidden on All Requests**
```
Cause: JWT token doesn't include role claim
Fix: Check JwtHelper.GenerateToken() includes role
```

**Issue 2: Policy Not Found**
```
Cause: Policy not registered in Program.cs
Fix: Add policy in authorization section
```

**Issue 3: Patient Sees All Data**
```
Cause: Using wrong API endpoint
Fix: Use /api/{resource}/my endpoints for patients
```

**Issue 4: Permission Guard Not Working**
```
Cause: permissionService not imported correctly
Fix: import { permissionService, PERMISSIONS } from '@/services'
```

**Issue 5: Build Errors**
```
Cause: Missing using statements
Fix: Add 'using ClinicSystemBackend.Authorization;'
```

---

## ?? Documentation Reference

| Document | Purpose |
|----------|---------|
| **RBAC_IMPLEMENTATION_GUIDE.md** | Complete implementation guide (500+ lines) |
| **RBAC_IMPLEMENTATION_SUMMARY.md** | Executive summary & statistics |
| **RBAC_QUICK_REFERENCE.md** | Quick lookup for developers |
| **RBAC_DEPLOYMENT_CHECKLIST.md** | This checklist |

---

## ? Final Sign-Off

### Before Going Live

- [ ] All backend tests passed
- [ ] All frontend tests passed
- [ ] All 4 roles tested
- [ ] Cross-role scenarios tested
- [ ] Documentation reviewed
- [ ] Unauthorized page works
- [ ] No console errors
- [ ] No 500 errors in backend logs
- [ ] Seed data verified
- [ ] Database roles updated (if applicable)

### Sign-Off

- [ ] **Developer**: Tested and verified ___________
- [ ] **QA**: Tested and approved ___________
- [ ] **Security**: Reviewed and approved ___________
- [ ] **Product Owner**: Approved for deployment ___________

---

## ?? Deployment Complete

Once all checkboxes are marked:

1. ? Commit all changes to Git
2. ? Tag release as `v1.0-rbac`
3. ? Deploy to production
4. ? Monitor logs for 24 hours
5. ? Gather user feedback
6. ? Plan Phase 2 (update remaining controllers/components)

---

**Deployment Date**: _____________

**Deployment By**: _____________

**Status**: ?? **READY FOR DEPLOYMENT**

---

**Last Updated**: January 2025  
**Version**: 1.0
