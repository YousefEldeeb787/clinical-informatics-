# ?? Surgery Clinic Management System

A full-stack web application for managing a surgery clinic with features for appointments, patient records, surgeries, prescriptions, and more.

## ?? Table of Contents
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Backend Setup](#backend-setup)
- [Frontend Setup](#frontend-setup)
- [Features](#features)
- [API Documentation](#api-documentation)
- [User Roles](#user-roles)

## ?? Tech Stack

### Backend
- **.NET 8.0** - Web API Framework
- **Entity Framework Core** - ORM
- **SQL Server** - Database
- **JWT Authentication** - Security
- **AutoMapper** - Object mapping
- **FluentValidation** - Input validation
- **Swagger/OpenAPI** - API documentation

### Frontend
- **React 19** - UI Library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router** - Routing
- **Axios** - HTTP client

## ?? Project Structure

```
clini -new_update/
??? Backend/                    # .NET 8.0 Web API
?   ??? Configuration/          # App configuration classes
?   ??? Controllers/            # API Controllers
?   ??? Data/                   # DbContext and DTOs
?   ??? Exceptions/             # Custom exceptions
?   ??? Helpers/                # Helper classes (JWT, Mapping)
?   ??? Interfaces/             # Service interfaces
?   ??? Middleware/             # Custom middleware
?   ??? Migrations/             # EF Core migrations
?   ??? Models/                 # Domain models
?   ??? Repositories/           # Data access layer
?   ??? Services/               # Business logic layer
?   ??? Validators/             # FluentValidation validators
?   ??? Program.cs              # Application entry point
?   ??? appsettings.json        # Configuration
?
??? frontend/                   # React Application
    ??? public/                 # Static assets
    ??? src/
    ?   ??? assets/             # Images, fonts, etc.
    ?   ??? components/         # React components
    ?   ?   ??? appointments/   # Appointment components
    ?   ?   ??? auth/           # Authentication components
    ?   ?   ??? common/         # Reusable components
    ?   ?   ??? dashboard/      # Dashboard components
    ?   ?   ??? layout/         # Layout components
    ?   ?   ??? patients/       # Patient components
    ?   ?   ??? prescriptions/  # Prescription components
    ?   ?   ??? surgeries/      # Surgery components
    ?   ?   ??? ...
    ?   ??? features/           # Redux features
    ?   ??? services/           # API service layer
    ?   ?   ??? api.js          # Axios configuration
    ?   ?   ??? authService.js  # Auth API calls
    ?   ?   ??? patientsService.js
    ?   ?   ??? appointmentsService.js
    ?   ?   ??? ...
    ?   ??? store/              # Redux store
    ?   ?   ??? slices/         # Redux slices
    ?   ?   ??? store.js        # Store configuration
    ?   ??? utils/              # Utility functions
    ?   ??? App.jsx             # Main App component
    ?   ??? main.jsx            # Entry point
    ??? .env.development        # Dev environment variables
    ??? .env.production         # Prod environment variables
    ??? package.json
```

## ?? Getting Started

### Prerequisites
- **.NET 8.0 SDK** or later
- **Node.js 18+** and npm
- **SQL Server** (LocalDB, Express, or Full)
- **Git**

## ?? Backend Setup

### 1. Navigate to Backend Directory
```powershell
cd "D:\clini -new_update\Backend"
```

### 2. Update Database Connection String
Edit `appsettings.json` and update the connection string:
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=YOUR_SERVER;Database=SurgeryClinicDB;Trusted_Connection=True;TrustServerCertificate=True;"
  }
}
```

### 3. Restore NuGet Packages
```powershell
dotnet restore
```

### 4. Apply Database Migrations
```powershell
dotnet ef database update
```

### 5. Run the Backend
```powershell
dotnet run
```

The API will be available at:
- **HTTP**: `http://localhost:5000`
- **HTTPS**: `https://localhost:5001`
- **Swagger UI**: `http://localhost:5000/swagger`

## ?? Frontend Setup

### 1. Navigate to Frontend Directory
```powershell
cd "D:\clini -new_update\frontend"
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Configure Environment Variables
The `.env.development` file is already configured:
```env
VITE_API_BASE_URL=http://localhost:5000
VITE_APP_NAME=Surgery Clinic System
```

### 4. Run the Development Server
```powershell
npm run dev
```

The app will be available at: `http://localhost:5173`

### 5. Build for Production
```powershell
npm run build
```

## ? Features

### ????? For Clinicians (Doctors)
- View and manage appointments
- Access patient medical records
- Create and manage prescriptions
- Schedule and track surgeries
- View patient medical history
- Generate medical reports

### ????? For Receptionists
- Register new patients
- Schedule appointments
- Manage patient check-ins
- View appointment calendar
- Handle billing information

### ????? For Nurses
- View assigned patients
- Update patient vitals
- Assist in surgery preparations
- Manage room assignments
- Track medical equipment

### ?? For Patients
- View appointments
- Access medical records
- View prescriptions
- Check surgery schedule
- View billing information

### ?? For Administrators
- Manage users and roles
- System configuration
- View audit logs
- Generate reports
- Manage clinic resources

## ?? API Documentation

Once the backend is running, visit the Swagger documentation:
```
http://localhost:5000/swagger
```

### Key Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/profile` - Get user profile

#### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/{id}` - Get patient by ID
- `POST /api/patients` - Create patient
- `PUT /api/patients/{id}` - Update patient
- `DELETE /api/patients/{id}` - Delete patient

#### Appointments
- `GET /api/appointments` - Get all appointments
- `POST /api/appointments` - Create appointment
- `PUT /api/appointments/{id}` - Update appointment
- `POST /api/appointments/{id}/cancel` - Cancel appointment

#### Surgeries
- `GET /api/surgeries` - Get all surgeries
- `POST /api/surgeries` - Schedule surgery
- `PUT /api/surgeries/{id}` - Update surgery
- `PATCH /api/surgeries/{id}/status` - Update status

#### Prescriptions
- `GET /api/prescriptions` - Get all prescriptions
- `POST /api/prescriptions` - Create prescription
- `GET /api/prescriptions/{id}` - Get prescription details

## ?? User Roles

| Role | Description |
|------|-------------|
| **Admin** | Full system access and management |
| **Clinician** | Doctors who can manage patients and treatments |
| **Nurse** | Assist in patient care and surgery preparation |
| **Anesthesiologist** | Manage anesthesia for surgeries |
| **Receptionist** | Handle front desk operations |
| **Patient** | Access personal medical information |

## ?? Authentication

The system uses JWT (JSON Web Tokens) for authentication:
1. User logs in with email and password
2. Backend validates credentials
3. JWT token is generated and sent to frontend
4. Frontend stores token in localStorage
5. Token is included in subsequent API requests
6. Backend validates token for protected routes

## ?? Environment Variables

### Backend (`appsettings.json`)
- **ConnectionStrings:DefaultConnection** - Database connection
- **JwtSettings:SecretKey** - JWT secret key
- **JwtSettings:ExpirationMinutes** - Token expiration time
- **CorsOrigins** - Allowed frontend origins

### Frontend (`.env.development`)
- **VITE_API_BASE_URL** - Backend API URL

## ?? Troubleshooting

### Backend won't start
- Ensure SQL Server is running
- Check connection string in `appsettings.json`
- Run `dotnet ef database update`

### Frontend can't connect to API
- Check `VITE_API_BASE_URL` in `.env.development`
- Ensure backend is running
- Check browser console for CORS errors

### Database migration issues
```powershell
# Reset database
dotnet ef database drop
dotnet ef database update
```

## ?? License

This project is proprietary and confidential.

## ????? Development Team

For questions or support, contact the development team.

---

**Last Updated**: January 2025
