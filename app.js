/**
 * MediBridge - Core Application Controller
 * Handles SPA navigation, mobile menu, modals, toast alerts, chat interaction, and dashboard stats.
 */

const MediApp = {
  currentView: 'home',
  chatMessages: [],

  init() {
    this.bindNavigation();
    this.bindModals();
    this.bindChat();
    this.bindQuickPrompts();
    this.bindGlobalActions();

    // Initialize modules
    if (window.RemindersManager) window.RemindersManager.init();
    if (window.AppointmentsManager) window.AppointmentsManager.init();
    if (window.LibraryManager) window.LibraryManager.init();

    this.loadChatHistory();
    this.updateDashboardStats();
    this.checkAIStatus();

    // Support browser hash routing e.g. #reminders, #assistant
    const hash = window.location.hash.replace('#', '');
    if (hash && ['home', 'assistant', 'reminders', 'appointments', 'library'].includes(hash)) {
      this.navigate(hash);
    } else {
      this.navigate('home');
    }
  },

  // Navigation
  bindNavigation() {
    const navLinks = document.querySelectorAll('[data-nav-target]');
    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetView = link.getAttribute('data-nav-target');
        this.navigate(targetView);

        // Close mobile menu if open
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          document.body.classList.remove('menu-locked');
        }
      });
    });

    // Mobile Hamburger Toggle
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileClose = document.getElementById('mobile-menu-close');

    if (menuToggle && mobileMenu) {
      menuToggle.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        document.body.classList.toggle('menu-locked');
      });
    }

    if (mobileClose && mobileMenu) {
      mobileClose.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        document.body.classList.remove('menu-locked');
      });
    }
  },

  navigate(viewId) {
    this.currentView = viewId;
    window.location.hash = viewId;

    // Update active nav styling
    const allLinks = document.querySelectorAll('[data-nav-target]');
    allLinks.forEach(link => {
      if (link.getAttribute('data-nav-target') === viewId) {
        link.classList.add('active');
      } else {
        link.classList.remove('active');
      }
    });

    // Hide all view sections
    const views = document.querySelectorAll('.app-view');
    views.forEach(v => v.classList.remove('active-view'));

    // Show target view section
    const targetSection = document.getElementById(`view-${viewId}`);
    if (targetSection) {
      targetSection.classList.add('active-view');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    // Refresh relevant components if needed
    if (viewId === 'home') {
      this.updateDashboardStats();
    } else if (viewId === 'assistant') {
      this.scrollChatToBottom();
    }
  },

  // Dashboard Stats & Quick Previews
  updateDashboardStats() {
    const meds = window.StorageService ? window.StorageService.getMedicines() : [];
    const appts = window.StorageService ? window.StorageService.getAppointments() : [];

    // Next Dose Widget
    const nextDoseEl = document.getElementById('dash-next-med');
    const todayMeds = meds.filter(m => !m.takenToday);
    if (nextDoseEl) {
      if (todayMeds.length > 0) {
        const next = todayMeds[0];
        nextDoseEl.innerHTML = `
          <div class="dash-widget-pill due">Pending Next</div>
          <h4 class="dash-widget-title">${escapeHTML(next.name)}</h4>
          <p class="dash-widget-sub">${escapeHTML(next.dosage)} at ${window.RemindersManager.formatTime(next.time)}</p>
          <button class="btn-sm btn-outline mt-2" onclick="MediApp.navigate('reminders')">Check Medicine Log</button>
        `;
      } else if (meds.length > 0) {
        nextDoseEl.innerHTML = `
          <div class="dash-widget-pill success">All Taken!</div>
          <h4 class="dash-widget-title">Doses Complete</h4>
          <p class="dash-widget-sub">Great job! All scheduled medications for today are marked as taken.</p>
          <button class="btn-sm btn-outline mt-2" onclick="MediApp.navigate('reminders')">View Reminders</button>
        `;
      } else {
        nextDoseEl.innerHTML = `
          <div class="dash-widget-pill neutral">No Meds Added</div>
          <h4 class="dash-widget-title">Set a Reminder</h4>
          <p class="dash-widget-sub">Add your daily prescriptions or vitamins so you never miss a dose.</p>
          <button class="btn-sm btn-primary mt-2" onclick="MediApp.openModal('add-med-modal')">+ Add Reminder</button>
        `;
      }
    }

    // Next Appointment Widget
    const nextAptEl = document.getElementById('dash-next-apt');
    const upcomingAppts = appts.filter(a => a.status === 'upcoming');
    if (nextAptEl) {
      if (upcomingAppts.length > 0) {
        const nextA = upcomingAppts[0];
        nextAptEl.innerHTML = `
          <div class="dash-widget-pill info">Upcoming Reminder</div>
          <h4 class="dash-widget-title">${escapeHTML(nextA.doctorName)}</h4>
          <p class="dash-widget-sub">${window.AppointmentsManager.formatDate(nextA.dateTime)} at ${window.AppointmentsManager.formatTime(nextA.dateTime)}</p>
          <button class="btn-sm btn-outline mt-2" onclick="MediApp.navigate('appointments')">View Details</button>
        `;
      } else {
        nextAptEl.innerHTML = `
          <div class="dash-widget-pill neutral">No Upcoming Appointments</div>
          <h4 class="dash-widget-title">Schedule a Consultation</h4>
          <p class="dash-widget-sub">Keep track of routine screenings, checkups, and follow-ups.</p>
          <button class="btn-sm btn-primary mt-2" onclick="MediApp.openModal('add-apt-modal')">+ Add Appointment</button>
        `;
      }
    }

    // Daily Habit / Adherence Metric strictly calculated from actual user data
    const adherenceEl = document.getElementById('dash-adherence-metric');
    const adherenceLbl = document.getElementById('dash-adherence-label');
    if (adherenceEl) {
      if (meds.length > 0) {
        const taken = meds.filter(m => m.takenToday).length;
        adherenceEl.textContent = `${taken} of ${meds.length} Done`;
        if (adherenceLbl) adherenceLbl.textContent = 'Doses Logged Today';
      } else {
        adherenceEl.textContent = '0 Logged';
        if (adherenceLbl) adherenceLbl.textContent = 'Daily Schedule Ready';
      }
    }
  },

  // Chat Interface for Health Assistant
  bindChat() {
    const chatForm = document.getElementById('assistant-chat-form');
    const chatInput = document.getElementById('assistant-chat-input');
    const clearBtn = document.getElementById('clear-chat-btn');

    if (chatForm && chatInput) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        this.sendUserMessage(msg);
        chatInput.value = '';
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (confirm('Clear assistant conversation history?')) {
          this.chatMessages = [];
          window.StorageService.clearChatHistory();
          this.renderChatMessages();
          this.showToast('Chat history cleared.', 'info');
        }
      });
    }
  },

  bindQuickPrompts() {
    const promptButtons = document.querySelectorAll('.prompt-chip, .hero-chip');
    promptButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const query = btn.getAttribute('data-prompt');
        if (query) {
          this.navigate('assistant');
          this.sendUserMessage(query);
        }
      });
    });

    // Hero Quick Ask Form - Makes AI Assistant immediately accessible from Homepage
    const heroForm = document.getElementById('hero-assistant-form');
    const heroInput = document.getElementById('hero-assistant-input');
    if (heroForm && heroInput) {
      heroForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const query = heroInput.value.trim();
        if (!query) return;
        heroInput.value = '';
        this.navigate('assistant');
        this.sendUserMessage(query);
      });
    }
  },

  loadChatHistory() {
    this.chatMessages = window.StorageService.getChatHistory();
    if (this.chatMessages.length === 0) {
      // Welcome message
      this.chatMessages.push({
        id: 'msg-welcome',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: 'Welcome to MediBridge Health Assistant',
        badge: 'Demo Educational AI Guide',
        content: `Hello! I am your **MediBridge Health Knowledge Assistant**.

I am programmed to help you:
• Understand complex medical terms and lab tests in plain language.
• Learn about healthy daily nutrition, hydration, and sleep hygiene.
• Prepare meaningful questions for your next doctor appointment.

⚠️ **Important Safety Disclaimer:**
I am a demonstration educational assistant and **cannot diagnose conditions, prescribe medications, or evaluate emergencies**. For any acute symptoms, please consult a licensed physician or emergency medical care immediately.`
      });
      window.StorageService.saveChatHistory(this.chatMessages);
    }
    this.renderChatMessages();
  },

  async checkAIStatus() {
    const statusEl = document.getElementById('ai-connection-status');
    if (window.AssistantService && window.AssistantService.checkStatus) {
      const status = await window.AssistantService.checkStatus();
      if (statusEl) {
        if (status.configured) {
          statusEl.textContent = `Google Gemini Active (${status.model || 'Gemini'})`;
          statusEl.className = 'demo-tag tag-gemini-active';
        } else {
          statusEl.textContent = 'Demo Mode (Local Engine)';
          statusEl.className = 'demo-tag tag-demo-mode';
        }
      }
    }
  },

  async sendUserMessage(text) {
    const userMsg = {
      id: 'msg-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      content: text
    };

    this.chatMessages.push(userMsg);
    this.renderChatMessages();
    this.scrollChatToBottom();

    // Show bot typing indicator
    this.showTypingIndicator();

    try {
      const responseObj = await window.AssistantService.ask(text, this.chatMessages);
      this.hideTypingIndicator();

      let badge = responseObj.badge || 'Demo Educational AI Guide';
      if (responseObj.type === 'emergency') badge = '🚨 Emergency Directive';
      if (responseObj.type === 'boundary') badge = '⚕️ Clinical Guardrail';

      const botMsg = {
        id: 'msg-' + (Date.now() + 1),
        sender: 'bot',
        type: responseObj.type,
        source: responseObj.source,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        title: responseObj.title,
        badge: badge,
        content: responseObj.content
      };

      this.chatMessages.push(botMsg);
      window.StorageService.saveChatHistory(this.chatMessages);
      this.renderChatMessages();
      this.scrollChatToBottom();

      if (responseObj.type === 'emergency') {
        this.playAlertTone();
      }

      if (responseObj.notice) {
        this.showToast(responseObj.notice, 'info');
      }
    } catch (err) {
      this.hideTypingIndicator();
      console.error('[MediApp] Chat query error:', err);
      this.showToast('Could not reach assistant. Please try again.', 'error');
    }
  },

  showTypingIndicator() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    let typingEl = document.getElementById('chat-typing-indicator');
    if (!typingEl) {
      typingEl = document.createElement('div');
      typingEl.id = 'chat-typing-indicator';
      typingEl.className = 'chat-bubble-row bot-row typing-row';
      typingEl.innerHTML = `
        <div class="chat-avatar bot-avatar">MB</div>
        <div class="chat-bubble bot-bubble typing-bubble">
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="typing-label">BridgeBot is consulting knowledge base...</span>
        </div>
      `;
      container.appendChild(typingEl);
      this.scrollChatToBottom();
    }
  },

  hideTypingIndicator() {
    const typingEl = document.getElementById('chat-typing-indicator');
    if (typingEl) {
      typingEl.remove();
    }
  },

  renderChatMessages() {
    const container = document.getElementById('chat-messages-container');
    if (!container) return;

    container.innerHTML = this.chatMessages.map(msg => {
      if (msg.sender === 'user') {
        return `
          <div class="chat-bubble-row user-row" id="${msg.id}">
            <div class="chat-bubble user-bubble">
              <div class="chat-bubble-content">${escapeHTML(msg.content)}</div>
              <span class="chat-time">${msg.timestamp}</span>
            </div>
          </div>
        `;
      } else {
        const isEmergency = msg.type === 'emergency';
        const isBoundary = msg.type === 'boundary';

        return `
          <div class="chat-bubble-row bot-row ${isEmergency ? 'is-emergency-row' : ''}" id="${msg.id}">
            <div class="chat-avatar bot-avatar">MB</div>
            <div class="chat-bubble bot-bubble ${isEmergency ? 'bubble-emergency' : ''} ${isBoundary ? 'bubble-boundary' : ''}">
              <div class="chat-bot-header">
                <span class="demo-tag">${msg.badge || 'Demo AI Guide'}</span>
                <span class="chat-time">${msg.timestamp}</span>
              </div>
              ${msg.title ? `<h4 class="bot-msg-title">${escapeHTML(msg.title)}</h4>` : ''}
              <div class="chat-bubble-content markdown-styled">
                ${this.parseMarkdown(msg.content)}
              </div>
              <div class="chat-bubble-actions">
                <button class="btn-copy-bubble" onclick="MediApp.copyBubbleText('${msg.id}')" title="Copy text">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  Copy
                </button>
              </div>
            </div>
          </div>
        `;
      }
    }).join('');
  },

  scrollChatToBottom() {
    const container = document.getElementById('chat-messages-container');
    if (container) {
      setTimeout(() => {
        container.scrollTop = container.scrollHeight;
      }, 50);
    }
  },

  copyBubbleText(msgId) {
    const msg = this.chatMessages.find(m => m.id === msgId);
    if (!msg) return;

    navigator.clipboard.writeText(msg.content).then(() => {
      this.showToast('Copied to clipboard!', 'success');
    }).catch(() => {
      this.showToast('Failed to copy text.', 'error');
    });
  },

  parseMarkdown(str) {
    if (!str) return '';
    let parsed = escapeHTML(str);

    // Bold: **text**
    parsed = parsed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    // Italic: *text*
    parsed = parsed.replace(/\*(.*?)\*/g, '<em>$1</em>');
    // Bullet points: • or -
    parsed = parsed.replace(/^• (.*$)/gim, '<div class="chat-bullet">• $1</div>');
    parsed = parsed.replace(/^- (.*$)/gim, '<div class="chat-bullet">• $1</div>');
    // Line breaks
    parsed = parsed.replace(/\n\n/g, '<p class="chat-para"></p>');
    parsed = parsed.replace(/\n/g, '<br/>');

    return parsed;
  },

  // Modals Management
  bindModals() {
    // Open buttons with data-modal-target
    document.querySelectorAll('[data-modal-target]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-modal-target');
        this.openModal(targetId);
      });
    });

    // Close buttons with data-modal-close
    document.querySelectorAll('[data-modal-close]').forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('open');
      });
    });

    // Close on backdrop click
    document.querySelectorAll('.modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.classList.remove('open');
        }
      });
    });

    // Close on ESC key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(modal => {
          modal.classList.remove('open');
        });
      }
    });
  },

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      // Autofocus first input if any
      const input = modal.querySelector('input, select, textarea');
      if (input) input.focus();
    }
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('open');
    }
  },

  // Toast Notifications
  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    let iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>';
    if (type === 'success') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
    } else if (type === 'error') {
      iconSvg = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>';
    }

    toast.innerHTML = `
      <div class="toast-icon">${iconSvg}</div>
      <div class="toast-msg">${escapeHTML(message)}</div>
      <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
    `;

    container.appendChild(toast);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.add('fade-out');
      setTimeout(() => toast.remove(), 300);
    }, 4000);
  },

  // Notification Banner
  showNotificationBanner(message) {
    this.showToast(message, 'info');
    this.playChime();
  },

  // Web Audio Friendly Chime
  playChime() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5

      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch {
      // Audio context may require user interaction
    }
  },

  // Alert tone for emergency notice
  playAlertTone() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(330, ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // Ignore
    }
  },

  bindGlobalActions() {
    // Reset Data action
    const resetBtn = document.getElementById('reset-data-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        if (confirm('Reset application data to initial demo state? (Your reminders and appointments will reset to defaults).')) {
          window.StorageService.resetDefaults();
          window.location.reload();
        }
      });
    }
  }
};

window.MediApp = MediApp;

// Auto-run on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  window.MediApp.init();
});
