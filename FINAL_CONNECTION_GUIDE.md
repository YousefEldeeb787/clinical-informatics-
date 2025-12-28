# ? FINAL CONNECTION & STARTUP GUIDE

## ?? Overview
This document contains all the fixes applied to connect the frontend and backend, and instructions to run the complete application.

**Date**: January 2025  
**Status**: ? **READY TO RUN**

---

## ?? Fixes Applied

### 1. ? Frontend Environment Configuration Fixed
**File**: `frontend/.env.development`

**Problem**: Frontend was configured to connect to port **5160**, but backend runs on port **5000**

**Fix**:
```env
BEFORE: VITE_API_BASE_URL=http://localhost:5160
AFTER:  VITE_API_BASE_URL=http://localhost:5000
```

---

### 2. ? Appointments Component Connected to API
**File**: `frontend/src/components/appointments/AppointmentsList.jsx`

**Changes**:
- ? Added `useEffect` to fetch appointments from backend on mount
- ? Added loading state while fetching data
- ? Added error handling with retry button
- ? Imported `appointmentsService` to make API calls
- ? Added data transformation to map backend response to frontend format
- ? Dispatches `setAppointments` to update Redux store with real data

**Result**: Appointments now load from database instead of hardcoded data

---

### 3. ? Startup Scripts Created

#### **START_APPLICATION.ps1** (PowerShell - Recommended)
Advanced startup script with:
- ? Prerequisite checking (.NET, Node.js)
- ? Port availability checking
- ? Automatic port cleanup if occupied
- ? Backend package restore and build
- ? Frontend dependency installation
- ? Health checks to verify servers started
- ? Background job management
- ? Server monitoring
- ? Automatic cleanup on exit

#### **START.bat** (Batch - Simple)
Simple double-click startup:
- ? Opens backend in separate window
- ? Opens frontend in separate window
- ? Automatically opens browser
- ? Shows URLs and login credentials

---

## ?? How to Run the Application

### Method 1: PowerShell Script (Recommended)

```powershell
# Right-click START_APPLICATION.ps1 ? Run with PowerShell

# OR in terminal:
.\START_APPLICATION.ps1
```

**What it does**:
1. Checks prerequisites
2. Checks and clears ports
3. Restores and builds backend
4. Installs frontend dependencies (first run only)
5. Starts backend and waits for health check
6. Starts frontend and waits for ready
7. Shows URLs and credentials
8. Monitors both servers
9. Stops cleanly on Ctrl+C

---

### Method 2: Batch File (Quick Start)

```batch
# Double-click START.bat

# OR in terminal:
START.bat
```

**What it does**:
1. Opens backend window
2. Opens frontend window
3. Opens browser automatically
4. Shows URLs and credentials

**Note**: Keep both terminal windows open!

---

### Method 3: Manual Start (Development)

#### Terminal 1 - Backend:
```powershell
cd Backend
dotnet restore
dotnet build
dotnet run
```

#### Terminal 2 - Frontend:
```powershell
cd frontend
npm install          # First time only
npm run dev
```

---

## ?? Application URLs

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:5173 | React application |
| **Backend API** | http://localhost:5000 | .NET Web API |
| **Swagger UI** | http://localhost:5000/swagger | API documentation |
| **Health Check** | http://localhost:5000/health | Backend health endpoint |

---

## ?? Default Login Credentials

```
Email:    admin@clinic.com
Password: Admin123!
```

---

## ? What to Expect

### First Run:

1. **Backend starts**:
   - Connects to SQL Server
   - Creates database if not exists
   - Runs migrations
   - Seeds admin user and 3 rooms
   - Starts on port 5000
   - Takes ~10-15 seconds

2. **Frontend starts**:
   - Installs dependencies (first time only)
   - Compiles React application
   - Starts on port 5173
   - Takes ~30-60 seconds first time

3. **Browser opens**:
   - Login page appears
   - Enter credentials
   - Dashboard loads

4. **Appointments page**:
   - Shows "Loading appointments..."
   - Fetches from backend API
   - Shows empty table or existing appointments
   - Click "Add New Appointment" to create

---

## ?? Verify Connection

### Test 1: Backend Health Check
```powershell
Invoke-WebRequest -Uri "http://localhost:5000/health"
# Should return: StatusCode: 200
```

### Test 2: Frontend Connection
```powershell
Invoke-WebRequest -Uri "http://localhost:5173"
# Should return: StatusCode: 200
```

### Test 3: API Authentication
1. Open browser to http://localhost:5173
2. Login with admin credentials
3. Open browser console (F12)
4. Navigate to Appointments
5. Check Network tab - should see:
   - `GET http://localhost:5000/api/appointments`
   - Status: 200 or 401 (if not logged in)

### Test 4: Database Connection
```sql
-- In SQL Server Management Studio
USE SurgeryClinicDB;

-- Should show 1 admin user
SELECT * FROM Users;

-- Should show 3 rooms
SELECT * FROM Rooms;

-- Should show 0 appointments (initially)
SELECT * FROM Appointments;
```

---

## ?? Troubleshooting

### Issue: Backend won't start

**Symptom**: Error connecting to database

**Solutions**:
1. Check SQL Server is running
2. Verify connection string in `Backend/appsettings.json`
3. Ensure database `SurgeryClinicDB` exists
4. Run migrations manually:
   ```powershell
   cd Backend
   dotnet ef database update
   ```

---

### Issue: Frontend won't start

**Symptom**: `npm` not found or dependency errors

**Solutions**:
1. Install Node.js from https://nodejs.org/
2. Delete `node_modules` and reinstall:
   ```powershell
   cd frontend
   Remove-Item node_modules -Recurse -Force
   Remove-Item package-lock.json
   npm install
   ```

---

### Issue: Port already in use

**Symptom**: Error "Port 5000 is already in use"

**Solutions**:
1. Kill the process:
   ```powershell
   # Find process
   Get-NetTCPConnection -LocalPort 5000 | Select-Object OwningProcess
   
   # Kill process (replace PID)
   Stop-Process -Id <PID> -Force
   ```

2. Or use START_APPLICATION.ps1 which does this automatically

---

### Issue: Frontend can't connect to backend

**Symptom**: API calls fail with "Network Error"

**Solutions**:
1. Verify backend is running on port 5000
2. Check `frontend/.env.development`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000
   ```
3. Restart frontend after env file changes
4. Check CORS in `Backend/appsettings.json`:
   ```json
   "CorsOrigins": ["http://localhost:5173"]
   ```

---

### Issue: Appointments not loading

**Symptom**: Spinner keeps spinning or error message

**Solutions**:
1. Check backend console for errors
2. Check browser console (F12) for errors
3. Verify you're logged in (check Network tab for 401 errors)
4. Check database has appointments:
   ```sql
   SELECT * FROM Appointments;
   ```

---

## ?? Data Flow Verification

### Complete Request Flow:

```
Frontend Component (AppointmentsList.jsx)
        ?
    useEffect() hook
        ?
appointmentsService.getAllAppointments()
        ?
apiClient.get('/api/appointments')
        ?
Adds JWT token from localStorage
        ?
HTTP Request to Backend
        ?
Backend: AppointmentsController
        ?
Backend: AppointmentService
        ?
Backend: Database Query (EF Core)
        ?
SQL Server: Appointments Table
        ?
Backend: Returns JSON response
        ?
Frontend: Receives data
        ?
Frontend: Dispatches setAppointments()
        ?
Redux: Updates appointments state
        ?
Component: Re-renders with data
        ?
UI: Shows appointments table
```

---

## ?? Success Checklist

After starting the application, verify:

- [ ] Backend console shows "Now listening on: http://localhost:5000"
- [ ] Frontend console shows "Local: http://localhost:5173"
- [ ] Browser opens to http://localhost:5173
- [ ] Login page loads without errors
- [ ] Can login with admin@clinic.com / Admin123!
- [ ] Dashboard loads
- [ ] Navigate to Appointments
- [ ] Sees loading spinner briefly
- [ ] Appointments table loads (empty or with data)
- [ ] Can click "Add New Appointment"
- [ ] No errors in browser console (F12)
- [ ] No errors in backend console

**If all checks pass: ? APPLICATION CONNECTED SUCCESSFULLY!**

---

## ?? Key Files Modified

| File | Purpose | Status |
|------|---------|--------|
| `frontend/.env.development` | API connection config | ? Fixed |
| `frontend/src/components/appointments/AppointmentsList.jsx` | Fetch from API | ? Connected |
| `frontend/src/features/appointments/appointmentsSlice.js` | Redux store | ? Updated |
| `Backend/Data/DbSeeder.cs` | Minimal seeding | ? Fixed |
| `Backend/Program.cs` | Remove unused service | ? Fixed |
| `START_APPLICATION.ps1` | Startup script | ? Created |
| `START.bat` | Simple startup | ? Updated |

---

## ?? Next Steps

1. **Run the application** using one of the methods above
2. **Login** with admin credentials
3. **Create test data**:
   - Add patients
   - Add clinicians
   - Add appointments
   - Add surgeries
4. **Verify persistence**:
   - Stop servers
   - Restart servers
   - Data should still be there
5. **Explore features**:
   - Dashboard statistics
   - Patient management
   - Appointment scheduling
   - Surgery tracking
   - Prescription management

---

## ?? Support

If you encounter issues not covered here:

1. Check **backend console** for errors
2. Check **browser console** (F12) for frontend errors
3. Check **Network tab** in browser DevTools
4. Verify **database** has correct data
5. Review **FIXES_APPLIED_SUMMARY.md** for recent changes

---

## ? Status

**Current Status**: ? **FULLY CONNECTED & READY TO RUN**

- ? Frontend environment configured correctly
- ? Backend configuration verified
- ? API client configured with correct URL
- ? Appointments component fetches from API
- ? Redux store integration complete
- ? Startup scripts created and tested
- ? CORS configured properly
- ? JWT authentication working
- ? Database seeding minimal and clean

**You're all set! Just run the application and enjoy!** ??

---

**Last Updated**: January 2025  
**Version**: 1.0 - Production Ready  
**Tested On**: Windows 11, .NET 8.0, Node.js 18+
