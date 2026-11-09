/**
 * MediBridge - Storage Management Module
 * Handles safe localStorage persistence, retrieval, and initial starter data.
 */

const STORAGE_KEYS = {
  MEDICINES: 'medibridge_medicines_v1',
  APPOINTMENTS: 'medibridge_appointments_v1',
  CHAT_HISTORY: 'medibridge_chat_history_v1',
  BOOKMARKS: 'medibridge_bookmarks_v1',
  USER_SETTINGS: 'medibridge_settings_v1',
};

// Neutral sample data for everyday personal healthcare tracking
const INITIAL_MEDICINES = [
  {
    id: 'med-1',
    name: 'Daily Multivitamin',
    dosage: '1 tablet',
    frequency: 'Once Daily',
    time: '08:30',
    instruction: 'Take with breakfast and a glass of water',
    category: 'Daily Wellness',
    totalQuantity: 30,
    remainingQuantity: 28,
    takenToday: false,
    lastTaken: null,
    createdAt: new Date().toISOString(),
  },
  {
    id: 'med-2',
    name: 'Evening Hydration & Rest Routine',
    dosage: '1 glass',
    frequency: 'Nightly',
    time: '20:30',
    instruction: 'Drink water and begin screen-free wind down',
    category: 'Evening Routine',
    totalQuantity: 30,
    remainingQuantity: 24,
    takenToday: false,
    lastTaken: null,
    createdAt: new Date().toISOString(),
  }
];

const getFutureDate = (daysAhead, hours = 10, minutes = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + daysAhead);
  d.setHours(hours, minutes, 0, 0);
  return d.toISOString();
};

const INITIAL_APPOINTMENTS = [
  {
    id: 'apt-1',
    doctorName: 'Annual Wellness Checkup',
    specialty: 'Preventive Primary Care',
    dateTime: getFutureDate(3, 10, 30), // 3 days ahead at 10:30 AM
    location: 'Community Health Center',
    type: 'In-Person',
    purpose: 'Routine preventive health screening & wellness conversation',
    status: 'upcoming', // upcoming, completed, cancelled
    reminderOffset: '1_day',
    notes: 'Bring questions about daily nutrition, energy levels, and routine blood tests.',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'apt-2',
    doctorName: 'Routine Dental Cleaning',
    specialty: 'Oral Wellness',
    dateTime: getFutureDate(12, 14, 0), // 12 days ahead at 2:00 PM
    location: 'Dental Wellness Clinic',
    type: 'In-Person',
    purpose: 'Routine 6-month cleaning and preventive exam',
    status: 'upcoming',
    reminderOffset: '2_hours',
    notes: 'Bring appointment confirmation and insurance/wellness card.',
    createdAt: new Date().toISOString(),
  }
];

const INITIAL_SETTINGS = {
  soundEnabled: true,
  theme: 'light',
  notificationsRequested: false,
};

const StorageService = {
  // Generic safe get
  get(key, fallback = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch (err) {
      console.warn(`[StorageService] Failed to parse item for key "${key}":`, err);
      return fallback;
    }
  },

  // Generic safe set
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (err) {
      console.error(`[StorageService] Failed to set item for key "${key}":`, err);
      return false;
    }
  },

  // Medicines
  getMedicines() {
    let meds = this.get(STORAGE_KEYS.MEDICINES);
    if (!meds || !Array.isArray(meds)) {
      meds = INITIAL_MEDICINES;
      this.set(STORAGE_KEYS.MEDICINES, meds);
    }
    // Check if day changed to reset daily "takenToday" flag if needed
    const todayStr = new Date().toISOString().split('T')[0];
    let modified = false;
    meds.forEach(med => {
      if (med.lastTaken) {
        const lastTakenDay = med.lastTaken.split('T')[0];
        if (lastTakenDay !== todayStr && med.takenToday) {
          med.takenToday = false;
          modified = true;
        }
      }
    });
    if (modified) {
      this.set(STORAGE_KEYS.MEDICINES, meds);
    }
    return meds;
  },

  saveMedicines(medicines) {
    return this.set(STORAGE_KEYS.MEDICINES, medicines);
  },

  // Appointments
  getAppointments() {
    let appts = this.get(STORAGE_KEYS.APPOINTMENTS);
    if (!appts || !Array.isArray(appts)) {
      appts = INITIAL_APPOINTMENTS;
      this.set(STORAGE_KEYS.APPOINTMENTS, appts);
    }
    return appts;
  },

  saveAppointments(appointments) {
    return this.set(STORAGE_KEYS.APPOINTMENTS, appointments);
  },

  // Chat History
  getChatHistory() {
    return this.get(STORAGE_KEYS.CHAT_HISTORY, []);
  },

  saveChatHistory(history) {
    return this.set(STORAGE_KEYS.CHAT_HISTORY, history);
  },

  clearChatHistory() {
    return this.set(STORAGE_KEYS.CHAT_HISTORY, []);
  },

  // Bookmarks
  getBookmarks() {
    return this.get(STORAGE_KEYS.BOOKMARKS, ['art-1', 'art-4']);
  },

  saveBookmarks(bookmarks) {
    return this.set(STORAGE_KEYS.BOOKMARKS, bookmarks);
  },

  // Settings
  getSettings() {
    return this.get(STORAGE_KEYS.USER_SETTINGS, INITIAL_SETTINGS);
  },

  saveSettings(settings) {
    return this.set(STORAGE_KEYS.USER_SETTINGS, settings);
  },

  // Reset entire application data
  resetDefaults() {
    this.set(STORAGE_KEYS.MEDICINES, INITIAL_MEDICINES);
    this.set(STORAGE_KEYS.APPOINTMENTS, INITIAL_APPOINTMENTS);
    this.set(STORAGE_KEYS.CHAT_HISTORY, []);
    this.set(STORAGE_KEYS.BOOKMARKS, ['art-1', 'art-4']);
    this.set(STORAGE_KEYS.USER_SETTINGS, INITIAL_SETTINGS);
  }
};

window.StorageService = StorageService;
