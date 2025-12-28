# ?? Localhost Port Configuration Fixed

## Issue Identified
Your application had **port mismatches** causing hosting errors:
- **launchSettings.json**: Backend was trying to run on port `5160`
- **appsettings.json**: Configuration referenced port `5000`
- **Frontend .env**: Was pointing to port `5160`

This mismatch was causing the hosting error you encountered.

---

## ? Changes Applied

### 1. **Backend Port Standardization**
**File: `Backend/Properties/launchSettings.json`**
- Changed HTTP port: `5160` ? `5000`
- Changed HTTPS port: `7246` ? `5001`
- Updated IIS Express to use port `5000`

### 2. **Program.cs Configuration**
**File: `Backend/Program.cs`**
Added explicit Kestrel URL configuration:
```csharp
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenLocalhost(5000); // HTTP
    serverOptions.ListenLocalhost(5001, listenOptions =>
    {
        listenOptions.UseHttps(); // HTTPS
    });
});
```

### 3. **Frontend Environment Update**
**File: `frontend/.env.development`**
- Changed API URL: `http://localhost:5160` ? `http://localhost:5000`

---

## ?? Standardized Configuration

### Backend Ports
| Protocol | Port | URL |
|----------|------|-----|
| HTTP     | 5000 | http://localhost:5000 |
| HTTPS    | 5001 | https://localhost:5001 |

### Frontend Configuration
- **Dev Server**: `http://localhost:5173` (Vite default)
- **API Endpoint**: `http://localhost:5000`

### CORS Origins (Already Configured)
```json
"CorsOrigins": [
  "http://localhost:3000",
  "http://localhost:4200",
  "http://localhost:5173"
]
```

---

## ?? How to Start the Application

### Option 1: Use the Startup Scripts
```powershell
# Start both backend and frontend
.\start-full-app.ps1

# OR start individually
.\start-dev.ps1
```

### Option 2: Manual Start

**Backend:**
```powershell
cd Backend
dotnet run
```
Access at: http://localhost:5000/swagger

**Frontend:**
```powershell
cd frontend
npm run dev
```
Access at: http://localhost:5173

---

## ? Verification Steps

1. **Stop all running instances** of the application
2. **Restart VS Code** (to reload environment variables)
3. **Clear browser cache** or use incognito mode
4. **Start backend first**, verify it runs on port 5000
5. **Start frontend**, verify it connects to port 5000

---

## ??? Troubleshooting

### If Port 5000 is Already in Use
```powershell
# Find process using port 5000
netstat -ano | findstr :5000

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F
```

### If Still Having Issues
1. Check Windows Firewall isn't blocking port 5000
2. Ensure no other application is using port 5000
3. Try using HTTPS instead: https://localhost:5001

---

## ?? Configuration Summary

All configuration files now consistently use:
- ? Backend: `http://localhost:5000`
- ? Frontend API calls: `http://localhost:5000`
- ? CORS: Allows `http://localhost:5173`
- ? Swagger: Available at `http://localhost:5000/swagger`

---

## ?? Next Steps

1. **Restart the application** using one of the methods above
2. **Test the connection** by accessing the Swagger UI
3. **Login to the frontend** and verify API calls work correctly

The hosting error should now be resolved! ??
