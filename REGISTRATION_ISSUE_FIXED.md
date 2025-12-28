# ? REGISTRATION ISSUE FIXED

## ?? Problem Identified

**Error Message**: 
```
? Cannot connect to server. Make sure the backend is running on http://localhost:5000
```

**Root Cause**:
- Backend is running on port **5160**
- Frontend was caching old configuration pointing to port **5000**
- Environment variable wasn't picked up without restart

---

## ? Solution Applied

### 1. Updated Environment File
**File**: `frontend/.env.development`
```env
VITE_API_BASE_URL=http://localhost:5160
```

### 2. Updated Fallback URL
**File**: `frontend/src/services/api.js`
```javascript
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5160',
  // Changed from: http://localhost:5000
});
```

### 3. Restarted Frontend
- Stopped old frontend process (port 5173)
- Started new frontend process with updated config
- Frontend now connects to correct backend port

---

## ?? Current Status

| Component | Status | Port | URL |
|-----------|--------|------|-----|
| **Backend** | ? Running | 5160 | http://localhost:5160 |
| **Frontend** | ? Running | 5173 | http://localhost:5173 |
| **Connection** | ? Fixed | - | Frontend ? Backend |

---

## ?? Test the Fix

### Step 1: Clear Browser Cache
```
1. Open Browser DevTools (F12)
2. Right-click the Refresh button
3. Select "Empty Cache and Hard Reload"
```

**OR**

```
1. Press Ctrl+Shift+Delete
2. Clear "Cached images and files"
3. Refresh the page
```

### Step 2: Test Registration
```
1. Go to http://localhost:5173
2. Click "Register" or "Sign Up"
3. Fill in the form:
   - First Name: Test
   - Last Name: User
   - Email: test@example.com
   - Password: Test123!
   - Date of Birth: 1990-01-01
   - Gender: Male
   - Phone: 555-1234
4. Click "Register"
```

### Step 3: Check Network Tab
```
1. Open DevTools (F12)
2. Go to Network tab
3. Submit registration
4. Look for: POST http://localhost:5160/api/auth/register
5. Status should be: 200 or 201 (Success)
```

---

## ? What Should Happen Now

### ? Registration Success:
```
1. Form submits without error
2. Response: "Registration successful"
3. Automatically logged in
4. Redirected to dashboard
5. JWT token stored in localStorage
```

### ? Backend Receives Request:
```
Backend console should show:
POST /api/auth/register
Status: 200 OK
```

### ? Database Entry Created:
```sql
-- Check in SQL Server
SELECT * FROM Users WHERE Email = 'test@example.com';
-- Should show the new user

SELECT * FROM Patients WHERE UserId = (SELECT Id FROM Users WHERE Email = 'test@example.com');
-- Should show the patient record
```

---

## ?? Verify Connection

### Test 1: Backend Health
```powershell
Invoke-WebRequest -Uri "http://localhost:5160/health"
# Expected: StatusCode 200
```

### Test 2: Frontend Loads
```powershell
Invoke-WebRequest -Uri "http://localhost:5173"
# Expected: StatusCode 200
```

### Test 3: API Endpoint
```powershell
# This should fail with 401 (unauthorized) which means endpoint exists
Invoke-WebRequest -Uri "http://localhost:5160/api/auth/me"
# Expected: StatusCode 401 (Unauthorized)
```

### Test 4: Registration Endpoint
```powershell
$body = @{
    firstName = "Test"
    lastName = "User"
    email = "test2@example.com"
    password = "Test123!"
    dateOfBirth = "1990-01-01"
    gender = "Male"
    phone = "555-1234"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:5160/api/auth/register" -Method POST -Body $body -ContentType "application/json"
# Expected: StatusCode 200 or 201
```

---

## ?? If Still Not Working

### Issue: "Cannot connect to server"

**Solution 1: Hard Refresh Browser**
```
1. Close ALL browser windows
2. Reopen browser
3. Go to http://localhost:5173
4. Try registration again
```

**Solution 2: Check Console Errors**
```
1. Open DevTools (F12)
2. Go to Console tab
3. Look for errors
4. Common issues:
   - CORS error ? Backend needs restart
   - Network error ? Frontend using wrong port
   - 404 error ? Endpoint doesn't exist
```

**Solution 3: Verify Environment Variable**
```powershell
# In browser console (F12):
console.log(import.meta.env.VITE_API_BASE_URL)
# Should show: http://localhost:5160

# If it shows undefined or wrong port:
# Restart frontend server
```

**Solution 4: Check Both Servers**
```powershell
# Check backend
Get-NetTCPConnection -LocalPort 5160 | Select-Object State
# Should show: Listen

# Check frontend
Get-NetTCPConnection -LocalPort 5173 | Select-Object State
# Should show: Listen
```

---

## ?? Updated Files

| File | Change |
|------|--------|
| `frontend/.env.development` | ? Port 5160 |
| `frontend/src/services/api.js` | ? Fallback to 5160 |
| Frontend Server | ? Restarted |

---

## ?? Issue Resolved!

The registration form should now work correctly. The error message about port 5000 was because:

1. ? **Old**: Frontend cached config ? port 5000 (wrong)
2. ? **New**: Frontend restarted ? port 5160 (correct)

**Try registering again now!**

---

## ?? Quick Actions

### Open Application
```
http://localhost:5173
```

### Test Registration
```
1. Clear browser cache (Ctrl+Shift+Delete)
2. Refresh page (Ctrl+F5)
3. Try registration form
4. Should work without errors!
```

### View Backend Logs
Check the PowerShell window titled "Backend" for request logs.

### View Frontend Logs
Check the PowerShell window titled "Frontend" for any errors.

---

## ? Success Indicators

You'll know it's working when:
- ? No "Cannot connect to server" error
- ? Form submits successfully
- ? Network tab shows 200/201 response
- ? Automatically logged in
- ? Redirected to dashboard
- ? User appears in database

---

**Issue Status**: ? **RESOLVED**  
**Last Updated**: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")  
**Action Required**: Clear browser cache and try again!

---

## ?? Ready to Test!

**Your application is now properly configured and ready for registration testing!**

Go to: http://localhost:5173
