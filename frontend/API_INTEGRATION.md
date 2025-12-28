# API Integration Guide

## Base Configuration

The frontend is configured to connect to the backend API using environment variables.

### Environment Setup

**Development**: `.env.development`
```env
VITE_API_BASE_URL=http://localhost:5000
```

**Production**: `.env.production`
```env
VITE_API_BASE_URL=https://your-production-api.com
```

## Using API Services

All API services are located in `src/services/` directory and can be imported from the central index:

```javascript
import { authService, patientsService, appointmentsService } from './services';
```

### Authentication Flow

```javascript
import { useDispatch } from 'react-redux';
import { login } from './store/slices/authSlice';

// In your component
const dispatch = useDispatch();

const handleLogin = async (credentials) => {
  try {
    await dispatch(login(credentials)).unwrap();
    // Redirect to dashboard
    navigate('/dashboard');
  } catch (error) {
    console.error('Login failed:', error);
  }
};
```

### Fetching Data

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from './store/slices/patientsSlice';

function PatientsList() {
  const dispatch = useDispatch();
  const { patients, loading, error } = useSelector(state => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {patients.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
}
```

### Direct API Calls

For components not using Redux:

```javascript
import { patientsService } from './services';

async function createPatient(patientData) {
  try {
    const newPatient = await patientsService.create(patientData);
    console.log('Patient created:', newPatient);
  } catch (error) {
    console.error('Failed to create patient:', error);
  }
}
```

## Available Services

### 1. Auth Service (`authService`)

```javascript
// Login
await authService.login({ email, password });

// Register
await authService.register(userData);

// Logout
authService.logout();

// Get current user
const user = authService.getCurrentUser();

// Check authentication
const isAuth = authService.isAuthenticated();

// Get profile
const profile = await authService.getProfile();

// Update profile
await authService.updateProfile(userData);

// Change password
await authService.changePassword({ oldPassword, newPassword });
```

### 2. Patients Service (`patientsService`)

```javascript
// Get all patients
const patients = await patientsService.getAll({ page: 1, pageSize: 10 });

// Get patient by ID
const patient = await patientsService.getById(patientId);

// Create patient
const newPatient = await patientsService.create(patientData);

// Update patient
await patientsService.update(patientId, updatedData);

// Delete patient
await patientsService.delete(patientId);

// Search patients
const results = await patientsService.search('John Doe');

// Get medical history
const history = await patientsService.getMedicalHistory(patientId);

// Add medical history
await patientsService.addMedicalHistory(patientId, historyData);
```

### 3. Appointments Service (`appointmentsService`)

```javascript
// Get all appointments
const appointments = await appointmentsService.getAll();

// Get appointment by ID
const appointment = await appointmentsService.getById(appointmentId);

// Create appointment
await appointmentsService.create(appointmentData);

// Update appointment
await appointmentsService.update(appointmentId, updatedData);

// Cancel appointment
await appointmentsService.cancel(appointmentId);

// Confirm appointment
await appointmentsService.confirm(appointmentId);

// Get by patient
const patientAppointments = await appointmentsService.getByPatient(patientId);

// Get by clinician
const doctorAppointments = await appointmentsService.getByClinician(clinicianId);

// Get available slots
const slots = await appointmentsService.getAvailableSlots({ 
  clinicianId, 
  date: '2025-01-15' 
});
```

### 4. Surgeries Service (`surgeriesService`)

```javascript
// Get all surgeries
const surgeries = await surgeriesService.getAll();

// Get surgery by ID
const surgery = await surgeriesService.getById(surgeryId);

// Create surgery
await surgeriesService.create(surgeryData);

// Update surgery
await surgeriesService.update(surgeryId, updatedData);

// Delete surgery
await surgeriesService.delete(surgeryId);

// Update status
await surgeriesService.updateStatus(surgeryId, 'Completed');

// Get by patient
const patientSurgeries = await surgeriesService.getByPatient(patientId);

// Get by surgeon
const surgeonSurgeries = await surgeriesService.getBySurgeon(surgeonId);
```

### 5. Prescriptions Service (`prescriptionsService`)

```javascript
// Get all prescriptions
const prescriptions = await prescriptionsService.getAll();

// Get prescription by ID
const prescription = await prescriptionsService.getById(prescriptionId);

// Create prescription
await prescriptionsService.create(prescriptionData);

// Update prescription
await prescriptionsService.update(prescriptionId, updatedData);

// Delete prescription
await prescriptionsService.delete(prescriptionId);

// Get by patient
const patientPrescriptions = await prescriptionsService.getByPatient(patientId);

// Get by encounter
const encounterPrescriptions = await prescriptionsService.getByEncounter(encounterId);
```

## Error Handling

All API calls automatically handle common errors:

- **401 Unauthorized**: Automatically redirects to login
- **403 Forbidden**: Access denied message
- **404 Not Found**: Resource not found
- **500 Server Error**: Server error message

Custom error handling:

```javascript
try {
  const data = await patientsService.getById(patientId);
} catch (error) {
  if (error.response) {
    // Server responded with error
    console.error('Server error:', error.response.data);
  } else if (error.request) {
    // No response from server
    console.error('Network error');
  } else {
    // Other error
    console.error('Error:', error.message);
  }
}
```

## Authentication Token

The API client automatically:
1. Retrieves the JWT token from localStorage
2. Attaches it to every request as `Authorization: Bearer {token}`
3. Handles token expiration and redirects to login

No manual token management needed!

## CORS Configuration

The backend is configured to accept requests from:
- `http://localhost:3000`
- `http://localhost:4200`
- `http://localhost:5173` (Vite default)

## API Response Format

Most API endpoints return data in this format:

```json
{
  "data": [...],
  "totalCount": 100,
  "currentPage": 1,
  "pageSize": 10,
  "totalPages": 10
}
```

Or for single items:

```json
{
  "id": 1,
  "name": "John Doe",
  ...
}
```

## Redux Integration

The project uses Redux Toolkit for state management:

- **Auth State**: `store/slices/authSlice.js`
- **Patients State**: `store/slices/patientsSlice.js`
- **Appointments State**: `features/appointments/appointmentsSlice.js`

### Using Redux in Components

```javascript
import { useSelector, useDispatch } from 'react-redux';
import { fetchPatients } from './store/slices/patientsSlice';

function MyComponent() {
  const dispatch = useDispatch();
  const { patients, loading } = useSelector(state => state.patients);
  const { user, isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchPatients());
    }
  }, [isAuthenticated, dispatch]);

  // Component logic...
}
```

## Best Practices

1. **Always use try-catch** for async operations
2. **Show loading states** while fetching data
3. **Handle errors gracefully** with user-friendly messages
4. **Use Redux for shared state**, direct API calls for local state
5. **Keep API keys/tokens secure** - never commit them to git
6. **Use TypeScript** (optional) for better type safety

## Adding New Services

To add a new service (e.g., for billing):

1. Create `src/services/billingService.js`:

```javascript
import apiClient from './api';

const billingService = {
  getAll: async () => {
    const response = await apiClient.get('/api/billing');
    return response.data;
  },
  // Add more methods...
};

export default billingService;
```

2. Export from `src/services/index.js`:

```javascript
export { default as billingService } from './billingService';
```

3. Create Redux slice if needed:

```javascript
// src/store/slices/billingSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { billingService } from '../../services';

export const fetchBillings = createAsyncThunk(
  'billing/fetchAll',
  async () => await billingService.getAll()
);

const billingSlice = createSlice({
  name: 'billing',
  initialState: { billings: [], loading: false },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBillings.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBillings.fulfilled, (state, action) => {
        state.loading = false;
        state.billings = action.payload;
      });
  }
});

export default billingSlice.reducer;
```

4. Add to store:

```javascript
// src/store/store.js
import billingReducer from './slices/billingSlice';

export const store = configureStore({
  reducer: {
    // ...existing reducers
    billing: billingReducer,
  }
});
```

## Testing API Calls

Use the backend Swagger UI for testing:
```
http://localhost:5000/swagger
```

Or use tools like:
- **Postman**
- **Insomnia**
- **Thunder Client** (VS Code extension)
