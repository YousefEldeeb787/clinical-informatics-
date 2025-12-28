# Backend RBAC Authorization Update Summary

## ⚠️ CRITICAL CHANGES NEEDED

### Roles to Remove:
- ❌ **Admin** - System/infrastructure role, not a user role
- ❌ **Nurse** - Not in scope (only Clinician, Receptionist, Patient)

### Roles to Use:
- ✅ **Clinician** (Doctor)
- ✅ **Receptionist**  
- ✅ **Patient**

---

## Controllers Requiring Authorization Updates

### ✅ Already Correct:
- **BillingController**: Uses Admin,Receptionist → Change to just Receptionist
- **InsuranceController**: Uses Admin,Receptionist → Change to just Receptionist  
- **RoomsController**: Uses Admin,Receptionist → Change to just Receptionist
- **EquipmentController**: Uses Admin,Receptionist → Change to just Receptionist

### 🔧 Needs Updates:

#### 1. **MedicalHistoryController**
**Current**: Admin,Clinician,Nurse  
**Should Be**: Clinician only (Patient can view own)

```csharp
[HttpGet] // Get Medical History
[Authorize(Roles = "Clinician")] // Patient access handled in method logic

[HttpPost] // Create Entry
[Authorize(Roles = "Clinician")] // + Patient can create (patient-reported data)

[HttpPatch("{id}")] // Update Entry  
[Authorize(Roles = "Clinician")]

[HttpPost("{id}/verify")] // Verify Entry
[Authorize(Roles = "Clinician")]

[HttpDelete("{id}")] // Delete Entry
[Authorize(Roles = "Clinician")]
```

#### 2. **EncountersController**
**Current**: Admin,Clinician,Nurse  
**Should Be**: Clinician only

```csharp
[HttpGet] // List Encounters
[Authorize(Roles = "Clinician")]

[HttpPost] // Create Encounter
[Authorize(Roles = "Clinician")]

[HttpPut("{id}")] // Update Encounter
[Authorize(Roles = "Clinician")]

[HttpPost("{id}/sign")] // Sign Encounter
[Authorize(Roles = "Clinician")]
```

#### 3. **LabResultsController**
**Current**: Admin,Clinician,Nurse  
**Should Be**: Clinician only

```csharp
[HttpPost] // Create Lab Result
[Authorize(Roles = "Clinician")]
```

#### 4. **SurgeriesController**
**Current**: Various (Admin,Clinician,Nurse)  
**Should Be**: Clinician only (Receptionist can VIEW for scheduling)

```csharp
[HttpGet("scheduled")] // Receptionist can view
[Authorize(Roles = "Clinician,Receptionist")]

[HttpGet("today")] // Receptionist can view
[Authorize(Roles = "Clinician,Receptionist")]

// All other surgery operations: Clinician ONLY
[Authorize(Roles = "Clinician")]
```

#### 5. **PrescriptionsController**
**Current**: Uses Clinician,Admin correctly  
**Should Be**: Remove Admin

```csharp
[HttpPatch("{id}/status")]
[Authorize(Roles = "Clinician")] // Remove Admin
```

#### 6. **AppointmentsController**
Already uses Policy-based authorization ✅  
Verify policies align with:
- Clinician + Receptionist: Full management
- Patient: Own appointments only

#### 7. **PatientsController**
Already uses Policy-based authorization ✅  
Verify:
- Clinician: Full access
- Receptionist: Demographics only (no clinical data)
- Patient: Own profile only

#### 8. **ReportsController**
**Current**: Admin only  
**Should Be**: 
```csharp
[HttpGet("dashboard")] 
[Authorize(Roles = "Clinician,Receptionist")] // Role-specific data

[HttpGet("revenue")]
[Authorize(Roles = "Receptionist")] // Financial data

[HttpGet("surgeries")]
[Authorize(Roles = "Clinician")] // Clinical data
```

---

## Authorization Policies to Verify

Check `RolePermissions.cs` to ensure policies map correctly:

### Clinician Policies:
- ViewPatients, UpdatePatient (clinical data)
- ViewAppointments, CreateAppointment, UpdateAppointment
- ViewPrescriptions, CreatePrescription
- ViewSurgeries, CreateSurgery, UpdateSurgery
- ViewEncounters, CreateEncounter, SignEncounter

### Receptionist Policies:
- ViewPatients, CreatePatient, UpdatePatientPersonalInfo
- ViewAppointments, CreateAppointment, UpdateAppointment, CheckInAppointment
- ViewBilling, CreateInvoice, RecordPayment
- ViewInsurance, CreateInsurance
- ViewRooms, UpdateRoomStatus

### Patient Policies:
- ViewOwnProfile, UpdateOwnPersonalInfo
- ViewOwnAppointments, CancelAppointment
- ViewOwnPrescriptions, RequestPrescriptionRefill
- ViewOwnMedicalHistory
- ViewOwnSurgeries
- ViewOwnInvoices

---

## Next Steps:
1. Remove all "Admin" role references (unless truly system-level)
2. Remove all "Nurse" role references
3. Update [Authorize(Roles)] attributes per above
4. Verify RolePermissions.cs policies
5. Test with each role to ensure proper access control
