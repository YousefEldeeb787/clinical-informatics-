import { createSlice, nanoid, createSelector } from "@reduxjs/toolkit";

// Remove hardcoded mock data - appointments will be loaded from API
const appointmentsSlice = createSlice({
  name: "appointments",
  initialState: { items: [] }, // Start with empty array
  reducers: {
    // Set appointments from API
    setAppointments(state, action) {
      state.items = action.payload;
    },
    addAppointment: {
      reducer(state, action) {
        state.items.unshift(action.payload);
      },
      prepare(appt) {
        return {
          payload: {
            id: nanoid(6).toUpperCase(),
            apptId: `#${nanoid(5).toUpperCase()}`,
            ...appt,
          },
        };
      },
    },
    updateAppointment(state, action) {
      const { id, changes } = action.payload;
      const i = state.items.findIndex((x) => x.id === id);
      if (i >= 0) state.items[i] = { ...state.items[i], ...changes };
    },
    deleteAppointment(state, action) {
      const id = action.payload;
      state.items = state.items.filter((x) => x.id !== id);
    },
  },
});

export const { setAppointments, addAppointment, updateAppointment, deleteAppointment } =
  appointmentsSlice.actions;

export const selectAppointments = (s) => s.appointments.items;

export const selectStats = createSelector([selectAppointments], (rows) => {
  const total = rows.length;
  const scheduled = rows.filter((r) => r.status === "Scheduled").length;
  const completed = rows.filter((r) => r.status === "Completed").length;
  const cancelled = rows.filter((r) => r.status === "Cancelled").length;
  return { total, scheduled, completed, cancelled };
});

export default appointmentsSlice.reducer;
