# ?? Startup & Testing Guide

## ? Pre-Flight Checklist

### Backend Requirements
- [ ] SQL Server is running
- [ ] Connection string configured in `Backend/appsettings.json`
- [ ] .NET 8.0 SDK installed
- [ ] Port 5000 is available

### Frontend Requirements
- [ ] Node.js 18+ installed
- [ ] npm packages installed (`npm install`)
- [ ] Environment variables set in `.env.development`
- [ ] Port 5173 is available

---

## ?? Quick Start (3 Steps)

### Step 1: Start Backend

```powershell
# Navigate to backend
cd Backend

# Run the application
dotnet run

# Or with hot reload (development)
dotnet watch run
```

**Expected Output:**
```
? Now listening on: http://localhost:5000
? Application started. Press Ctrl+C to shut down.
```

**Verify:**
- ? Open: http://localhost:5000/health (should return "Healthy")
- ? Open: http://localhost:5000/swagger (Swagger UI loads)

---

### Step 2: Start Frontend

```powershell
# Navigate to frontend (from root)
cd frontend

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v7.1.10  ready in XXX ms

  ?  Local:   http://localhost:5173/
  ?  Network: use --host to expose
  ?  press h + enter to show help
```

**Verify:**
- ? Open: http://localhost:5173 (App loads)
- ? No console errors in browser DevTools

---

### Step 3: Test Connection

**Option A: Browser Console Test**
```javascript
// Open browser console (F12) and run:
await window.apiHealthCheck.runDiagnostics()
```

**Option B: Test Login**
```javascript
// In browser console:
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

---

## ?? Testing Endpoints

### 1. Health Check
```bash
curl http://localhost:5000/health
# Expected: "Healthy"
```

### 2. Login (Get Token)
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@clinic.com",
    "password": "Admin123!"
  }'

# Expected: { "token": "...", "user": {...}, "role": "Admin" }
```

### 3. Get Current User (with token)
```bash
curl http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: { "id": 1, "firstName": "...", "lastName": "...", ... }
```

### 4. Get Patients (with token)
```bash
curl http://localhost:5000/api/patients \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Expected: { "items": [...], "totalCount": X, ... }
```

---

## ?? Default Test Accounts

| Role | Email | Password | Permissions |
|------|-------|----------|-------------|
| **Admin** | admin@clinic.com | Admin123! | Full access |
| **Doctor** | doctor@clinic.com | Doctor123! | Patients, Appointments, Prescriptions, Surgeries |
| **Nurse** | nurse@clinic.com | Nurse123! | Appointments, Check-ins, Surgeries |
| **Receptionist** | receptionist@clinic.com | Receptionist123! | Patients, Appointments scheduling |
| **Patient** | patient@clinic.com | Patient123! | Own profile, appointments, prescriptions |

---

## ?? Frontend Testing

### Test Authentication Flow

1. **Navigate to Login Page**
   - URL: http://localhost:5173/login
   - Should see login form

2. **Login with Admin Credentials**
   ```
   Email: admin@clinic.com
   Password: Admin123!
   ```

3. **Verify Successful Login**
   - Should redirect to dashboard
   - Token stored in localStorage
   - User info visible in navbar

4. **Check Browser Console**
   ```javascript
   // Should see no errors
   console.log(localStorage.getItem('token')); // Should have token
   console.log(localStorage.getItem('user'));  // Should have user data
   console.log(localStorage.getItem('role'));  // Should be "Admin"
   ```

### Test API Calls from UI

1. **Navigate to Patients Page**
   - Should load patient list
   - Check Network tab for API call
   - Should see GET /api/patients request
   - Should have Authorization header with Bearer token

2. **Create New Patient**
   - Click "Add Patient" button
   - Fill in form
   - Submit
   - Should see POST /api/patients request
   - Should see success message

3. **View Patient Details**
   - Click on a patient
   - Should see patient details
   - Check for GET /api/patients/{id} request

---

## ?? Debugging Tools

### Backend (Swagger)

1. **Open Swagger UI**: http://localhost:5000/swagger

2. **Test Login Endpoint**:
   - Find: POST /api/auth/login
   - Click "Try it out"
   - Enter credentials
   - Click "Execute"
   - Copy the token from response

3. **Authorize Swagger**:
   - Click "Authorize" button at top
   - Enter: `Bearer YOUR_TOKEN`
   - Click "Authorize"

4. **Test Protected Endpoints**:
   - Now all endpoints will include the token
   - Try GET /api/patients
   - Try GET /api/appointments

### Frontend (DevTools)

**Network Tab**:
- Filter by "Fetch/XHR"
- Monitor all API calls
- Check request headers (should have Authorization)
- Check response status codes

**Console Tab**:
- Look for API logs (in development mode)
- Check for errors
- Use `window.apiHealthCheck` utilities

**Application Tab**:
- Check localStorage for:
  - `token`
  - `user`
  - `role`

---

## ?? Common Issues & Solutions

### Issue 1: CORS Error
```
Access to fetch at 'http://localhost:5000/api/...' from origin 'http://localhost:5173' 
has been blocked by CORS policy
```

**Solution**:
1. Check `appsettings.json` ? `CorsOrigins` includes `http://localhost:5173`
2. Restart backend server
3. Clear browser cache

---

### Issue 2: 401 Unauthorized
```
GET /api/patients 401 (Unauthorized)
```

**Solution**:
1. Check if logged in: `localStorage.getItem('token')`
2. If no token, login again
3. If token exists, check expiration (default 480 minutes)
4. Check backend JWT settings match

---

### Issue 3: Database Connection Error
```
A connection was successfully established with the server, but then an error occurred 
during the login process
```

**Solution**:
1. Verify SQL Server is running
2. Check connection string in `appsettings.json`
3. Run migrations:
   ```bash
   cd Backend
   dotnet ef database update
   ```

---

### Issue 4: Port Already in Use
```
Failed to bind to address http://localhost:5000
```

**Solution**:
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill process (use PID from above)
taskkill /PID <PID> /F

# Or change port in Backend/Properties/launchSettings.json
```

---

### Issue 5: npm Errors
```
Module not found: Error: Can't resolve '@/services'
```

**Solution**:
```powershell
cd frontend

# Clear cache and reinstall
rm -r node_modules
rm package-lock.json
npm install

# Rebuild
npm run build
```

---

## ?? API Response Examples

### Successful Login
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "firstName": "Admin",
    "lastName": "User",
    "email": "admin@clinic.com",
    "role": "Admin",
    "phone": "+1234567890",
    "isActive": true
  },
  "role": "Admin",
  "expiresAt": "2024-01-16T08:00:00Z"
}
```

### Paginated Response (Patients)
```json
{
  "items": [
    {
      "id": 1,
      "userId": 5,
      "mrn": "MRN2024000005",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-01T00:00:00",
      "gender": "Male",
      "address": "123 Main St",
      "city": "New York",
      "state": "NY",
      "postalCode": "10001",
      "isActive": true
    }
  ],
  "totalCount": 25,
  "pageNumber": 1,
  "pageSize": 20,
  "totalPages": 2,
  "hasPreviousPage": false,
  "hasNextPage": true
}
```

### Error Response
```json
{
  "message": "Invalid email or password"
}
```

---

## ? Success Indicators

### Backend Running Successfully
- ? Console shows "Now listening on: http://localhost:5000"
- ? No red error messages in console
- ? Swagger UI loads at /swagger
- ? Health check returns "Healthy"
- ? Database migrations applied

### Frontend Running Successfully
- ? Vite dev server started on port 5173
- ? Browser loads app without errors
- ? No red errors in browser console
- ? Login page loads
- ? Can navigate between pages

### Integration Working
- ? Can login successfully
- ? Token stored in localStorage
- ? API calls include Authorization header
- ? Can fetch data from API (patients, appointments, etc.)
- ? No CORS errors
- ? Error messages display correctly
- ? Auto-logout works on 401 errors

---

## ?? Next Steps After Setup

1. **Test All User Roles**
   - Login as Admin, Doctor, Nurse, Receptionist, Patient
   - Verify each role can access appropriate features
   - Test unauthorized access handling

2. **Test CRUD Operations**
   - Create patient ? Verify in database
   - Update patient ? Verify changes saved
   - Delete patient ? Verify soft delete
   - Search patients ? Verify results

3. **Test Appointment Flow**
   - Create appointment
   - Check-in patient
   - Update status
   - Cancel appointment

4. **Test Surgery Flow**
   - Schedule surgery
   - Assign team
   - Start surgery
   - Complete surgery

5. **Test Error Handling**
   - Submit invalid data
   - Try unauthorized actions
   - Disconnect backend and test error messages
   - Test network timeout

---

## ?? Need Help?

### Check Logs
**Backend Logs**: Check terminal running `dotnet run`
**Frontend Logs**: Check browser console (F12)

### Diagnostic Commands
```powershell
# Backend health
curl http://localhost:5000/health

# Frontend API health
# Open http://localhost:5173 and run in console:
await window.apiHealthCheck.runDiagnostics()

# Check database
cd Backend
dotnet ef database update
```

### Documentation
- Backend API: http://localhost:5000/swagger
- Integration Guide: See `FRONTEND_BACKEND_INTEGRATION.md`
- Project Status: See `PROJECT_STATUS.md`

---

**Status**: ? **READY FOR TESTING!**

Your application is fully configured and ready to run. Follow the steps above to start testing!
