import { configureStore } from "@reduxjs/toolkit";
import appointmentsReducer from "../features/appointments/appointmentsSlice";
import authReducer from "./slices/authSlice";
import patientsReducer from "./slices/patientsSlice";
import aiAssistantReducer from "./slices/aiAssistantSlice";

export const store = configureStore({
  reducer: {
    appointments: appointmentsReducer,
    auth: authReducer,
    patients: patientsReducer,
    aiAssistant: aiAssistantReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['auth/login/fulfilled', 'auth/register/fulfilled'],
      },
    }),
});

export default store;
