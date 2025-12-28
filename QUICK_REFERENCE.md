# ?? Quick Reference Guide

## ?? Installation (First Time Only)

```powershell
cd "D:\clini -new_update"
.\setup.ps1
```

## ?? Start Development

```powershell
cd "D:\clini -new_update"
.\start-dev.ps1
```

## ?? URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| Swagger Docs | http://localhost:5000/swagger |

## ?? Default Test Credentials

(After database seeding)

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@clinic.com | Admin123! |
| Doctor | doctor@clinic.com | Doctor123! |
| Patient | patient@clinic.com | Patient123! |

## ??? Common Commands

### Backend
```powershell
cd Backend

# Build
dotnet build

# Run
dotnet run

# Create migration
dotnet ef migrations add MigrationName

# Update database
dotnet ef database update

# Rollback database
dotnet ef database update PreviousMigrationName
```

### Frontend
```powershell
cd frontend

# Install packages
npm install

# Dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint
npm run lint
```

## ?? Important Files

### Configuration
- `Backend/appsettings.json` - Backend config (DB, JWT, CORS)
- `frontend/.env.development` - Frontend dev config
- `frontend/.env.production` - Frontend prod config

### Entry Points
- `Backend/Program.cs` - Backend startup
- `frontend/src/main.jsx` - Frontend entry
- `frontend/src/App.jsx` - Main React component

### API Services
- `frontend/src/services/api.js` - Axios config
- `frontend/src/services/authService.js` - Auth API
- `frontend/src/services/patientsService.js` - Patients API
- `frontend/src/services/appointmentsService.js` - Appointments API

### State Management
- `frontend/src/store/store.js` - Redux store
- `frontend/src/store/slices/authSlice.js` - Auth state
- `frontend/src/store/slices/patientsSlice.js` - Patients state

## ?? Troubleshooting

### Backend won't start
```powershell
# Check SQL Server is running
# Update connection string in appsettings.json
cd Backend
dotnet ef database update
```

### Frontend can't connect to API
```powershell
# Check backend is running on port 5000
# Check .env.development has correct URL
# Check browser console for errors
```

### Database errors
```powershell
cd Backend

# Drop and recreate
dotnet ef database drop
dotnet ef database update

# Or reset specific migration
dotnet ef migrations remove
```

### Port already in use
```powershell
# Find and kill process on port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Find and kill process on port 5173 (frontend)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

## ?? Testing with Swagger

1. Start backend: `cd Backend; dotnet run`
2. Open: http://localhost:5000/swagger
3. Click "Authorize" button
4. Login to get token
5. Paste token in format: `Bearer YOUR_TOKEN`
6. Test endpoints

## ?? API Testing with curl

### Login
```bash
curl -X POST "http://localhost:5000/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@clinic.com","password":"Admin123!"}'
```

### Get Patients (with token)
```bash
curl -X GET "http://localhost:5000/api/patients" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## ?? Component Structure

```
components/
??? appointments/    # Appointment management
??? auth/           # Login, Register, Logout
??? dashboard/      # Main dashboard
??? doctors/        # Doctor management
??? layout/         # Navbar, Sidebar, Footer
??? patients/       # Patient management
??? prescriptions/  # Prescription management
??? surgeries/      # Surgery management
```

## ?? Git Workflow

```bash
# Check status
git status

# Add changes
git add .

# Commit
git commit -m "Description of changes"

# Push to remote
git push origin main

# Pull latest changes
git pull origin main

# Create new branch
git checkout -b feature-name

# Switch branch
git checkout branch-name
```

## ?? Project Stats

- **Backend**: .NET 8.0, 14+ Controllers, 20+ Models
- **Frontend**: React 19, 50+ Components, Vite
- **Database**: SQL Server, 20+ Tables
- **Authentication**: JWT with 6 user roles

## ?? Useful Links

- [.NET Documentation](https://learn.microsoft.com/en-us/dotnet/)
- [React Documentation](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Axios Documentation](https://axios-http.com/)

## ?? Need Help?

1. Check `README.md` for detailed setup
2. Check `API_INTEGRATION.md` for API usage
3. Check `PROJECT_STATUS.md` for current state
4. Review Swagger docs at http://localhost:5000/swagger
5. Check browser console for frontend errors
6. Check terminal for backend errors

## ?? Quick Tasks

### Add New API Endpoint (Backend)
1. Add method to controller in `Controllers/`
2. Implement logic in service in `Services/`
3. Test in Swagger

### Add New Page (Frontend)
1. Create component in `components/`
2. Add route in `App.jsx`
3. Create service method if needed in `services/`
4. Add to Redux store if needed in `store/slices/`

### Connect Component to API
```jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPatients } from '../store/slices/patientsSlice';

function PatientsList() {
  const dispatch = useDispatch();
  const { patients, loading } = useSelector(state => state.patients);

  useEffect(() => {
    dispatch(fetchPatients());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {patients.map(patient => (
        <div key={patient.id}>{patient.name}</div>
      ))}
    </div>
  );
}
```

## ? Performance Tips

- Use React.memo() for expensive components
- Use useMemo() and useCallback() hooks
- Lazy load routes with React.lazy()
- Use pagination for large lists
- Add indexes to database queries
- Use async/await properly

## ?? Security Checklist

- [x] JWT authentication enabled
- [x] Password hashing (BCrypt)
- [x] CORS configured
- [x] HTTPS support
- [ ] Rate limiting (to implement)
- [ ] Input sanitization (to implement)
- [ ] CSRF protection (to implement)

---

**Keep this file handy for quick reference during development!**
