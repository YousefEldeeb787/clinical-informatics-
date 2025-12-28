# ?? Backend API Integration - Complete Guide

## ? Integration Status: CONNECTED

Your frontend is now **fully connected** to the backend ASP.NET Core API!

---

## ?? API Configuration

### Base URL
```javascript
// Development
http://localhost:5000

// Production
Set in .env.production
```

### Environment Files

**`.env.development`**
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Surgery Clinic System
VITE_APP_VERSION=1.0.0
```

**`.env.production`**
```env
VITE_API_BASE_URL=https://your-production-api.com
VITE_APP_NAME=Surgery Clinic System
VITE_APP_VERSION=1.0.0
```

---

## ?? Authentication

### Backend JWT Configuration
- **Secret Key**: Configured in appsettings.json
- **Token Expiration**: 480 minutes (8 hours)
- **Issuer**: SurgeryClinicAPI
- **Audience**: SurgeryClinicClients

### Frontend Token Handling
```javascript
// Stored in localStorage
- token: JWT token string
- user: User object (JSON)
- role: User role string
```

### API Endpoints

| Endpoint | Method | Description | Roles |
|----------|--------|-------------|-------|
| `/api/auth/login` | POST | User login | Public |
| `/api/auth/register` | POST | Patient registration | Public |
| `/api/auth/me` | GET | Get current user | Authenticated |
| `/api/auth/logout` | POST | Logout | Authenticated |
| `/api/auth/refresh` | POST | Refresh token | Authenticated |
| `/api/auth/change-password` | POST | Change password | Authenticated |
| `/api/auth/reset-password` | POST | Request password reset | Public |

### Usage Example
```javascript
import { authService } from '@/services';

// Login
const response = await authService.login({
  email: 'user@example.com',
  password: 'password123'
});

// Register
const newUser = await authService.register({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  password: 'password123',
  phone: '+1234567890',
  dateOfBirth: '1990-01-01',
  gender: 'Male',
  address: '123 Main St',
  city: 'New York',
  state: 'NY',
  postalCode: '10001'
});

// Get current user
const user = await authService.getCurrentUser();

// Check authentication
if (authService.isAuthenticated()) {
  console.log('User is logged in');
}

// Check role
if (authService.hasRole('Admin')) {
  console.log('User is admin');
}
```

---

## ?? Patients API

### Endpoints

| Endpoint | Method | Description | Roles |
|----------|--------|-------------|-------|
| `/api/patients` | GET | Get all patients | Admin, Clinician, Receptionist |
| `/api/patients/{id}` | GET | Get patient by ID | Admin, Clinician, Receptionist, Patient |
| `/api/patients` | POST | Create patient | Admin, Receptionist |
| `/api/patients/{id}` | PUT | Update patient | Admin, Receptionist, Patient |
| `/api/patients/{id}` | DELETE | Delete patient | Admin |

### Usage Example
```javascript
import { patientsService } from '@/services';

// Get all patients
const patients = await patientsService.getAllPatients();

// Get patient by ID
const patient = await patientsService.getPatientById(1);

// Create patient
const newPatient = await patientsService.createPatient({
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane@example.com',
  phone: '+1234567890',
  dateOfBirth: '1985-05-15',
  gender: 'Female',
  address: '456 Oak Ave',
  city: 'Los Angeles',
  state: 'CA',
  postalCode: '90001'
});

// Update patient
await patientsService.updatePatient(1, {
  phone: '+0987654321',
  address: '789 New Street'
});

// Get patient's appointments
const appointments = await patientsService.getPatientAppointments(1);

// Get patient's medical history
const history = await patientsService.getPatientMedicalHistory(1);
```

---

## ?? Appointments API

### Endpoints

| Endpoint | Method | Description | Roles |
|----------|--------|-------------|-------|
| `/api/appointments` | GET | Get appointments (paginated) | Admin, Clinician, Receptionist |
| `/api/appointments/{id}` | GET | Get appointment by ID | All authenticated |
| `/api/appointments` | POST | Create appointment | Admin, Clinician, Receptionist |
| `/api/appointments/{id}` | PUT | Update appointment | Admin, Clinician, Receptionist |
| `/api/appointments/{id}/status` | PATCH | Update status | Admin, Clinician, Receptionist |
| `/api/appointments/{id}/checkin` | POST | Check in patient | Admin, Receptionist, Nurse |
| `/api/appointments/{id}/cancel` | POST | Cancel appointment | Admin, Clinician, Receptionist, Patient |
| `/api/appointments/today` | GET | Today's appointments | Admin, Clinician, Receptionist |
| `/api/appointments/upcoming` | GET | Upcoming appointments | All authenticated |
| `/api/appointments/statistics` | GET | Get statistics | Admin, Clinician |

### Usage Example
```javascript
import { appointmentsService } from '@/services';

// Get all appointments with filters
const response = await appointmentsService.getAllAppointments({
  patientId: 1,
  status: 'Scheduled',
  pageNumber: 1,
  pageSize: 20
});

// Create appointment
const newAppointment = await appointmentsService.createAppointment({
  patientId: 1,
  clinicianId: 2,
  startTime: '2024-01-15T09:00:00',
  endTime: '2024-01-15T09:30:00',
  reason: 'Annual checkup',
  appointmentType: 'Consultation',
  roomId: 1
});

// Check in patient
await appointmentsService.checkInAppointment(1);

// Update status
await appointmentsService.updateAppointmentStatus(1, {
  status: 'Completed'
});

// Cancel appointment
await appointmentsService.cancelAppointment(1, 'Patient requested cancellation');

// Get today's appointments
const todayAppointments = await appointmentsService.getTodayAppointments();

// Get upcoming appointments
const upcoming = await appointmentsService.getUpcomingAppointments({
  patientId: 1,
  days: 7
});

// Get statistics
const stats = await appointmentsService.getAppointmentStatistics({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

---

## ?? Surgeries API

### Endpoints

| Endpoint | Method | Description | Roles |
|----------|--------|-------------|-------|
| `/api/surgeries` | GET | Get surgeries (paginated) | Admin, Clinician, Nurse |
| `/api/surgeries/{id}` | GET | Get surgery by ID | Admin, Clinician, Nurse, Patient |
| `/api/surgeries` | POST | Create surgery | Admin, Clinician |
| `/api/surgeries/{id}` | PUT | Update surgery | Admin, Clinician |
| `/api/surgeries/{id}/status` | PATCH | Update status | Admin, Clinician, Nurse |
| `/api/surgeries/{id}/assign-staff` | POST | Assign surgical team | Admin, Clinician |
| `/api/surgeries/{id}/start` | POST | Start surgery | Admin, Clinician |
| `/api/surgeries/{id}/complete` | POST | Complete surgery | Admin, Clinician |
| `/api/surgeries/scheduled` | GET | Get scheduled surgeries | Admin, Clinician, Nurse |
| `/api/surgeries/today` | GET | Today's surgeries | Admin, Clinician, Nurse |
| `/api/surgeries/statistics` | GET | Get statistics | Admin, Clinician |

### Usage Example
```javascript
import { surgeriesService } from '@/services';

// Get all surgeries with filters
const response = await surgeriesService.getAllSurgeries({
  patientId: 1,
  surgeonId: 2,
  status: 'Scheduled',
  pageNumber: 1,
  pageSize: 20
});

// Create surgery
const newSurgery = await surgeriesService.createSurgery({
  patientId: 1,
  surgeonId: 2,
  surgeryType: 'Appendectomy',
  scheduledDate: '2024-01-20T08:00:00',
  estimatedDuration: 120,
  roomId: 3,
  preOpDiagnosis: 'Acute appendicitis',
  preOpInstructions: 'NPO after midnight'
});

// Assign staff
await surgeriesService.assignSurgeryStaff(1, {
  anesthesiologistId: 3,
  nurseId: 4
});

// Start surgery
await surgeriesService.startSurgery(1);

// Complete surgery
await surgeriesService.completeSurgery(1, {
  postOpDiagnosis: 'Acute appendicitis (confirmed)',
  postOpInstructions: 'Monitor for 24 hours',
  postOpNotes: 'Surgery completed successfully'
});

// Get today's surgeries
const todaySurgeries = await surgeriesService.getTodaySurgeries();

// Get statistics
const stats = await surgeriesService.getSurgeryStatistics({
  startDate: '2024-01-01',
  endDate: '2024-12-31'
});
```

---

## ?? Prescriptions API

### Endpoints

| Endpoint | Method | Description | Roles |
|----------|--------|-------------|-------|
| `/api/prescriptions` | GET | Get prescriptions | All authenticated |
| `/api/prescriptions/{id}` | GET | Get prescription by ID | All authenticated |
| `/api/prescriptions` | POST | Create prescription | Clinician |
| `/api/prescriptions/{id}/status` | PATCH | Update status | Clinician, Admin |
| `/api/prescriptions/{id}/refill` | POST | Request refill | Patient, Clinician |

### Usage Example
```javascript
import { prescriptionsService } from '@/services';

// Get all prescriptions
const prescriptions = await prescriptionsService.getAllPrescriptions({
  patientId: 1,
  status: 'Active'
});

// Create prescription
const newPrescription = await prescriptionsService.createPrescription({
  patientId: 1,
  medicationName: 'Amoxicillin',
  dosage: '500mg',
  frequency: 'Three times daily',
  duration: '7 days',
  instructions: 'Take with food',
  refills: 0
});

// Update status
await prescriptionsService.updatePrescriptionStatus(1, {
  status: 'Completed',
  filledDate: '2024-01-15T10:00:00'
});

// Request refill
await prescriptionsService.requestRefill(1);

// Get active prescriptions
const active = await prescriptionsService.getActivePrescriptions(1);
```

---

## ?? Additional Services

### Medical History
```javascript
import { medicalHistoryService } from '@/services';

const history = await medicalHistoryService.getPatientMedicalHistory(1);

await medicalHistoryService.createMedicalHistory({
  patientId: 1,
  condition: 'Hypertension',
  diagnosedDate: '2023-01-01',
  status: 'Active',
  notes: 'Controlled with medication'
});
```

### Rooms
```javascript
import { roomsService } from '@/services';

const rooms = await roomsService.getAllRooms();
const availableRooms = await roomsService.getAvailableRooms(new Date());
```

### Equipment
```javascript
import { equipmentService } from '@/services';

const equipment = await equipmentService.getAllEquipment();
await equipmentService.requestMaintenance(1, {
  description: 'Equipment malfunction',
  priority: 'High'
});
```

### Reports
```javascript
import { reportsService } from '@/services';

const dashboardStats = await reportsService.getDashboardStats();
const patientStats = await reportsService.getPatientStatistics();
const appointmentStats = await reportsService.getAppointmentStatistics();
const surgeryStats = await reportsService.getSurgeryStatistics();
```

---

## ?? Error Handling

The API client includes automatic error handling:

```javascript
try {
  const data = await appointmentsService.getAllAppointments();
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Status:', error.response.status);
    console.error('Data:', error.response.data);
    
    switch (error.response.status) {
      case 401:
        // Unauthorized - redirects to login automatically
        break;
      case 403:
        // Forbidden - access denied
        alert('Access denied');
        break;
      case 404:
        // Not found
        alert('Resource not found');
        break;
      case 500:
        // Server error
        alert('Server error occurred');
        break;
    }
  } else if (error.request) {
    // Request made but no response
    console.error('No response from server');
  } else {
    // Error in request setup
    console.error('Error:', error.message);
  }
}
```

---

## ?? Starting the Application

### 1. Start Backend
```bash
cd Backend
dotnet run
```
Backend runs on: `http://localhost:5000`

### 2. Start Frontend
```bash
cd frontend
npm run dev
```
Frontend runs on: `http://localhost:5173`

### 3. CORS Configuration
The backend is already configured to allow requests from:
- `http://localhost:3000`
- `http://localhost:4200`
- `http://localhost:5173` ?

---

## ?? Testing the Connection

### Quick Test in Browser Console
```javascript
// Test login
const response = await fetch('http://localhost:5000/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@clinic.com',
    password: 'Admin123!'
  })
});
const data = await response.json();
console.log(data);
```

### Using the Services
```javascript
import { authService, patientsService } from '@/services';

// Login
await authService.login({
  email: 'admin@clinic.com',
  password: 'Admin123!'
});

// Get patients
const patients = await patientsService.getAllPatients();
console.log(patients);
```

---

## ?? Data Flow

```
User Action (Frontend Component)
        ?
Service Call (e.g., patientsService.getAllPatients())
        ?
API Client (axios with interceptors)
        ?
HTTP Request ? Backend API Controller
        ?
Backend Service Layer ? Database
        ?
HTTP Response ? Backend
        ?
API Client (handles errors)
        ?
Service Returns Data
        ?
Component Updates UI
```

---

## ?? Authorization Levels

| Role | Permissions |
|------|-------------|
| **Admin** | Full access to all endpoints |
| **Clinician** | Patient records, appointments, prescriptions, surgeries |
| **Receptionist** | Patient registration, appointments scheduling |
| **Nurse** | Appointments, surgeries, check-ins |
| **Patient** | Own profile, appointments, prescriptions, medical history |

---

## ?? Response Formats

### Success Response
```json
{
  "data": { ... },
  "message": "Success"
}
```

### Paginated Response
```json
{
  "items": [ ... ],
  "totalCount": 100,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 5,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

### Error Response
```json
{
  "message": "Error description",
  "errors": { ... }
}
```

---

## ? Integration Checklist

- [x] API client configured with base URL
- [x] Request interceptor adds JWT token
- [x] Response interceptor handles errors
- [x] Authentication service connected
- [x] Patients service connected
- [x] Appointments service connected
- [x] Surgeries service connected
- [x] Prescriptions service connected
- [x] Medical history service connected
- [x] Rooms service connected
- [x] Equipment service connected
- [x] Reports service connected
- [x] CORS configured in backend
- [x] Environment variables set
- [x] Token storage in localStorage
- [x] Automatic 401 handling (redirect to login)
- [x] All endpoints documented

---

## ?? You're All Set!

Your frontend is now **fully integrated** with the backend API!

**Next Steps:**
1. Start both backend and frontend servers
2. Test login functionality
3. Navigate through the app
4. Create/view/edit data
5. Verify API calls in Network tab

**Troubleshooting:**
- Check browser console for errors
- Verify backend is running on port 5000
- Check CORS configuration if needed
- Ensure JWT token is being sent with requests
- Verify user has appropriate role permissions

---

**Status**: ? **FULLY CONNECTED AND READY TO USE!**
