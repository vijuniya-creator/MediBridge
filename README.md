# MediBridge 🩺
> **"Bridging People and Smarter Healthcare."**  
> *Welcome message: "Your health journey starts here."*

MediBridge is a modern, responsive, client-side personal health companion web application crafted with clean HTML5, CSS3, and modern Vanilla JavaScript. It empowers users to take proactive control of their daily health routines with medication reminders, upcoming appointment tracking, an evidence-based health library, and an educational AI health assistant.

---

## 🌟 Key Features

### 1. 🤖 AI Health Assistant (BridgeBot) - Powered by Google Gemini AI
- **Official Google Gemini Integration**: Connects securely to the Google Gemini API (`gemini-2.5-flash` or `gemini-1.5-flash`) through a local server proxy.
- **Secure Key Management**: Your `GEMINI_API_KEY` is loaded from a private `.env` file on the backend server—never exposed to frontend JavaScript or committed to GitHub.
- **Automatic Offline / Demo Fallback**: If the server is offline or no API key is provided, the assistant automatically falls back to the built-in educational knowledge base (`js/assistant.js`) so the app never crashes.
- **Dual-Layer Medical Guardrails**:
  - *Emergency Safeguard*: Immediately identifies acute symptoms (chest pain, stroke signs, difficulty breathing) and presents emergency helpline directives (911 / 112).
  - *Clinical Boundary*: Declines requests to diagnose illnesses or prescribe medication dosages, encouraging consultation with a licensed doctor.
- **Interactive Chat Interface**: Includes typing animation, live connection status pill, pre-populated topic chips, conversation persistence in `localStorage`, and copy-to-clipboard functionality.

### 2. 💊 Everyday Medicine Reminders
- Schedule daily vitamins, supplements, and prescriptions with custom dosage, frequency, and meal instructions.
- Neutral everyday sample data (e.g. Daily Multivitamin, Hydration routine) and clean empty states.
- Mark doses as taken/pending with real-time adherence progress calculated strictly from actual user data.
- Audio confirmation chime using the browser's native Web Audio API (no external sound files required).
- Filter views: **All Reminders**, **Pending Today**, and **Completed Today**.
- Automatically stored and persisted in browser `localStorage`.

### 3. 📅 Upcoming Appointment Reminders
- Track upcoming checkups, consultations, and screenings (no fictional doctor profiles).
- Relative date countdown badges (*"Today / Soon"*, *"Tomorrow"*, *"In 3 Days"*, *"Completed"*).
- Instant **`.ics` Calendar File Export**: Download standard calendar events directly into Google Calendar, Apple Calendar, or Microsoft Outlook.
- Filter views: **Upcoming**, **Completed**, and **All Visits**.

### 4. 📚 Health Library
- Curated, evidence-based articles covering **Heart Health**, **Sleep Science**, **Everyday Nutrition**, **Mental Wellness**, **Preventive Care Screenings**, and **First Aid Essentials**.
- Real-time search by keywords, conditions, or healthy habits.
- Category filtering and article bookmarking.
- Reader modal with estimated reading times, key health takeaways, and a prominent educational disclaimer.

---

## 🎨 Design & Aesthetic

- **Personal Healthcare Companion Vibe**: Warm, human-first, everyday lifestyle wellness feel rather than an institutional hospital administration system.
- **Color Palette**: Clean white background (`#ffffff`), soft slate canvas (`#f8fafc`), with calming teal (`#0d9488`, `#14b8a6`) and clinical blue (`#2563eb`) accents.
- **Typography**: Clean, readable typography using **Plus Jakarta Sans**.
- **Mobile Responsive**: Fully responsive layout with a smooth slide-out navigation drawer for mobile devices.
- **Private by Design**: All reminders, appointments, and conversation notes are stored strictly on your local device in browser `localStorage`. No remote tracking.

---

## 📁 Project Structure

```
MediBridge/
├── index.html              # Main single-page application entry point
├── server.js               # Node.js backend proxy & static server (secures Gemini API key)
├── package.json            # Project manifest (npm start)
├── .env.example            # Environment configuration template
├── .env                    # Your private local environment file (git-ignored)
├── .gitignore              # Git ignore file (prevents committing .env and secrets)
├── css/
│   ├── style.css           # Global design system, variables, header, footer, toasts
│   ├── components.css      # Hero section, feature cards, buttons, modals, forms
│   └── views.css           # View-specific styles (Assistant, Reminders, Appts, Library)
├── js/
│   ├── storage.js          # LocalStorage service & initial seed sample data
│   ├── assistant.js        # Health assistant engine (Gemini API caller + offline fallback)
│   ├── reminders.js        # Medicine reminder CRUD, editing, adherence tracking, timer
│   ├── appointments.js     # Appointment manager, editing, & .ics calendar generator
│   ├── library.js          # Health library articles, search engine & bookmarking
│   └── app.js              # SPA navigation router, toast alerts, chime, AI status checker
└── README.md               # Documentation and setup guide
```

---

## 🚀 How to Run MediBridge Locally

### Method 1: Running with Google Gemini AI (Recommended)

1. **Get a free Google Gemini API Key:**
   - Visit [Google AI Studio](https://aistudio.google.com/).
   - Click **"Get API key"** and create a new key.

2. **Configure your `.env` file:**
   - In the `MediBridge` folder, open `.env` in a text editor (e.g. Notepad or VS Code).
   - Paste your API key:
     ```env
     GEMINI_API_KEY=AIzaSyYourActualKeyHere
     GEMINI_MODEL=gemini-2.5-flash
     PORT=3000
     ```
   - Save the file. *(Note: `.env` is already listed in `.gitignore` so your key will never be committed).*

3. **Start the local server:**
   - Open PowerShell or Command Prompt in the `MediBridge` folder:
     ```bash
     npm start
     ```
     *(Or: `node server.js` — no npm installs needed!)*
   - Open your browser and go to:
     ```
     http://localhost:3000
     ```
   - In the chat header, the status pill will show: **`Google Gemini Active`**.

---

### Method 2: Offline / Direct Double-Click (Without Gemini AI)

If you just want to test medicine reminders, appointment tracking, or the health library without running Node.js:
1. Double-click `index.html` in File Explorer.
2. The app will open directly in your browser.
3. The AI Health Assistant will automatically switch to **Demo / Offline Mode**, answering questions using its built-in educational knowledge base with zero configuration.

---

## ⚕️ Medical Disclaimer

> **IMPORTANT NOTICE:**  
> MediBridge is created exclusively for health awareness, medication tracking, and educational purposes. The information provided through this application, including the AI Health Assistant and Health Library, does **not** constitute medical advice, medical diagnoses, or treatment plans.  
> 
> Always seek the direct advice of your physician or other qualified healthcare provider regarding any medical condition or treatment. Never disregard professional medical advice or delay seeking it because of something you have read on this application. In the event of a medical emergency, call your local emergency services (such as **911** or **112**) immediately.
