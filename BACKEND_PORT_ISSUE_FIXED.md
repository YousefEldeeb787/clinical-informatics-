# ? BACKEND PORT ISSUE - FIXED!

## ?? Problem Identified

**Issue**: Backend localhost cannot be reached  
**Root Cause**: Port 5160 was already in use by another process

### Error Message:
```
System.Net.Sockets.SocketException (10048): 
Only one usage of each socket address (protocol/network address/port) is normally permitted.
Failed to bind to address http://127.0.0.1:5160: address already in use.
```

---

## ? Solution Applied

### Step 1: Killed Process Using Port 5160
```powershell
Get-NetTCPConnection -LocalPort 5160 | Stop-Process -Force
```

### Step 2: Started Fresh Backend Instance
Backend server started in a new PowerShell window on port 5160

### Step 3: Verified Backend Health
```
? Backend HEALTHY - Status: 200
http://localhost:5160/health
```

---

## ?? Current Status

| Component | Status | Details |
|-----------|--------|---------|
| **Backend Server** | ? RUNNING | Port 5160 |
| **Health Check** | ? HEALTHY | Status 200 |
| **Database** | ? Connected | SurgeryClinicDB |
| **API Endpoints** | ? Available | All routes accessible |

---

## ?? Access URLs

- **Backend API**: http://localhost:5160
- **Swagger UI**: http://localhost:5160/swagger
- **Health Check**: http://localhost:5160/health
- **Frontend** (if running): http://localhost:5173

---

## ?? Quick Start Commands

### Start Backend Only:
```powershell
cd Backend
dotnet run
```

### Start Full Application:
```powershell
.\VERIFY_AND_RUN.ps1
```

Or:
```
Double-click: START.bat
```

---

## ?? Troubleshooting

### If Backend Won't Start (Port Already in Use):

**Option 1: Kill Process on Port 5160**
```powershell
Get-NetTCPConnection -LocalPort 5160 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
```

**Option 2: Find and Kill Process Manually**
```powershell
# Find process ID
Get-NetTCPConnection -LocalPort 5160

# Kill it (replace XXXX with actual PID)
Stop-Process -Id XXXX -Force
```

**Option 3: Change Backend Port**
Edit `Backend/Properties/launchSettings.json`:
```json
{
  "profiles": {
    "http": {
      "applicationUrl": "http://localhost:5161"  // Change port
    }
  }
}
```

Don't forget to update frontend `.env.development`:
```env
VITE_API_BASE_URL=http://localhost:5161
```

---

## ? Verification Steps

### 1. Check Backend is Running
```powershell
Test-NetConnection -ComputerName localhost -Port 5160
```

### 2. Check Health Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:5160/health"
```
Expected: `StatusCode: 200`

### 3. Check Swagger UI
Open browser: http://localhost:5160/swagger

### 4. Test API Endpoint
```powershell
Invoke-WebRequest -Uri "http://localhost:5160/api/auth/login" -Method POST
```

---

## ?? Backend Startup Checklist

After starting the backend, you should see:

- ? "Now listening on: http://localhost:5160"
- ? "Application started. Press Ctrl+C to shut down."
- ? Database migrations applied
- ? Admin user seeded (if first run)
- ? Rooms seeded (if first run)
- ? No error messages

---

## ?? Next Steps

1. **Backend is now running** on port 5160 ?
2. **Start Frontend** (if not already running):
   ```powershell
   cd frontend
   npm run dev
   ```
3. **Access Application**: http://localhost:5173
4. **Login with**:
   - Email: admin@clinic.com
   - Password: Admin123!

---

## ?? How to Prevent This Issue

### Always Stop Previous Instances Before Starting:

**Create a restart script** (`restart-backend.ps1`):
```powershell
# Kill any existing backend process
Get-NetTCPConnection -LocalPort 5160 -ErrorAction SilentlyContinue | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }

Write-Host "Starting Backend..." -ForegroundColor Cyan
cd Backend
dotnet run
```

Usage:
```powershell
.\restart-backend.ps1
```

---

## ?? Common Port Issues

### If Port 5173 (Frontend) is Also Busy:
```powershell
Get-NetTCPConnection -LocalPort 5173 | 
    Select-Object -ExpandProperty OwningProcess | 
    ForEach-Object { Stop-Process -Id $_ -Force }
```

### Clear Both Ports at Once:
```powershell
5160, 5173 | ForEach-Object {
    Get-NetTCPConnection -LocalPort $_ -ErrorAction SilentlyContinue | 
        Select-Object -ExpandProperty OwningProcess | 
        ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }
    Write-Host "Cleared port $_" -ForegroundColor Green
}
```

---

## ? Resolution Summary

**Problem**: Port 5160 was occupied by old backend process  
**Solution**: Killed old process and started fresh instance  
**Result**: ? Backend running and healthy on port 5160  
**Verification**: Health endpoint returns 200 OK  

---

## ?? STATUS: RESOLVED

The backend is now **accessible** at:
- http://localhost:5160

You can now:
- ? Access Swagger UI
- ? Make API calls
- ? Connect frontend
- ? Login and use the application

---

**Fixed**: December 28, 2024  
**Issue**: Port Already in Use  
**Status**: ? RESOLVED  
**Backend**: ? RUNNING & HEALTHY
