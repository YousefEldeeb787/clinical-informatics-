// Room Management Utilities

export const ROOM_TYPES = [
  "Patient Room",
  "Emergency Room",
  "ICU Room",
  "Operating Room",
  "Recovery Room",
  "Equipment Room",
  "Tool Storage Room",
  "Admin Room",
  "Special Unit",
];

export const ROOM_STATUSES = [
  "Available",
  "Occupied",
  "Cleaning",
  "Maintenance",
];

export const EQUIPMENT_CATEGORIES = [
  "Bed",
  "Monitor",
  "Tool",
  "Device",
  "Machine",
  "Supply",
  "Other",
];

export const EQUIPMENT_CONDITIONS = [
  "Good",
  "Needs Repair",
  "Broken",
  "Under Maintenance",
];

export const MAINTENANCE_PRIORITIES = [
  "Low",
  "Medium",
  "High",
  "Urgent",
];

export const MAINTENANCE_STATUSES = [
  "Pending",
  "In Progress",
  "Completed",
];

// Room permissions based on role
export const ROOM_PERMISSIONS = {
  doctor: {
    viewRoomList: true,
    viewSingleRoom: true,
    editRoom: false,
    assignPatient: false,
    manageEquipment: false,
    transferPatient: false,
    requestMaintenance: true,
  },
  nurse: {
    viewRoomList: true,
    viewSingleRoom: true,
    editRoom: true,
    assignPatient: true,
    manageEquipment: true,
    transferPatient: true,
    requestMaintenance: true,
  },
  patient: {
    viewRoomList: false,
    viewSingleRoom: true, // own room only
    editRoom: false,
    assignPatient: false,
    manageEquipment: false,
    transferPatient: false,
    requestMaintenance: false,
  },
};

// Get rooms from localStorage
export const getRooms = () => {
  return JSON.parse(localStorage.getItem("rooms") || "[]");
};

// Save rooms to localStorage
export const saveRooms = (rooms) => {
  localStorage.setItem("rooms", JSON.stringify(rooms));
};

// Get equipment from localStorage
export const getEquipment = () => {
  return JSON.parse(localStorage.getItem("equipment") || "[]");
};

// Save equipment to localStorage
export const saveEquipment = (equipment) => {
  localStorage.setItem("equipment", JSON.stringify(equipment));
};

// Get maintenance requests from localStorage
export const getMaintenanceRequests = () => {
  return JSON.parse(localStorage.getItem("maintenanceRequests") || "[]");
};

// Save maintenance requests to localStorage
export const saveMaintenanceRequests = (requests) => {
  localStorage.setItem("maintenanceRequests", JSON.stringify(requests));
};

// Add history log to room
export const addRoomHistory = (roomId, action, user, oldValue = null, newValue = null) => {
  const rooms = getRooms();
  const room = rooms.find((r) => r.id === roomId);
  if (!room) return;

  const historyEntry = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    action,
    user: user.fullName || user.email || "System",
    userRole: user.role || "system",
    oldValue,
    newValue,
  };

  if (!room.history) {
    room.history = [];
  }
  room.history.push(historyEntry);

  saveRooms(rooms);
  return historyEntry;
};

// Check if user can access room
export const canAccessRoom = (room, user) => {
  const role = user?.role || localStorage.getItem("role");
  
  if (role === "patient") {
    // Patient can only see their own room
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
    return room.assignedPatient === currentUser.linkedPatientId;
  }
  
  return true; // Doctor and Nurse can see all rooms
};

