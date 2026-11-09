/**
 * MediBridge - Medicine Reminders Module
 * Manages adding, viewing, marking taken, deleting, and tracking doses.
 */

const RemindersManager = {
  medicines: [],
  currentFilter: 'all', // 'all', 'pending', 'taken'

  init() {
    this.medicines = window.StorageService.getMedicines();
    this.render();
    this.bindEvents();
    this.startCheckInterval();
  },

  bindEvents() {
    const form = document.getElementById('add-medicine-form');
    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleAddMedicine(form);
      });
    }

    // Reset modal to Add Mode when any add-reminder button is clicked
    document.querySelectorAll('[data-modal-target="add-med-modal"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.resetModalToAddMode();
      });
    });

    // Filter tabs
    const filterButtons = document.querySelectorAll('[data-med-filter]');
    filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        filterButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentFilter = e.currentTarget.getAttribute('data-med-filter');
        this.render();
      });
    });
  },

  resetModalToAddMode() {
    const idInput = document.getElementById('med-id');
    const titleEl = document.getElementById('add-med-title');
    const submitBtn = document.getElementById('med-submit-btn');
    const form = document.getElementById('add-medicine-form');

    if (idInput) idInput.value = '';
    if (titleEl) titleEl.textContent = 'Add Medicine Reminder';
    if (submitBtn) submitBtn.textContent = 'Save Reminder';
    if (form) form.reset();
  },

  openEditModal(medId) {
    const med = this.medicines.find(m => m.id === medId);
    if (!med) return;

    const idInput = document.getElementById('med-id');
    const nameInput = document.getElementById('med-name');
    const dosageInput = document.getElementById('med-dosage');
    const frequencyInput = document.getElementById('med-frequency');
    const timeInput = document.getElementById('med-time');
    const instructionInput = document.getElementById('med-instruction');
    const categoryInput = document.getElementById('med-category');
    const qtyInput = document.getElementById('med-quantity');
    const titleEl = document.getElementById('add-med-title');
    const submitBtn = document.getElementById('med-submit-btn');

    if (idInput) idInput.value = med.id;
    if (nameInput) nameInput.value = med.name;
    if (dosageInput) dosageInput.value = med.dosage;
    if (frequencyInput) frequencyInput.value = med.frequency;
    if (timeInput) timeInput.value = med.time;
    if (instructionInput) instructionInput.value = med.instruction;
    if (categoryInput) categoryInput.value = med.category || 'General';
    if (qtyInput) qtyInput.value = med.remainingQuantity;

    if (titleEl) titleEl.textContent = 'Edit Medicine Reminder';
    if (submitBtn) submitBtn.textContent = 'Save Changes';

    window.MediApp.openModal('add-med-modal');
  },

  handleAddMedicine(form) {
    const idInput = document.getElementById('med-id');
    const nameInput = document.getElementById('med-name');
    const dosageInput = document.getElementById('med-dosage');
    const frequencyInput = document.getElementById('med-frequency');
    const timeInput = document.getElementById('med-time');
    const instructionInput = document.getElementById('med-instruction');
    const categoryInput = document.getElementById('med-category');
    const qtyInput = document.getElementById('med-quantity');

    if (!nameInput.value.trim() || !timeInput.value) {
      window.MediApp.showToast('Please provide at least a medicine name and reminder time.', 'error');
      return;
    }

    const medId = idInput ? idInput.value : '';

    if (medId) {
      // Editing existing medicine
      const existing = this.medicines.find(m => m.id === medId);
      if (existing) {
        existing.name = nameInput.value.trim();
        existing.dosage = dosageInput.value.trim() || '1 dose';
        existing.frequency = frequencyInput.value || 'Once Daily';
        existing.time = timeInput.value;
        existing.instruction = instructionInput.value.trim() || 'Take with water';
        existing.category = categoryInput.value || 'General';
        const newQty = parseInt(qtyInput.value, 10) || 30;
        existing.totalQuantity = Math.max(existing.totalQuantity, newQty);
        existing.remainingQuantity = newQty;

        window.StorageService.saveMedicines(this.medicines);
        window.MediApp.closeModal('add-med-modal');
        window.MediApp.showToast(`Updated "${existing.name}" reminder!`, 'success');
        this.resetModalToAddMode();
        this.render();
        window.MediApp.updateDashboardStats();
        return;
      }
    }

    // Adding new medicine
    const newMed = {
      id: 'med-' + Date.now(),
      name: nameInput.value.trim(),
      dosage: dosageInput.value.trim() || '1 dose',
      frequency: frequencyInput.value || 'Once Daily',
      time: timeInput.value,
      instruction: instructionInput.value.trim() || 'Take with water',
      category: categoryInput.value || 'General',
      totalQuantity: parseInt(qtyInput.value, 10) || 30,
      remainingQuantity: parseInt(qtyInput.value, 10) || 30,
      takenToday: false,
      lastTaken: null,
      createdAt: new Date().toISOString()
    };

    this.medicines.unshift(newMed);
    window.StorageService.saveMedicines(this.medicines);

    form.reset();
    window.MediApp.closeModal('add-med-modal');
    window.MediApp.showToast(`Reminder for "${newMed.name}" added successfully!`, 'success');

    this.render();
    window.MediApp.updateDashboardStats();
  },

  toggleTaken(medId) {
    const med = this.medicines.find(m => m.id === medId);
    if (!med) return;

    med.takenToday = !med.takenToday;
    if (med.takenToday) {
      med.lastTaken = new Date().toISOString();
      if (med.remainingQuantity > 0) {
        med.remainingQuantity -= 1;
      }
      window.MediApp.showToast(`Marked "${med.name}" as taken today! Good job staying on track.`, 'success');
      window.MediApp.playChime();
    } else {
      med.lastTaken = null;
      if (med.remainingQuantity < med.totalQuantity) {
        med.remainingQuantity += 1;
      }
      window.MediApp.showToast(`Unmarked "${med.name}".`, 'info');
    }

    window.StorageService.saveMedicines(this.medicines);
    this.render();
    window.MediApp.updateDashboardStats();
  },

  deleteMedicine(medId) {
    const med = this.medicines.find(m => m.id === medId);
    if (!med) return;

    if (confirm(`Are you sure you want to remove reminder for "${med.name}"?`)) {
      this.medicines = this.medicines.filter(m => m.id !== medId);
      window.StorageService.saveMedicines(this.medicines);
      window.MediApp.showToast(`Removed "${med.name}" reminder.`, 'info');
      this.render();
      window.MediApp.updateDashboardStats();
    }
  },

  formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const h = parseInt(hours, 10);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const formattedHours = h % 12 || 12;
    return `${formattedHours}:${minutes} ${ampm}`;
  },

  getStats() {
    const total = this.medicines.length;
    const taken = this.medicines.filter(m => m.takenToday).length;
    const pending = total - taken;
    const percent = total === 0 ? 0 : Math.round((taken / total) * 100);
    return { total, taken, pending, percent };
  },

  render() {
    const container = document.getElementById('medicines-list');
    const emptyState = document.getElementById('medicines-empty');
    const statsContainer = document.getElementById('medicine-stats-banner');

    if (!container) return;

    // Filter medicines
    let filtered = this.medicines;
    if (this.currentFilter === 'pending') {
      filtered = this.medicines.filter(m => !m.takenToday);
    } else if (this.currentFilter === 'taken') {
      filtered = this.medicines.filter(m => m.takenToday);
    }

    // Render Stats Banner
    const stats = this.getStats();
    if (statsContainer) {
      statsContainer.innerHTML = `
        <div class="stats-card-inner">
          <div class="stats-info">
            <span class="stats-pill">Today's Adherence</span>
            <h3 class="stats-heading">${stats.taken} of ${stats.total} Doses Logged</h3>
            <p class="stats-desc">${stats.pending === 0 && stats.total > 0 ? '🎉 All scheduled doses taken for today!' : `${stats.pending} dose${stats.pending === 1 ? '' : 's'} remaining today.`}</p>
          </div>
          <div class="stats-progress-wrap">
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${stats.percent}%"></div>
            </div>
            <span class="stats-percent">${stats.percent}%</span>
          </div>
        </div>
      `;
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(med => {
      const isTaken = med.takenToday;
      const formattedTime = this.formatTime(med.time);
      const isLowStock = med.remainingQuantity <= 5;

      return `
        <article class="med-card ${isTaken ? 'is-completed' : ''}" data-id="${med.id}">
          <div class="med-card-header">
            <div class="med-card-title-group">
              <span class="med-badge ${isTaken ? 'badge-success' : 'badge-primary'}">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ${formattedTime}
              </span>
              <span class="med-category-pill">${med.category || 'Medication'}</span>
            </div>
            <div class="card-action-btns">
              <button class="btn-icon btn-edit" onclick="RemindersManager.openEditModal('${med.id}')" title="Edit Reminder" aria-label="Edit ${med.name}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
              </button>
              <button class="btn-icon btn-delete" onclick="RemindersManager.deleteMedicine('${med.id}')" title="Delete Reminder" aria-label="Delete ${med.name}">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              </button>
            </div>
          </div>

          <div class="med-card-body">
            <h4 class="med-name">${escapeHTML(med.name)}</h4>
            <div class="med-meta">
              <span class="med-dosage"><strong>Dosage:</strong> ${escapeHTML(med.dosage)}</span>
              <span class="med-frequency"><strong>Frequency:</strong> ${escapeHTML(med.frequency)}</span>
            </div>
            <p class="med-instruction">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              ${escapeHTML(med.instruction)}
            </p>
          </div>

          <div class="med-card-footer">
            <div class="med-stock ${isLowStock ? 'low-stock' : ''}">
              <span class="stock-label">Stock:</span>
              <span class="stock-count">${med.remainingQuantity} left</span>
            </div>
            <button class="btn-toggle-taken ${isTaken ? 'btn-taken' : 'btn-pending'}" onclick="RemindersManager.toggleTaken('${med.id}')">
              ${isTaken ? `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                Taken Today
              ` : `
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>
                Mark as Taken
              `}
            </button>
          </div>
        </article>
      `;
    }).join('');
  },

  // Periodic reminder checking
  startCheckInterval() {
    setInterval(() => {
      this.checkDueReminders();
    }, 60000); // Check every minute
  },

  checkDueReminders() {
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMinutes = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMinutes}`;

    this.medicines.forEach(med => {
      if (med.time === currentTimeStr && !med.takenToday) {
        window.MediApp.showNotificationBanner(`Reminder: It's time for ${med.name} (${med.dosage}) - ${med.instruction}`);
      }
    });
  }
};

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

window.RemindersManager = RemindersManager;
