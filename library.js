/**
 * MediBridge - Health Library Module
 * Curated, evidence-based health awareness articles, search & reader modal.
 */

const HEALTH_ARTICLES = [
  {
    id: 'art-1',
    category: 'Heart Health',
    title: 'Heart Health 101: Understanding Blood Pressure & Cholesterol',
    summary: 'A clear guide to systolic vs diastolic readings, HDL vs LDL cholesterol, and daily heart-protective habits.',
    readTime: '4 min read',
    icon: 'heart',
    featured: true,
    takeaways: [
      'Normal blood pressure is under 120/80 mmHg.',
      'HDL is protective ("good"); LDL contributes to arterial plaque buildup.',
      'Daily 30-minute brisk walks significantly improve vascular elasticity.'
    ],
    content: `
      <h3>Why Cardiovascular Health Matters</h3>
      <p>Your heart beats approximately 100,000 times per day, pumping roughly 2,000 gallons of oxygenated blood through a 60,000-mile network of vessels. Keeping these vessels flexible and clear of obstructive plaque is the cornerstone of longevity.</p>

      <h3>Demystifying the Numbers</h3>
      <p>When you visit a clinic or use a home monitor, you receive two key metrics:</p>
      <ul>
        <li><strong>Systolic (Top number):</strong> Measures arterial pressure when the heart contracts.</li>
        <li><strong>Diastolic (Bottom number):</strong> Measures arterial pressure when the heart relaxes between beats.</li>
      </ul>
      <p>Consistent readings above 130/80 mmHg warrant a discussion with your doctor about lifestyle interventions or cardioprotective therapies.</p>

      <h3>The Role of Lipids (Cholesterol)</h3>
      <p>Cholesterol travels in protein packages known as lipoproteins:</p>
      <ul>
        <li><strong>HDL (High-Density):</strong> Acts like a cellular vacuum cleaner, scooping excess arterial cholesterol and delivering it to the liver for excretion.</li>
        <li><strong>LDL (Low-Density):</strong> Deposits cholesterol onto arterial walls, potentially causing hardened plaques over decades.</li>
      </ul>

      <h3>Evidence-Based Daily Habits</h3>
      <ol>
        <li><strong>Embrace the Mediterranean Pattern:</strong> Extra-virgin olive oil, wild fish, walnuts, and leafy greens.</li>
        <li><strong>Mind Your Sodium:</strong> Keep daily sodium under 2,300 mg (or 1,500 mg if advised by your physician).</li>
        <li><strong>Incorporate Zone 2 Cardio:</strong> Moderate activities where you can still speak in full sentences (e.g. brisk walking, cycling).</li>
      </ol>
    `
  },
  {
    id: 'art-2',
    category: 'Sleep Science',
    title: 'The Science of Restful Sleep: 7 Habits for Optimal Recovery',
    summary: 'Learn how sleep cycles rebuild cellular immunity and how to optimize your environment for restorative rest.',
    readTime: '5 min read',
    icon: 'moon',
    featured: false,
    takeaways: [
      'Deep slow-wave sleep is when physical tissue repair and growth hormone release occur.',
      'Morning sunlight exposure aligns the master circadian pacemaker in your brain.',
      'Caffeine has an average half-life of 5 to 7 hours.'
    ],
    content: `
      <h3>Sleep is Not Passive Rest</h3>
      <p>During sleep, your brain’s glymphatic system actively flushes out metabolic waste, while your immune system manufactures protective cytokines that combat infection and inflammation.</p>

      <h3>The Architecture of Sleep</h3>
      <p>A typical night consists of 4 to 6 cycles lasting 90 minutes each, alternating between Non-REM (light and restorative deep sleep) and REM (dreaming, emotional processing, and memory consolidation).</p>

      <h3>7 Practical Sleep Optimizations</h3>
      <ol>
        <li><strong>Anchor Your Wake Time:</strong> Wake up at the exact same hour 7 days a week to stabilize circadian timing.</li>
        <li><strong>Early Light Exposure:</strong> Step outside within 30 minutes of waking for 10–15 minutes of natural sunlight.</li>
        <li><strong>Bedroom Temperature:</strong> Human core body temperature must drop by 1°F to 2°F to initiate sleep. Keep rooms between 65°F and 68°F (18°C–20°C).</li>
        <li><strong>Respect the Caffeine Cutoff:</strong> Eliminate coffee and energy drinks 8 hours before bed.</li>
        <li><strong>Darkness is Essential:</strong> Blackout curtains or a comfortable eye mask prevent light from suppressing melatonin.</li>
        <li><strong>Wind-Down Buffer:</strong> Dedicate the last 45 minutes before sleep to screen-free activities.</li>
        <li><strong>Reserve Bed for Sleep:</strong> Avoid working on laptops or stressing over spreadsheets in bed.</li>
      </ol>
    `
  },
  {
    id: 'art-3',
    category: 'Nutrition',
    title: 'Everyday Nutrition: Building a Balanced Plate with Whole Foods',
    summary: 'Ditch restrictive dieting myths and discover a sustainable, colorful approach to whole-food nutrition.',
    readTime: '4 min read',
    icon: 'apple',
    featured: true,
    takeaways: [
      'Fill half your plate with colorful vegetables and fiber-dense plants.',
      'Aim for 25 to 35 grams of daily dietary fiber for gut microbiome vitality.',
      'Prioritize minimally processed whole foods over refined carbohydrates.'
    ],
    content: `
      <h3>The "Healthy Plate" Visual Guide</h3>
      <p>Instead of tedious calorie counting, many registered dietitians recommend the visual plate method:</p>
      <ul>
        <li><strong>1/2 Plate — Colorful Vegetables & Fruits:</strong> Rich in micronutrients, antioxidants, and prebiotic fiber (spinach, peppers, broccoli, berries).</li>
        <li><strong>1/4 Plate — Quality Protein:</strong> Chicken breast, tofu, lentils, eggs, tempeh, or salmon. Protein supports muscle preservation and satiety.</li>
        <li><strong>1/4 Plate — Complex Carbohydrates:</strong> Quinoa, brown rice, sweet potatoes, oats, or legumes that provide sustained glucose release.</li>
        <li><strong>A Thumb of Healthy Fats:</strong> Avocado, seeds, nuts, or extra-virgin olive oil for cellular membrane health and fat-soluble vitamin absorption.</li>
      </ul>

      <h3>The Fiber Imperative</h3>
      <p>Most individuals consume less than 15 grams of fiber daily, far below the recommended 25–38 grams. Adequate soluble and insoluble fiber stabilizes blood sugar spikes, reduces LDL cholesterol, and nourishes the gut microbiome.</p>
    `
  },
  {
    id: 'art-4',
    category: 'Mental Wellness',
    title: 'Mental Wellness: Practical Tools for Stress & Anxiety Management',
    summary: 'Clinically grounded techniques to down-regulate the sympathetic nervous system during acute stress.',
    readTime: '6 min read',
    icon: 'brain',
    featured: true,
    takeaways: [
      'Stress is an evolutionary physiological response, not a personal flaw.',
      'Physiological sighs rapidly trigger the parasympathetic (calming) brake.',
      'Consistent social connection is one of the strongest protective health buffers.'
    ],
    content: `
      <h3>Understanding the Stress Response</h3>
      <p>When you encounter a perceived stressor, the amygdala signals the hypothalamus, triggering adrenaline and cortisol release. Your heart rate quickens, blood shunts toward major muscles, and breathing becomes shallow.</p>

      <h3>Fast Biological De-Escalators</h3>
      <h4>1. The Physiological Sigh</h4>
      <p>Studied extensively at Stanford University, two quick nasal inhales followed by one long, slow mouth exhale re-inflates collapsed pulmonary alveoli and immediately lowers heart rate within 2 to 3 breath cycles.</p>

      <h4>2. Box Breathing (4x4)</h4>
      <p>Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat for 3 minutes to regain cognitive calm.</p>

      <h4>3. Progressive Muscle Relaxation (PMR)</h4>
      <p>Systematically tensing and releasing muscle groups from your toes to your forehead helps release subconscious muscular tension stored during demanding workdays.</p>

      <h3>When to Seek Professional Guidance</h3>
      <p>If persistent anxiety, low mood, or feelings of hopelessness interfere with sleep, work, or relationships for more than two consecutive weeks, speaking with a licensed therapist or psychiatrist is a compassionate, evidence-based step forward.</p>
    `
  },
  {
    id: 'art-5',
    category: 'Preventive Care',
    title: 'Preventive Health Checklist: Recommended Screenings by Decade',
    summary: 'A proactive roadmap of routine lab tests, immunizations, and cancer screenings across adult life.',
    readTime: '5 min read',
    icon: 'shield-check',
    featured: false,
    takeaways: [
      'Preventive screenings detect silent conditions years before symptoms manifest.',
      'Annual blood pressure checks and lipid panels are fundamental for all adults.',
      'Know your family medical history to adjust screening timelines earlier.'
    ],
    content: `
      <h3>The Power of Proactive Medicine</h3>
      <p>Conditions like high blood pressure, elevated blood glucose, and early-stage cardiovascular disease rarely cause noticeable symptoms in their early stages. Preventive health screenings give you a vital window to intervene through simple lifestyle adjustments.</p>

      <h3>General Adult Screenings Overview</h3>
      <ul>
        <li><strong>In Your 20s & 30s:</strong> Annual physical, blood pressure check, lipid profile every 4–5 years, dental exams every 6 months, skin exam, and routine cervical cancer screening (for women).</li>
        <li><strong>In Your 40s:</strong> Comprehensive metabolic panel, HbA1c screening for prediabetes, mammograms (starting at age 40 based on personal history), vision exams.</li>
        <li><strong>In Your 50s & Beyond:</strong> Colorectal cancer screening (colonoscopy or stool DNA tests beginning at age 45), bone density DEXA scans, shingles vaccine series, prostate discussions (for men).</li>
      </ul>

      <p><em>Always discuss your individual risk factors and family medical history with your primary care provider to tailor your exact schedule.</em></p>
    `
  },
  {
    id: 'art-6',
    category: 'First Aid',
    title: 'First Aid Essentials: Handling Cuts, Burns, and Sprains at Home',
    summary: 'Standard first responder protocols for common domestic injuries before professional help is needed.',
    readTime: '4 min read',
    icon: 'plus-circle',
    featured: false,
    takeaways: [
      'Cool minor burns under cool running tap water for at least 10–15 minutes (no ice).',
      'Clean minor wounds with mild soap and clean running water; avoid rubbing alcohol on open wounds.',
      'Use the R.I.C.E. protocol for joint sprains.'
    ],
    content: `
      <h3>Home First Aid Fundamentals</h3>
      <p>Having a well-stocked first aid kit and knowing the immediate response steps can prevent complications and infections.</p>

      <h3>1. Minor First-Degree Burns</h3>
      <ul>
        <li><strong>DO:</strong> Run cool (not ice-cold) tap water over the burn for 10 to 15 minutes immediately.</li>
        <li><strong>DO:</strong> Apply pure aloe vera gel or a sterile burn dressing.</li>
        <li><strong>DON’T:</strong> Never apply butter, mayonnaise, toothpaste, or direct ice, as these trap heat and introduce bacteria.</li>
      </ul>

      <h3>2. Minor Cuts and Abrasions</h3>
      <ul>
        <li>Apply gentle, firm pressure with a clean cloth to stop minor bleeding.</li>
        <li>Rinse the wound gently under running tap water to remove debris. Clean surrounding skin with mild soap.</li>
        <li>Apply a thin layer of petroleum jelly or antibacterial ointment, then cover with a sterile adhesive bandage.</li>
      </ul>

      <h3>3. Acute Sprains and Strains</h3>
      <p>Apply <strong>R.I.C.E.</strong>: Rest the limb, Ice for 15 minutes every 2 hours wrapped in a towel, Compress gently with an elastic bandage, and Elevate above heart level.</p>

      <p>⚠️ <strong>Red Flags Requiring Immediate Emergency Care:</strong> Deep puncture wounds, gaping cuts that won't stop bleeding after 10 minutes of direct pressure, burns with blisters larger than 2 inches, burns on the face or joints, or inability to bear weight on a limb.</p>
    `
  }
];

const LibraryManager = {
  articles: HEALTH_ARTICLES,
  currentCategory: 'All',
  searchQuery: '',
  bookmarkedIds: [],

  init() {
    this.bookmarkedIds = window.StorageService.getBookmarks();
    this.render();
    this.bindEvents();
  },

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('library-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.render();
      });
    }

    // Category pills
    const categoryButtons = document.querySelectorAll('[data-lib-category]');
    categoryButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        categoryButtons.forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentCategory = e.currentTarget.getAttribute('data-lib-category');
        this.render();
      });
    });
  },

  toggleBookmark(artId, event) {
    if (event) event.stopPropagation();

    const idx = this.bookmarkedIds.indexOf(artId);
    if (idx > -1) {
      this.bookmarkedIds.splice(idx, 1);
      window.MediApp.showToast('Article removed from saved bookmarks.', 'info');
    } else {
      this.bookmarkedIds.push(artId);
      window.MediApp.showToast('Article saved to your bookmarks!', 'success');
    }

    window.StorageService.saveBookmarks(this.bookmarkedIds);
    this.render();
  },

  openArticle(artId) {
    const article = this.articles.find(a => a.id === artId);
    if (!article) return;

    const modal = document.getElementById('article-modal');
    const titleEl = document.getElementById('modal-art-title');
    const metaEl = document.getElementById('modal-art-meta');
    const takeawaysEl = document.getElementById('modal-art-takeaways');
    const contentEl = document.getElementById('modal-art-content');

    if (!modal) return;

    if (titleEl) titleEl.textContent = article.title;
    if (metaEl) {
      metaEl.innerHTML = `
        <span class="lib-category-tag">${article.category}</span>
        <span class="lib-read-time">${article.readTime}</span>
      `;
    }

    if (takeawaysEl) {
      takeawaysEl.innerHTML = `
        <div class="takeaways-box">
          <h4>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
            Key Health Takeaways
          </h4>
          <ul>
            ${article.takeaways.map(t => `<li>${escapeHTML(t)}</li>`).join('')}
          </ul>
        </div>
      `;
    }

    if (contentEl) {
      contentEl.innerHTML = `
        <div class="article-body">
          ${article.content}
        </div>
        <div class="article-disclaimer">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <div>
            <strong>Educational Awareness Disclaimer:</strong> This article is published for educational and awareness purposes only. It is not medical advice and cannot replace professional medical diagnosis, evaluation, or personalized treatment. Consult a licensed physician for your health questions.
          </div>
        </div>
      `;
    }

    window.MediApp.openModal('article-modal');
  },

  render() {
    const container = document.getElementById('library-grid');
    const emptyState = document.getElementById('library-empty');

    if (!container) return;

    let filtered = this.articles;

    // Filter by Category
    if (this.currentCategory !== 'All') {
      if (this.currentCategory === 'Bookmarks') {
        filtered = filtered.filter(a => this.bookmarkedIds.includes(a.id));
      } else {
        filtered = filtered.filter(a => a.category.toLowerCase() === this.currentCategory.toLowerCase());
      }
    }

    // Filter by Search Query
    if (this.searchQuery) {
      filtered = filtered.filter(a => {
        return a.title.toLowerCase().includes(this.searchQuery) ||
               a.summary.toLowerCase().includes(this.searchQuery) ||
               a.category.toLowerCase().includes(this.searchQuery);
      });
    }

    if (filtered.length === 0) {
      container.innerHTML = '';
      if (emptyState) emptyState.style.display = 'block';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';

    container.innerHTML = filtered.map(art => {
      const isBookmarked = this.bookmarkedIds.includes(art.id);

      return `
        <article class="lib-card" onclick="LibraryManager.openArticle('${art.id}')">
          <div class="lib-card-top">
            <span class="lib-category-tag">${art.category}</span>
            <button class="btn-icon btn-bookmark ${isBookmarked ? 'bookmarked' : ''}" onclick="LibraryManager.toggleBookmark('${art.id}', event)" title="${isBookmarked ? 'Remove Bookmark' : 'Save Article'}" aria-label="Bookmark article">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="${isBookmarked ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg>
            </button>
          </div>

          <h3 class="lib-card-title">${escapeHTML(art.title)}</h3>
          <p class="lib-card-summary">${escapeHTML(art.summary)}</p>

          <div class="lib-card-footer">
            <span class="lib-read-time">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              ${art.readTime}
            </span>
            <span class="lib-read-cta">
              Read Guide
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </span>
          </div>
        </article>
      `;
    }).join('');
  }
};

window.LibraryManager = LibraryManager;
