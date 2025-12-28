import './App.css';
import { Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Unauthorized from "./components/auth/Unauthorized";
import { ROLES } from "./utils/permissions";

// ====== Auth Pages ======
import Login from "./components/auth/Login";
import Logout from "./components/auth/Logout";
import Register from "./components/auth/Register";
import Home from "./components/home/Home";

// ====== Shared Pages ======
import AddAppointmentForm from "./components/appointments/AddAppointmentForm";
import AppointmentsList from "./components/appointments/AppointmentsList";
import PatientsCard from "./components/patients/PatientsCard";
import PatientsList from "./components/patients/PatientsList";
import AddPatientForm from "./components/patients/AddPatientForm";
import EditPatientModal from './components/patients/EditPatientModal';

// ====== Clinician Pages ======
import DashBoard from "./components/dashboard/DashBoard";
import DoctorProfile from "./components/doctors/DoctorProfile";
import AddDoctorForm from "./components/doctors/AddDoctorForm";
import PrescriptionList from "./components/prescriptions/PrescriptionList";
import NewPrescription from "./components/prescriptions/NewPrescription";
import PrescriptionDetails from "./components/prescriptions/PrescriptionDetails";
import SurgeriesList from "./components/surgeries/SurgeriesList";
import NewSurgery from "./components/surgeries/NewSurgery";
import ViewSurgery from "./components/surgeries/ViewSurgery";
import EditSurgery from "./components/surgeries/EditSurgery";
import AddMedicalHistory from "./components/medicalhistory/AddMedicalHistory";
import MedicalHistoryView from "./components/medicalhistory/MedicalHistoryView";
import RoomList from "./components/rooms/RoomList";
import RoomDetails from "./components/rooms/RoomDetails";

// ====== Receptionist Pages ======
import ReceptionDashboard from "./components/reception/ReceptionDashboard";
import NewRoom from "./components/rooms/NewRoom";
import EquipmentManagement from "./components/rooms/EquipmentManagement";
import AddEquipment from "./components/rooms/AddEquipment";

// ====== Patient Pages ======
import PatientDashboard from "./components/patient/PatientDashboard";
import PatientRoomView from "./components/rooms/PatientRoomView";

// ====== Legacy/Deprecated ======
import CheckUp from "./components/checkup/CheckUp";
import NewCheckUp from "./components/checkup/NewCheckUp";
import NurseDashboard from "./components/nurse/NurseDashboard";
import MaintenanceRequest from "./components/rooms/MaintenanceRequest";

function App() {
  return (
    <Routes>
      {/* ========================================
          PUBLIC ROUTES (No Authentication)
      ======================================== */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/logout" element={<Logout />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* ========================================
          PROTECTED ROUTES (All Roles)
      ======================================== */}
      <Route element={<MainLayout />}>
        
        {/* ========================================
            CLINICIAN ROUTES (Doctor)
        ======================================== */}
        <Route path="/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <DashBoard />
          </ProtectedRoute>
        } />
        
        <Route path="/patients" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <PatientsList />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/:id" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <PatientsCard />
          </ProtectedRoute>
        } />
        
        <Route path="/add-patient" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <AddPatientForm />
          </ProtectedRoute>
        } />

        <Route path="/appointments" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <AppointmentsList />
          </ProtectedRoute>
        } />
        
        <Route path="/add-appointment" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <AddAppointmentForm />
          </ProtectedRoute>
        } />

        <Route path="/prescriptions" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <PrescriptionList />
          </ProtectedRoute>
        } />
        
        <Route path="/prescriptions/new" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <NewPrescription />
          </ProtectedRoute>
        } />
        
        <Route path="/prescriptions/:id" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <PrescriptionDetails />
          </ProtectedRoute>
        } />

        <Route path="/surgeries" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <SurgeriesList />
          </ProtectedRoute>
        } />
        
        <Route path="/surgeries/new" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <NewSurgery />
          </ProtectedRoute>
        } />
        
        <Route path="/surgeries/view/:id" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <ViewSurgery />
          </ProtectedRoute>
        } />
        
        <Route path="/surgeries/edit/:id" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <EditSurgery />
          </ProtectedRoute>
        } />

        <Route path="/patients/:id/medical-history" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <MedicalHistoryView />
          </ProtectedRoute>
        } />
        
        <Route path="/patients/:id/medical-history/new" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <AddMedicalHistory />
          </ProtectedRoute>
        } />

        <Route path="/rooms" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <RoomList />
          </ProtectedRoute>
        } />
        
        <Route path="/rooms/:id" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN, ROLES.RECEPTIONIST]}>
            <RoomDetails />
          </ProtectedRoute>
        } />

        <Route path="/doctor/profile" element={
          <ProtectedRoute allowedRoles={[ROLES.CLINICIAN]}>
            <DoctorProfile />
          </ProtectedRoute>
        } />

        {/* ========================================
            RECEPTIONIST ROUTES
        ======================================== */}
        <Route path="/reception-dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <ReceptionDashboard />
          </ProtectedRoute>
        } />

        <Route path="/rooms/new" element={
          <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <NewRoom />
          </ProtectedRoute>
        } />
        
        <Route path="/rooms/:roomId/equipment" element={
          <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <EquipmentManagement />
          </ProtectedRoute>
        } />
        
        <Route path="/rooms/:roomId/equipment/add" element={
          <ProtectedRoute allowedRoles={[ROLES.RECEPTIONIST]}>
            <AddEquipment />
          </ProtectedRoute>
        } />

        {/* ========================================
            PATIENT ROUTES
        ======================================== */}
        <Route path="/patient/dashboard" element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <PatientDashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/appointments" element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <AppointmentsList />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/prescriptions" element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <PrescriptionList />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/surgeries" element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <SurgeriesList />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/medical-history" element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <MedicalHistoryView />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/profile" element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <PatientsCard />
          </ProtectedRoute>
        } />
        
        <Route path="/patient/room" element={
          <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
            <PatientRoomView />
          </ProtectedRoute>
        } />

        {/* ========================================
            LEGACY/DEPRECATED ROUTES (Keep for backward compatibility)
        ======================================== */}
        <Route path="/checkup" element={<CheckUp />} />
        <Route path="/checkup/new" element={<NewCheckUp />} />
        <Route path="/nurse/dashboard" element={<NurseDashboard />} />
        <Route path="/rooms/:roomId/maintenance" element={<MaintenanceRequest />} />

        {/* ========================================
            CATCH-ALL: Redirect to appropriate dashboard
        ======================================== */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
