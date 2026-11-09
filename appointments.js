/**
 * MediBridge - Appointment Reminders Module
 * Handles scheduling, listing, status updates, and calendar downloads.
 */

const AppointmentsManager = {
  appointments: [],
  currentFilter: 'upcoming', // 'upcoming', 'all', 'completed'

  init() {
    this.appointments = window.StorageService.getAppointments();
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    const form = document.getElementById('add-appointment-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddAppointment(form);
      });
    }

    // Reset modal to Add Mode when any schedule-appointment button is clicked
    document.querySelectorAll('[data-modal-target="add-apt-modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resetModalToAddMode();
      });
    });

    // Filter tabs
    const filterButtons = document.querySelectorAll('[data-apt-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.getAttribute('data-apt-filter');
        this.render();
      });
    });
  },

  resetModalToAddMode() {
    const idInput = document.getElementById('apt-id');
    const titleEl = document.getElementById('add-apt-title');
    const submitBtn = document.getElementById('apt-submit-btn');
    const form = document.getElementById('add-appointment-form');

    if (idInput) idInput.value = '';
    if (titleEl) titleEl.textContent = 'Schedule Upcoming Appointment';
    if (submitBtn) submitBtn.textContent = 'Schedule Visit';
    if (form) {
      form.reset();
      const dateInput = document.getElementById('apt-date');
      if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.value = today;
      }
    }
  },

  openEditModal(aptId) {
    const apt = this.appointments.find(a => a.id === aptId);
    if (!apt) return;

    const idInput = document.getElementById('apt-id');
    const doctorInput = document.getElementById('apt-doctor');
    const specialtyInput = document.getElementById('apt-specialty');
    const dateInput = document.getElementById('apt-date');
    const timeInput = document.getElementById('apt-time');
    const locationInput = document.getElementById('apt-location');
    const typeInput = document.getElementById('apt-type');
    const purposeInput = document.getElementById('apt-purpose');
    const notesInput = document.getElementById('apt-notes');
    const titleEl = document.getElementById('add-apt-title');
    const submitBtn = document.getElementById('apt-submit-btn');

    if (idInput) idInput.value = apt.id;
    if (doctorInput) doctorInput.value = apt.doctorName;
    if (specialtyInput) specialtyInput.value = apt.specialty;
    if (typeInput) typeInput.value = apt.type;

    if (apt.dateTime) {
      const parts = apt.dateTime.split('T');
      if (dateInput && parts[0]) dateInput.value = parts[0];
      if (timeInput && parts[1]) timeInput.value = parts[1].substring(0, 5);
    }

    if (locationInput) locationInput.value = apt.location;
    if (purposeInput) purposeInput.value = apt.purpose;
    if (notesInput) notesInput.value = apt.notes || '';

    if (titleEl) titleEl.textContent = 'Edit Appointment';
    if (submitBtn) submitBtn.textContent = 'Save Changes';

    window.MediApp.openModal('add-apt-modal');
  },

  handleAddAppointment(form) {
    const idInput = document.getElementById('apt-id');
    const doctorInput = document.getElementById('apt-doctor');
    const specialtyInput = document.getElementById('apt-specialty');
    const dateInput = document.getElementById('apt-date');
    const timeInput = document.getElementById('apt-time');
    const locationInput = document.getElementById('apt-location');
    const typeInput = document.getElementById('apt-type');
    const purposeInput = document.getElementById('apt-purpose');
    const notesInput = document.getElementById('apt-notes');

    if (!doctorInput.value.trim() || !dateInput.value || !timeInput.value) {
      window.MediApp.showToast('Please fill in appointment title, date, and time.', 'error');
      return;
    }

    const fullDateTime = `${dateInput.value}T${timeInput.value}:00`;
    const aptId = idInput ? idInput.value : '';

    if (aptId) {
      // Editing existing appointment
      const existing = this.appointments.find(a => a.id === aptId);
      if (existing) {
        existing.doctorName = doctorInput.value.trim();
        existing.specialty = specialtyInput.value.trim() || 'General Wellness';
        existing.dateTime = fullDateTime;
        existing.location = locationInput.value.trim() || 'Community Clinic';
        existing.type = typeInput.value || 'In-Person';
        existing.purpose = purposeInput.value.trim() || 'Routine Consultation';
        existing.notes = notesInput.value.trim() || '';

        this.sortAppointments();
        window.StorageService.saveAppointments(this.appointments);

        window.MediApp.closeModal('add-apt-modal');
        window.MediApp.showToast(`Updated appointment "${existing.doctorName}"!`, 'success');
        this.resetModalToAddMode();
        this.render();
        window.MediApp.updateDashboardStats();
        return;
      }
    }

    // Adding new appointment
    const newApt = {
      id: 'apt-' + Date.now(),
      doctorName: doctorInput.value.trim(),
      specialty: specialtyInput.value.trim() || 'General Wellness',
      dateTime: fullDateTime,
      location: locationInput.value.trim() || 'Community Clinic',
      type: typeInput.value || 'In-Person',
      purpose: purposeInput.value.trim() || 'Routine Consultation',
      notes: notesInput.value.trim() || '',
      status: 'upcoming',
      createdAt: new Date().toISOString()
    };

    this.appointments.unshift(newApt);
    // Sort appointments chronologically
    this.sortAppointments();
    window.StorageService.saveAppointments(this.appointments);

    form.reset();
    window.MediApp.closeModal('add-apt-modal');
    window.MediApp.showToast(`Appointment "${newApt.doctorName}" saved!`, 'success');

    this.render();
    window.MediApp.updateDashboardStats();
  },

  sortAppointments() {
    this.appointments.sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
  },

  toggleComplete(aptId) {
    const apt = this.appointments.find(a => a.id === aptId);
    if (!apt) return;

    if (apt.status === 'completed') {
      apt.status = 'upcoming';
      window.MediApp.showToast(`Appointment status updated to Upcoming.`, 'info');
    } else {
      apt.status = 'completed';
      window.MediApp.showToast(`Marked "${apt.doctorName}" as completed.`, 'success');
    }

    window.StorageService.saveAppointments(this.appointments);
    this.render();
    window.MediApp.updateDashboardStats();
  },

  deleteAppointment(aptId) {
    const apt = this.appointments.find(a => a.id === aptId);
    if (!apt) return;

    if (confirm(`Remove appointment "${apt.doctorName}"?`)) {
      this.appointments = this.appointments.filter(a => a.id !== aptId);
      window.StorageService.saveAppointments(this.appointments);
      window.MediApp.showToast(`Appointment removed.`, 'info');
      this.render();
      window.MediApp.updateDashboardStats();
    }
  },

  formatDate(isoStr) {
    try {
      const d = new Date(isoStr);
      return d.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return isoStr;
    }
  },

  formatTime(isoStr) {
    try {
      const d = new Date(isoStr);
      return d.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch {
      return '';
    }
  },

  getRelativeStatus(isoStr, status) {
    if (status === 'completed') {
      return { label: 'Completed', className: 'badge-completed' };
    }

    const now = new Date();
    const aptDate = new Date(isoStr);
    const diffMs = aptDate - now;
    const diffHours = diffMs / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffHours / 24);

    if (diffMs < 0 && Math.abs(diffHours) > 12) {
      return { label: 'Past Due', className: 'badge-warning' };
    }

    if (diffHours >= 0 && diffHours <= 24) {
      return { label: 'Today / Soon', className: 'badge-urgent' };
    }

    if (diffDays === 1) {
      return { label: 'Tomorrow', className: 'badge-info' };
    }

    if (diffDays <= 7) {
      return { label: `In ${diffDays} days`, className: 'badge-info' };
    }

    return { label: `In ${diffDays} days`, className: 'badge-neutral' };
  },

  downloadICS(aptId) {
    const apt = this.appointments.find(a => a.id === aptId);
    if (!apt) return;

    const startDate = new Date(apt.dateTime);
    const endDate = new Date(startDate.getTime() + 60 * 60 * 1000); // 1 hour duration

    const formatDateICS = (date) => {
      return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    };

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//MediBridge Healthcare//EN',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `SUMMARY:Medical Appt: ${apt.doctorName} (${apt.specialty})`,
      `DESCRIPTION:Purpose: ${apt.purpose}\\nNotes: ${apt.notes}`,
      `LOCATION:${apt.location}`,
      `DTSTART:${formatDateICS(startDate)}`,
      `DTEND:${formatDateICS(endDate)}`,
      'STATUS:CONFIRMED',
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `MediBridge-Appt-${apt.doctorName.replace(/[^a-zA-Z0-9]/g, '_')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    window.MediApp.showToast('Downloaded calendar invite file (.ics)!', 'success');
  },

  render() {
    const container = document.getElementById('appointments-list');
    const emptyState = document.getElementById('appointments-empty');

    if (!container) return;

    let filtered = this.appointments;
    const now = new Date();

    if (this.currentFilter === 'upcoming') {
      filtered = this.appointments.filter(a => a.status === 'upcoming');
    } else if (this.currentFilter === 'completed') {
      filtered = this.appointments.filter(a => a.status === 'completed');
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(apt => {
      const isCompleted = apt.status === 'completed';
      const statusInfo = this.getRelativeStatus(apt.dateTime, apt.status);
      const formattedDate = this.formatDate(apt.dateTime);
      const formattedTime = this.formatTime(apt.dateTime);

      return `
        <article class="apt-card ${isCompleted ? 'is-completed' : ''}" data-id="${apt.id}">
          <div class="apt-left-bar">
            <div class="apt-date-badge">
              <span class="date-month">${new Date(apt.dateTime).toLocaleDateString('en-US', { month: 'short' })}</span>
              <span class="date-day">${new Date(apt.dateTime).getDate()}</span>
            </div>
          </div>

          <div class="apt-content">
            <div class="apt-card-top">
              <div class="apt-header-meta">
                <span class="status-badge ${statusInfo.className}">${statusInfo.label}</span>
                <span class="type-pill">${escapeHTML(apt.type)}</span>
              </div>
              <div class="apt-actions">
                <button class="btn-icon btn-edit" onclick="AppointmentsManager.openEditModal('${apt.id}')" title="Edit Appointment" aria-label="Edit appointment">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                </button>
                <button class="btn-icon" onclick="AppointmentsManager.downloadICS('${apt.id}')" title="Download Calendar Invite (.ics)" aria-label="Add to calendar">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                </button>
                <button class="btn-icon btn-delete" onclick="AppointmentsManager.deleteAppointment('${apt.id}')" title="Delete Appointment" aria-label="Delete appointment">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>

            <h4 class="apt-doctor-name">${escapeHTML(apt.doctorName)}</h4>
            <div class="apt-specialty">${escapeHTML(apt.specialty)}</div>

            <div class="apt-details-grid">
              <div class="apt-detail-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                <span>${formattedDate} at ${formattedTime}</span>
              </div>
              <div class="apt-detail-item">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                <span>${escapeHTML(apt.location)}</span>
              </div>
            </div>

            <div class="apt-purpose-box">
              <strong>Purpose:</strong> ${escapeHTML(apt.purpose)}
            </div>

            ${apt.notes ? `
              <div class="apt-notes-box">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                <span>${escapeHTML(apt.notes)}</span>
              </div>
            ` : ''}

            <div class="apt-card-bottom">
              <button class="btn-status-toggle ${isCompleted ? 'is-done' : ''}" onclick="AppointmentsManager.toggleComplete('${apt.id}')">
                ${isCompleted ? `
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  Completed (Click to Reopen)
                ` : `
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
                  Mark as Completed
                `}
              </button>
            </div>
          </div>
        </article>
      `;
    }).join('');
  }
};

window.AppointmentsManager = AppointmentsManager;
