# 🔧 TROUBLESHOOTING GUIDE

## Issue: Registration/Login Errors

### Problem Description:
- Registration shows error, then success message
- Login shows "Cannot connect to server" error

### ✅ SOLUTION:

## Step 1: Make Sure Backend Is Running

**Open a terminal and run:**
```powershell
cd "d:\clini -new_update\Backend"
dotnet run
```

**You should see:**
```
Now listening on: http://localhost:5000
Application started. Press Ctrl+C to shut down.
```

**If backend is NOT running, this is why you get "Cannot connect to server" error!**

---

## Step 2: Make Sure Frontend Is Running

**Open ANOTHER terminal and run:**
```powershell
cd "d:\clini -new_update\frontend"
npm run dev
```

**You should see:**
```
VITE vX.X.X  ready in XXX ms
➜  Local:   http://localhost:5173/
```

---

## Step 3: Test Registration

1. Go to: http://localhost:5173/register
2. **Select a role**: Doctor, Receptionist, or Patient
3. **Fill the form**:
   - First Name: John
   - Last Name: Doe
   - Email: john@test.com
   - Phone: 555-1234 (optional)
   - Password: Test123!
   - Confirm Password: Test123!
4. Click **Create Account**
5. You should see: "✅ Registration successful! Please login."

---

## Step 4: Test Login

1. Go to: http://localhost:5173/login
2. **Select the SAME role** you registered with
3. Enter:
   - Email: john@test.com
   - Password: Test123!
4. Click **LOGIN**
5. You should be redirected to your dashboard

---

## Common Errors & Solutions

### Error: "Cannot connect to server"
**Cause:** Backend is not running
**Solution:** Start the backend (see Step 1)

### Error: "This account is registered as X, not Y"
**Cause:** You selected a different role at login than registration
**Solution:** Select the same role you registered with

### Error: "Email already registered"
**Cause:** You already registered with this email
**Solution:** Use a different email or login with existing account

### Error: "Invalid email or password"
**Cause:** Wrong credentials or account doesn't exist
**Solution:** Check your email/password or register first

---

## Backend Endpoints Being Used:

- **Register Patient:** POST http://localhost:5000/api/auth/register
- **Register Staff:** POST http://localhost:5000/api/auth/register-staff
- **Login:** POST http://localhost:5000/api/auth/login

---

## How to Verify Backend Is Working:

**Open browser and go to:**
```
http://localhost:5000/health
```

**You should see:** "Healthy" or similar response

---

## Quick Test Commands:

**Test if backend is responding:**
```powershell
curl http://localhost:5000/health
```

**Test if frontend is responding:**
```powershell
curl http://localhost:5173
```

---

## Still Having Issues?

1. **Check backend terminal** for error messages
2. **Check frontend terminal** for error messages  
3. **Open browser DevTools (F12)** → Console tab → Check for errors
4. **Check browser DevTools (F12)** → Network tab → See if API calls are being made

---

## ✅ Both Servers MUST Be Running!

You need TWO terminals:
- Terminal 1: Backend (dotnet run) → http://localhost:5000
- Terminal 2: Frontend (npm run dev) → http://localhost:5173

If only one is running, the app won't work!
