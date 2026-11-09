/**
 * MediBridge - Educational Health Assistant Module
 * 
 * NOTE: This is an educational rule-based demo assistant designed to explain
 * common health concepts, medical terms, and healthy habits.
 * It strictly DOES NOT diagnose conditions or prescribe medications.
 */

const KNOWLEDGE_BASE = [
  {
    tags: ['blood pressure', 'bp', 'systolic', 'diastolic', 'hypertension', '120/80'],
    title: 'Understanding Blood Pressure Readings',
    response: `**Blood pressure (BP)** measures the force of circulating blood against the walls of your arteries. It is recorded as two numbers (e.g., 120/80 mmHg):

• **Systolic Pressure (Top Number):** The pressure in your arteries when your heart muscle contracts and pumps blood.
• **Diastolic Pressure (Bottom Number):** The pressure in your arteries when your heart rests between beats.

**Standard Adult BP Categories (AHA Guidelines):**
1. **Normal:** Less than 120 / less than 80 mmHg
2. **Elevated:** 120–129 / less than 80 mmHg
3. **Stage 1 Hypertension:** 130–139 / 80–89 mmHg
4. **Stage 2 Hypertension:** 140 or higher / 90 or higher mmHg
5. **Hypertensive Crisis:** Higher than 180 and/or higher than 120 mmHg (Requires immediate medical evaluation).

💡 *Health Tip:* Single readings fluctuate with stress, caffeine, and physical activity. Doctors usually diagnose based on an average of multiple readings over several visits.`
  },
  {
    tags: ['cholesterol', 'ldl', 'hdl', 'triglycerides', 'lipid'],
    title: 'Understanding Cholesterol (HDL vs. LDL)',
    response: `**Cholesterol** is a waxy, fat-like substance found in all your cells. Your body needs it to build cells, produce hormones, and synthesize Vitamin D.

Here is what your lipid panel measures:

• **HDL (High-Density Lipoprotein):** Known as the **"Good" cholesterol**. It absorbs excess cholesterol in the blood and carries it back to the liver to be flushed from the body. Higher levels (above 50–60 mg/dL) are generally protective.
• **LDL (Low-Density Lipoprotein):** Often called the **"Bad" cholesterol**. High levels can lead to a buildup of plaque in the walls of your arteries (atherosclerosis), narrowing blood flow.
• **Triglycerides:** The most common type of fat in your body, derived from unused calories. High triglycerides combined with high LDL increase cardiovascular risk.

🥗 *Lifestyle Support:* Regular aerobic exercise, soluble fiber (oats, legumes), omega-3 fatty acids, and limiting trans fats support healthy cholesterol balance.`
  },
  {
    tags: ['antibiotic', 'antibiotics', 'viral', 'bacterial', 'cold', 'flu', 'virus'],
    title: 'Viral vs. Bacterial Infections: Why Antibiotics Differ',
    response: `Understanding the difference between viruses and bacteria is key to using medications safely:

• **Bacterial Infections:** Caused by single-celled microorganisms (e.g., strep throat, urinary tract infections, bacterial pneumonia). **Antibiotics are effective against bacteria.**
• **Viral Infections:** Caused by viruses that multiply inside living cells (e.g., common cold, influenza, COVID-19, most sore throats and bronchitis). **Antibiotics do NOT kill viruses.**

⚠️ **Antibiotic Stewardship:**
Taking antibiotics for a viral infection will not cure it, make you feel better, or stop transmission. It can cause unwanted side effects and contributes to **antibiotic resistance**, where bacteria mutate to survive drug treatments.

Always take antibiotics only under physician prescription and complete the exact course prescribed.`
  },
  {
    tags: ['bmi', 'body mass index', 'weight', 'body composition'],
    title: 'What is BMI and What Are Its Limitations?',
    response: `**Body Mass Index (BMI)** is a screening tool calculated by dividing weight in kilograms by height in meters squared:

• **Underweight:** Under 18.5
• **Normal / Healthy Weight:** 18.5 – 24.9
• **Overweight:** 25.0 – 29.9
• **Obesity:** 30.0 or greater

**Important Limitations of BMI:**
• It **does not distinguish** between muscle mass, bone density, and body fat. Athletes or muscular individuals may be categorized as "overweight" despite low body fat.
• It does not show **where** fat is distributed (visceral belly fat carries more cardiometabolic risk than subcutaneous fat).
• Healthcare providers also measure **waist circumference**, blood pressure, lipid panels, and blood glucose for a true picture of metabolic wellness.`
  },
  {
    tags: ['fever', 'temperature', 'pyrexia', 'body temperature'],
    title: 'Understanding Fever & When to Seek Medical Care',
    response: `A **fever** is generally defined as an oral body temperature of **100.4°F (38°C)** or higher.

**Why does the body produce a fever?**
Fever is not an illness by itself; it is your immune system's natural defense response. A slightly elevated temperature stimulates white blood cells and creates an inhospitable environment for pathogens.

**When to Contact a Doctor:**
• Fever lasting longer than 3 consecutive days.
• Accompanied by a stiff neck, confusion, persistent vomiting, or difficulty breathing.
• For infants under 3 months: Any rectal temperature of 100.4°F (38°C) or higher requires immediate emergency pediatric care.
• If temperature reaches 103°F (39.4°C) or higher in adults that doesn't respond to fluids and rest.`
  },
  {
    tags: ['sleep', 'insomnia', 'sleep hygiene', 'rest', 'circadian'],
    title: 'Evidence-Based Sleep Hygiene Essentials',
    response: `Quality sleep is vital for immune function, cellular repair, memory consolidation, and cardiovascular health.

**Core Guidelines for Restful Sleep:**
1. **Consistency:** Go to bed and wake up at the exact same time every day, even on weekends.
2. **Light Control:** Get 15–30 minutes of natural sunlight first thing in the morning to anchor your circadian rhythm. Dim screens 1 hour before sleep.
3. **Room Temperature:** Keep your bedroom cool (around 65°F to 68°F / 18°C to 20°C).
4. **Caffeine Window:** Stop caffeine intake at least 8 hours prior to bedtime.
5. **Wind-Down Ritual:** Replace phone scrolling with light reading, gentle stretching, or warm herbal tea (e.g., chamomile).`
  },
  {
    tags: ['hydration', 'water', 'dehydration', 'drink'],
    title: 'Daily Hydration: How Much Water Do You Need?',
    response: `Your body is roughly 60% water. Proper hydration regulates body temperature, lubricates joints, prevents infections, and delivers nutrients to cells.

**Daily Intake Baseline:**
• The National Academies recommend approximately **3.7 liters (125 oz)** total fluid for men and **2.7 liters (91 oz)** for women per day from all beverages and moisture-rich foods (like fruits and vegetables).
• A practical goal: Drink roughly 8–10 cups of pure water daily, adjusting upward during hot weather, intense exercise, or illness.

**Quick Self-Check:**
Your urine color should be a pale straw-like yellow. Dark amber indicates you need more fluids; crystal clear may indicate overhydration.`
  },
  {
    tags: ['doctor', 'appointment', 'prepare', 'questions', 'physician visit'],
    title: 'How to Prepare for an Effective Doctor Visit',
    response: `To maximize your time with your doctor:

1. **Write Down Your Symptoms:** Note when they started, what triggers or relieves them, and their severity (scale 1 to 10).
2. **Bring a Complete Medication List:** Include prescription drugs, vitamins, herbal supplements, and over-the-counter painkillers with exact doses.
3. **List Your Top 3 Questions:** Start with your most urgent concern first so you don't run out of time at the end of the appointment.
4. **Bring Relevant Records:** Any recent lab results, imaging reports, or logs (e.g., home blood pressure or blood sugar logs).
5. **Take Notes:** Don't hesitate to ask: *"Could you explain that term?"* or *"What are my treatment options and side effects?"*`
  },
  {
    tags: ['hba1c', 'sugar', 'glucose', 'diabetes', 'a1c'],
    title: 'Understanding Blood Sugar and the HbA1c Test',
    response: `The **Hemoglobin A1c (HbA1c)** test reflects your average blood sugar (glucose) levels over the past 2 to 3 months:

• **Normal:** Below 5.7%
• **Prediabetes:** 5.7% to 6.4%
• **Diabetes:** 6.5% or higher on two separate tests

**Why it matters:**
Glucose in your bloodstream naturally attaches to hemoglobin in red blood cells. Because red blood cells live for about 120 days, the test provides a reliable, long-term picture rather than a single fasting snapshot.`
  },
  {
    tags: ['abbreviation', 'rx', 'bid', 'tid', 'prn', 'otc', 'medical terms'],
    title: 'Common Medical & Prescription Abbreviations',
    response: `Doctors and pharmacists frequently use standardized Latin and clinical abbreviations:

• **Rx:** Prescription / Treatment
• **OTC:** Over-the-counter (no prescription required)
• **QD:** Once daily (*quaque die*)
• **BID:** Twice daily (*bis in die*)
• **TID:** Three times daily (*ter in die*)
• **PRN:** As needed (*pro re nata*)
• **PO:** By mouth / orally (*per os*)
• **CBC:** Complete Blood Count (standard blood test)
• **BMP / CMP:** Basic / Comprehensive Metabolic Panel
• **NPO:** Nothing by mouth (*nil per os* — usually before surgery or fasting blood draws)`
  },
  {
    tags: ['stress', 'anxiety', 'calm', 'mental', 'breathing', 'grounding'],
    title: 'Managing Acute Stress & Anxiety: The 5-4-3-2-1 Technique',
    response: `When experiencing feelings of sudden stress or anxious overwhelm, the **5-4-3-2-1 sensory grounding technique** helps reconnect you with the present moment:

Look around your environment and quietly identify:
• **5** things you can see (a book, a leaf, shadows, a lamp)
• **4** things you can physically touch (your sleeve, the chair surface, smooth table)
• **3** things you can hear (clock ticking, distant traffic, your own breath)
• **2** things you can smell (coffee, fresh air, wood)
• **1** thing you can taste (mint, water, lingering tea)

Pair this with **Box Breathing**: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and pause for 4 seconds. Repeat for 3 cycles.`
  },
  {
    tags: ['rice', 'sprain', 'injury', 'strain', 'bruise', 'first aid'],
    title: 'First Aid for Sprains and Strains: The R.I.C.E. Protocol',
    response: `For acute, minor soft-tissue injuries (like a twisted ankle or muscle pull), memory aid **R.I.C.E.** provides standard first aid during the initial 48 hours:

• **R - Rest:** Protect the injured area and avoid putting weight or stress on it.
• **I - Ice:** Apply cold packs wrapped in a thin towel for 15–20 minutes at a time, every 2 to 3 hours. Never apply raw ice directly to bare skin.
• **C - Compression:** Wrap with an elastic bandage (e.g., ACE wrap) to minimize swelling. Wrap firmly but not so tight that it numbs or tingles.
• **E - Elevation:** Prop the injured limb up above the level of your heart when resting to help fluid drain away.

⚠️ *Seek immediate evaluation if you cannot bear any weight, if there is visible deformity, or if numbness develops.*`
  }
];

// Emergency phrases that trigger immediate safety alerts
const EMERGENCY_KEYWORDS = [
  'chest pain', 'heart attack', 'stroke', 'cant breathe', "can't breathe",
  'difficulty breathing', 'shortness of breath', 'severe bleeding',
  'unconscious', 'fainted', 'suicide', 'kill myself', 'overdose',
  'choking', 'anaphylaxis', 'swelling throat', 'slurred speech'
];

// Diagnostic/prescription requests to politely decline
const DIAGNOSIS_KEYWORDS = [
  'diagnose', 'what disease do i have', 'prescribe', 'what medication should i take',
  'antibiotic dosage', 'cure my', 'give me a prescription', 'what medicine to buy for',
  'what illness is this', 'do i have cancer', 'write a prescription'
];

const AssistantService = {
  isGeminiConfigured: false,
  activeModel: 'gemini-2.5-flash',

  // Check if message is an emergency
  isEmergency(text) {
    const clean = text.toLowerCase();
    return EMERGENCY_KEYWORDS.some(kw => clean.includes(kw));
  },

  // Check if message demands diagnosis or prescription
  isDiagnosticRequest(text) {
    const clean = text.toLowerCase();
    return DIAGNOSIS_KEYWORDS.some(kw => clean.includes(kw));
  },

  // Check backend Gemini status on initialization
  async checkStatus() {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        this.isGeminiConfigured = Boolean(data.configured);
        this.activeModel = data.model || 'gemini-2.5-flash';
        return data;
      }
    } catch {
      // Backend not running (e.g. running purely as static HTML file)
      this.isGeminiConfigured = false;
    }
    return { configured: false, status: 'offline' };
  },

  // Primary entrypoint for queries
  async ask(userMessage, chatHistory = []) {
    const clean = userMessage.toLowerCase().trim();

    // 1. Client-Side Immediate Emergency Guardrail
    if (this.isEmergency(clean)) {
      return {
        type: 'emergency',
        title: '🚨 Immediate Medical Emergency Notice',
        badge: '🚨 Emergency Directive',
        content: `**CRITICAL SAFETY ALERT:**
If you or someone nearby is experiencing acute symptoms such as severe chest pressure, shortness of breath, sudden facial drooping, arm weakness, slurred speech, heavy bleeding, or severe allergic reaction:

**Please do not wait. Immediately call your local emergency service:**
• **United States / Canada:** Dial **911**
• **Europe / UK:** Dial **112** or **999**
• **India:** Dial **112** or **102**
• Or proceed immediately to the nearest hospital Emergency Department.

MediBridge is an educational tool and cannot evaluate emergency medical crises.`
      };
    }

    // 2. Client-Side Clinical Boundary Guardrail (No diagnosis, no prescriptions)
    if (this.isDiagnosticRequest(clean)) {
      return {
        type: 'boundary',
        title: '⚕️ Clinical Boundary Notice',
        badge: '⚕️ Clinical Guardrail',
        content: `**I cannot diagnose medical conditions or prescribe medications.**

As an educational digital assistant, I do not have access to clinical examinations, vital signs, lab diagnostics, or your personal medical history. Recommending specific prescription medicines or offering diagnoses online is unsafe.

**Recommended Next Steps:**
1. **Schedule a consultation** with your primary care physician or visit an urgent care center for an in-person physical assessment.
2. Note when your symptoms started, their frequency, and any relief factors to share with your doctor.
3. You can use the **Appointments** tab in MediBridge to track your upcoming doctor visit!`
      };
    }

    // 3. Attempt Google Gemini AI Proxy Call
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
  message: userMessage,
  history: chatHistory.filter(msg => {
    const text = String(msg.content || '').toLowerCase();

    return (
      msg.type !== 'emergency' &&
      !text.includes('critical safety alert') &&
      !text.includes('immediate medical emergency') &&
      !text.includes('chest pain') &&
      !text.includes('difficulty breathing') &&
      !text.includes('shortness of breath')
    );
  })
})
      });

      if (response.ok) {
        const data = await response.json();

        if (data.success && data.reply) {
          this.isGeminiConfigured = true;
          return {
            type: 'gemini',
            source: 'gemini',
            title: 'Educational Health Guidance',
            badge: 'Google Gemini AI • Educational Guide',
            content: data.reply
          };
        }

        // Backend indicated key is missing or reported an API quota issue
        if (data.fallback) {
          console.warn('[AssistantService] Gemini API fallback:', data.error);
          const fallback = this.findFallbackAnswer(userMessage);
          fallback.badge = 'Demo Knowledge Engine (API Key Not Set)';
          fallback.notice = data.error;
          return fallback;
        }
      }
    } catch (err) {
      // Server is offline or app opened directly via file://
      console.info('[AssistantService] Backend proxy offline; using built-in knowledge engine.');
    }

    // 4. Safe Offline Knowledge Base Fallback
    const fallbackResult = this.findFallbackAnswer(userMessage);
    fallbackResult.badge = 'Demo Knowledge Engine (Offline Mode)';
    return fallbackResult;
  },

  // Built-in rule-based knowledge engine fallback
  findFallbackAnswer(userMessage) {
    const clean = userMessage.toLowerCase().trim();
    let bestMatch = null;
    let highestScore = 0;

    for (const item of KNOWLEDGE_BASE) {
      let score = 0;
      for (const tag of item.tags) {
        if (clean.includes(tag)) {
          score += tag.length;
        }
      }
      if (score > highestScore) {
        highestScore = score;
        bestMatch = item;
      }
    }

    if (bestMatch && highestScore > 0) {
      return {
        type: 'educational',
        source: 'demo',
        title: bestMatch.title,
        content: bestMatch.response
      };
    }

    return {
      type: 'fallback',
      source: 'demo',
      title: 'Health Knowledge Guide',
      content: `I'm your **MediBridge Educational Assistant**. I can help you understand common health terms, preventive habits, and how to navigate discussions with your doctor.

**Topics you can ask me about:**
• *"What does a blood pressure reading of 120/80 mean?"*
• *"Explain the difference between HDL and LDL cholesterol."*
• *"Why don't antibiotics work on the common cold?"*
• *"What does the HbA1c blood test measure?"*
• *"Tips for improving sleep hygiene"*
• *"How can I prepare for an upcoming doctor's visit?"*
• *"Explain the 5-4-3-2-1 anxiety grounding technique"*
• *"What are common prescription abbreviations like BID and PRN?"*

*(Note: MediBridge provides general wellness awareness and does not replace medical advice.)*`
    };
  },

  // Legacy synchronous fallback method
  findAnswer(userMessage) {
    return this.findFallbackAnswer(userMessage);
  }
};

window.AssistantService = AssistantService;
