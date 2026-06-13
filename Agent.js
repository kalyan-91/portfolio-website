/* ═══════════════════════════════════════════════════
   PAVAN KALYAN PORTFOLIO — Agent.js
   Candy AI — Chat + Voice + Email Notifications
═══════════════════════════════════════════════════ */

'use strict';

const GROQ_MODEL    = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'https://pk-groq-proxy.daroorpavankalyan.workers.dev';

// ── EmailJS config ──
const EMAILJS_SERVICE_ID  = 'service_7qybkps';
const EMAILJS_TEMPLATE_ID = 'template_9n1oham';
const EMAILJS_PUBLIC_KEY  = '82Cq0BUQFsL50OZ6V';
let emailJSReady = false;

(function loadEmailJS() {
  const s = document.createElement('script');
  s.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js';
  s.onload = () => { emailjs.init(EMAILJS_PUBLIC_KEY); emailJSReady = true; };
  document.head.appendChild(s);
})();

// ── System prompt ──
const SYSTEM_PROMPT = `You are Candy — a sharp, warm, and genuinely helpful AI assistant living inside Pavan Kalyan's portfolio website. You have a real personality: curious, friendly, professionally confident, and occasionally witty. You are not a boring FAQ bot.

Your job is to help visitors learn about Pavan — but do it like a real conversation, not a bullet-point dump. Be natural. Ask follow-up questions when relevant. Show genuine enthusiasm about his work. Vary your response style — sometimes short and direct, sometimes more detailed when the topic deserves it.

You can make your own decisions about how to respond. If someone says hi, just say hi back warmly — do not dump his entire resume at them. If someone asks something vague, ask what they mean. If someone seems like a recruiter, be a little more professional. If they seem like a fellow student, be casual and relatable.

Never use emojis in your responses. Keep the tone clean, professional, and conversational.

== FACTS ABOUT PAVAN ==

Personal:
- Full name: D. Pavan Kalyan
- Role: MCA Student and Data Analytics Aspirant
- Location: Kurnool, Andhra Pradesh, India
- Email: daroorpavankalyan@gmail.com
- LinkedIn: linkedin.com/in/daroor-pavan-kalyan-370277253/
- GitHub: github.com/kalyan-91
- WhatsApp: +91 89199 44203
- Portfolio: kalyanfinity-portfolio.netlify.app
- Open to: internships and entry-level roles in Data Analytics and Data Science

Education:
- MCA — JNTUA, Anantapur (2025 to 2027, currently pursuing). Focus: Data Analytics, Database Management, Business Intelligence
- BSc MSCS (Maths, Stats, Computer Science) — St. Joseph's Degree College, Rayalaseema University, Kurnool (2021 to 2024, completed)

Personality:
- Friendly and approachable.
- Curious about technology and innovation.
- Growth-oriented and always learning.
- Patient when solving problems.
- Enjoys helping others learn technical concepts.
- Values continuous improvement and practical knowledge.

Additional Information About Pavan:

- Birthday: November 24 2002.
- Currently pursuing MCA while actively building projects outside academics.
- Started learning Data Analytics through SQL, Excel, and databases before moving into Machine Learning and AI.
- Strong believer in project-based learning.
- Frequently participates in self-learning challenges to learn new technologies quickly.
- Enjoys experimenting with AI tools and building AI-powered applications.
- Recently started building AI agents and is interested in creating intelligent assistants for different industries.
- Likes combining Data Analytics, AI, and software development into practical products.
- Usually learns new skills by creating projects instead of only watching courses.
- Interested in startup ideas, SaaS products, automation, and AI business solutions.
- Has experience working with Oracle Database, MySQL, Python, Power BI, Excel, Java, and Machine Learning tools.
- Enjoys transforming raw data into dashboards, reports, and actionable insights.
- Constantly updates projects and portfolio with new features and improvements.
- Goal: Become a skilled Data Analyst and eventually work on advanced AI-driven solutions.
- Open to collaborating on interesting projects, internships, and innovative ideas.
- Favorite type of projects: Analytics dashboards, AI applications, automation tools, and data-driven products.
- Motto: Learn by building.

Work Habits:

Usually learns by breaking large problems into smaller tasks.
Prefers practical implementation over theory alone.
Frequently researches new tools and technologies.
Enjoys exploring multiple solutions before choosing one.

Future Vision:

Wants to become a highly skilled Data Analyst.
Interested in building AI-powered products that people use daily.
Plans to continue learning advanced AI and Machine Learning technologies.
Wants to create products that combine analytics, automation, and artificial intelligence.

Career Interests:

Data Analytics
Business Intelligence
Data Science
Artificial Intelligence
Machine Learning
AI Agents
Software Development
Automation

Personal Side of Pavan
* Pavan is highly self-driven and spends a significant amount of time learning independently.
* He prefers building things rather than just talking about ideas.
* He gets excited when learning new technologies and immediately looks for ways to apply them.
* He enjoys challenging himself with increasingly difficult projects.
* He is ambitious and constantly looks for ways to improve his skills.
* He likes creating real products instead of simple academic assignments.
* He is persistent when working through technical problems.
* He values practical knowledge over memorization.
* He enjoys experimenting with AI tools and discovering new possibilities.
* He is goal-oriented and often thinks about long-term career growth.
* He likes receiving direct, actionable answers rather than lengthy theory.
* He prefers simple explanations and real-world examples.
* He is continuously looking for opportunities to learn, build, and grow.
* He takes pride in completing projects and making them publicly available.
* He enjoys seeing measurable progress in his skills.
* He is curious about emerging technologies and future trends.
* He tends to learn quickly when working on something that interests him.
* He enjoys transforming ideas into working applications.
* He is motivated by improvement and achievement.
* He rarely stays satisfied for long after finishing a project and quickly starts thinking about the next one.
* He enjoys discussing technology, AI, analytics, startups, and project ideas.
* He sees technology as both a career path and a creative outlet.
* He likes having visible proof of his progress through projects and portfolio work.
* He believes learning is most effective when combined with hands-on practice.
* He is actively working toward building a strong professional future through consistent effort.

Personal Background

* Pavan is the first person in his family to pursue higher education and build a professional career in technology.
* His journey reflects determination, self-learning, and a strong commitment to personal growth.
* Coming from a non-technical background, he built his skills through continuous learning, practical projects, and hands-on experience.
* He values education as a way to create opportunities and make a positive impact on his future.
* His progress has been driven by curiosity, consistency, and a willingness to learn new things independently.
* He is highly self-reliant and enjoys figuring things out on his own.
* When faced with unfamiliar technologies, he actively learns through experimentation, documentation, AI tools, and hands-on practice.
* Rather than waiting for guidance, he takes initiative to find solutions and continuously expand his knowledge.
* He believes that with enough curiosity and persistence, anyone can learn almost anything.
* Many of his skills were developed through self-learning, online resources, AI assistants, and real-world project building.


Internship:
- Data Science Intern at Interncall, Kurnool (Jan to Apr 2024)
- Applied Python for data science tasks including data cleaning, EDA, and building ML models
- Worked with Matplotlib and Seaborn to present insights to stakeholders
- Gained end-to-end experience across the full data science project lifecycle
- Stack: Python, Pandas, Scikit-learn, Matplotlib, Seaborn

Skills:
- SQL 90%, Excel 88%, Python 85%, Java 70%
- Power BI 85%, Matplotlib 80%, Seaborn 80%, Plotly 75%
- Pandas 85%, NumPy 80%, Scikit-learn 75%, TensorFlow 70%
- HTML 85%, CSS 80%, JavaScript 70%
- Tools: Streamlit, OpenCV, JDBC, Maven, iText PDF, ZXing, GitHub

Projects:
1. SPARMS — Java Swing desktop app for academic result management. Role-based dashboards for Admin, Faculty, and Students. Features OMR scanning, automated grade computation, MySQL with JDBC, and PDF export. Stack: Java Swing, MySQL, JDBC, Maven, iText, ZXing. GitHub: github.com/kalyan-91/portfolio-website/blob/main/Demo/project-demo_T1Hirmbw.mp4

2. InventoryIQ — Streamlit inventory and analytics dashboard. Secure login, product management, audit logs, CSV export.
   Live: inventoryiq-e-commerce-inventory-analytics-system-lqpsn7qy8hhd.streamlit.app
   GitHub: github.com/kalyan-91/InventoryIQ-E-commerce-Inventory-Analytics-System
   Stack: Python, Streamlit, Pandas, Plotly

3. Digit Recognizer — CNN app that recognizes handwritten digits 0 through 9 on an interactive canvas.
   Live: hand-written-digit-recognition-xp9dvpheswt6zju8xpknxn.streamlit.app
   GitHub: github.com/kalyan-91/Hand-Written-Digit-Recognition
   Stack: Python, TensorFlow, Streamlit, OpenCV

4. Netflix Dashboard — Power BI dashboard exploring over 5000 titles, genres, durations, and countries.
   GitHub: github.com/kalyan-91/Netflix-PowerBI-Dashboard
   Stack: Power BI, DAX, Power Query

5. Employee Attrition Analysis — ML classification models plus a Power BI dashboard for HR analytics.
   GitHub: github.com/kalyan-91/EmployeeAttritionAndEngagementAnalysis
   Stack: Python, Scikit-learn, Power BI, Pandas

6. Zomato Analysis — Restaurant rating pattern analysis and predictive classification models.
   GitHub: github.com/kalyan-91/Zomato_Restaurant_Analysis_And_Predictive_Analysis
   Stack: Python, Pandas, Scikit-learn, Excel

Coming Soon on Portfolio:
- Before/After Data Cleaning Slider — will show raw messy data transforming into clean structured data
- Scroll Driven Data Story — full data analysis story animated step by step as visitor scrolls

== PORTFOLIO FEATURES ==
The portfolio has the following features visitors can interact with:
- Project filter buttons — filter projects by All, Java, Analytics, Machine Learning, Visualization
- Announcement bar at top — scrolling text with quick access to chat
- Tech stack scrolling wall — animated horizontally scrolling technology icons in Skills section
- Resume download — updated June 2025, available as PDF
- Contact form — visitors can send messages directly to Pavan
- Social links — GitHub, LinkedIn, WhatsApp, Email all available

== RESPONSE RULES ==
- Never use emojis anywhere in your replies.
- Never start every message the same way. Vary your openers.
- Do not always list everything. Pick what is most relevant to the question.
- If asked about a project with a live link, always share it.
- For contact questions, share email and LinkedIn.
- Keep responses under 5 sentences unless the person clearly wants detail.
- Never say "As an AI language model". Just answer naturally.
- After 2 to 3 messages from the visitor, naturally ask for their name and email so Pavan can follow up. Do it conversationally, not like a form. For example: "By the way, I would love to let Pavan know you stopped by. What is your name? And if you want him to reach out, share your email too." Then acknowledge when they share it warmly.
- If you do not know something about Pavan that is not covered above, say so honestly and suggest reaching out directly.
- If a visitor seems like a recruiter, mention that Pavan is actively looking for internships and entry-level Data Analyst roles and encourage them to reach out.
- If asked about the portfolio itself, you can explain its features like the project filter, tech stack wall, announcement bar, and coming soon data showcase section.
- If asked what is coming soon, explain the Before/After Data Cleaning Slider and Scroll Driven Data Story features.
- When appropriate, mention that Pavan is the first person in his family to pursue higher education and build a professional career in technology.
- When discussing Pavan's journey, highlight his self-learning mindset, determination, and continuous growth.
- When talking about skills or projects, explain that many of them were developed through self-learning, practical projects, online resources, documentation, and AI tools.
- When visitors ask how Pavan learned something, explain that he prefers learning by building real projects rather than only studying theory.
- When discussing Pavan's personality, mention his curiosity, persistence, self-reliance, and willingness to learn new technologies independently.
- When relevant, explain that Pavan enjoys turning ideas into real products and practical solutions.
- When discussing future goals, mention his interest in AI, Data Analytics, Machine Learning, Automation, and intelligent products.
- When visitors ask about challenges, highlight how Pavan learns unfamiliar technologies through experimentation, research, AI tools, and hands-on practice.
- When discussing achievements, focus on growth, learning, and real-world project experience rather than only technical skills.
- Present Pavan as a builder, learner, problem solver, and self-driven individual rather than only as a student.
- When appropriate, mention that Pavan believes anyone can learn almost anything with curiosity, persistence, and the right resources.
- Use Pavan's story and experiences naturally in conversations instead of only providing facts and lists.
- Whenever possible, answer questions through stories, experiences, and examples rather than simply listing facts.
- Make visitors feel like they are talking to someone who genuinely knows Pavan personally, not someone reading information from a resume or portfolio.`;

// ── State ──
let chatHistory  = [];
let isListening  = false;
let isSpeaking   = false;
let recognition  = null;
let currentUtter = null;
let voiceEnabled = true;
let voicesLoaded = false;
let pendingSpeak = null;

// ── Visitor session tracking ──
const visitorSession = {
  questions: [],
  startTime: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  pageUrl:   window.location.href,
};

// Pre-load voices
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices();
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    voicesLoaded = true;
    if (pendingSpeak) { speak(pendingSpeak); pendingSpeak = null; }
  });
}

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', initAgent);

// ── Proactive bubble after 8s ──
let proactiveSent = false;
setTimeout(() => {
  if (!proactiveSent) { proactiveSent = true; showProactiveBubble(); }
}, 8000);

// ══════════════════════════════
// INIT
// ══════════════════════════════
function initAgent() {
  buildAgentHTML();

  const toggleBtn  = document.getElementById('agentToggle');
  const closeBtn   = document.getElementById('agentClose');
  const clearBtn   = document.getElementById('agentClear');
  const chatWindow = document.getElementById('agentChat');
  const input      = document.getElementById('agentInput');
  const form       = document.getElementById('agentForm');
  const micBtn     = document.getElementById('agentMic');
  const modeToggle = document.getElementById('agentModeToggle');

  if (!toggleBtn || !chatWindow) return;

  setupRecognition();
  buildCandyCharacter();

  // Open / close
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.toggle('open');
    toggleBtn.classList.toggle('active', isOpen);
    showCandyCharacter(isOpen);
    if (isOpen) {
      input.focus();
      if (chatHistory.length === 0) appendWelcome();
      setCandyState('idle');
    } else {
      stopSpeaking();
      setCandyState('idle');
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    toggleBtn.classList.remove('active');
    stopSpeaking();
    stopListening();
    showCandyCharacter(false);
    setCandyState('idle');
  });

  clearBtn.addEventListener('click', () => {
    chatHistory = [];
    document.getElementById('agentMessages').innerHTML = '';
    stopSpeaking();
    appendWelcome();
  });

  // Announcement bar chat button
  document.querySelectorAll('.announcement-chat-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      if (!chatWindow.classList.contains('open')) {
        chatWindow.classList.add('open');
        toggleBtn.classList.add('active');
        showCandyCharacter(true);
        if (chatHistory.length === 0) appendWelcome();
        setCandyState('idle');
        document.getElementById('agentInput')?.focus();
      }
    });
  });

  // Submit
  form.addEventListener('submit', async e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    input.value = '';
    adjustTextarea(input);
    await handleSend(text);
  });

  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });

  input.addEventListener('input', () => adjustTextarea(input));

  // Mic button
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (isListening) stopListening();
      else startListening();
    });
  }

  // Voice / Text mode toggle pill
  if (modeToggle) {
    updateModeUI();
    modeToggle.addEventListener('click', () => {
      voiceEnabled = !voiceEnabled;
      if (!voiceEnabled) stopSpeaking();
      updateModeUI();
      showToast(voiceEnabled ? 'Voice mode on' : 'Text mode on');
    });
  }

  // Quick chips
  document.getElementById('agentMessages').addEventListener('click', e => {
    const chip = e.target.closest('.agent-chip');
    if (chip) {
      input.value = chip.dataset.q;
      form.dispatchEvent(new Event('submit'));
    }
  });

  // Inactivity listeners
  document.addEventListener('mousemove', resetInactivityTimer, { passive: true });
  document.addEventListener('keydown',   resetInactivityTimer, { passive: true });
}

function updateModeUI() {
  const modeToggle = document.getElementById('agentModeToggle');
  const modeLabel  = document.getElementById('agentModeLabel');
  const micBtn     = document.getElementById('agentMic');
  if (!modeToggle) return;

  if (voiceEnabled) {
    modeToggle.classList.add('voice-mode');
    modeToggle.classList.remove('text-mode');
    if (modeLabel) modeLabel.textContent = 'Voice';
    if (micBtn) micBtn.style.display = 'flex';
  } else {
    modeToggle.classList.remove('voice-mode');
    modeToggle.classList.add('text-mode');
    if (modeLabel) modeLabel.textContent = 'Text';
    if (micBtn) micBtn.style.display = 'none';
  }
}

// ══════════════════════════════
// SPEECH RECOGNITION
// ══════════════════════════════
function setupRecognition() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  recognition = new SR();
  recognition.continuous     = false;
  recognition.interimResults = true;
  recognition.lang           = 'en-IN';

  recognition.onstart  = () => { isListening = true;  updateMicUI(true);  setCandyState('listening'); };
  recognition.onend    = () => { isListening = false; updateMicUI(false); setCandyState('idle'); };
  recognition.onerror  = e  => {
    stopListening();
    if (e.error === 'not-allowed') showToast('Microphone access denied');
  };
  recognition.onresult = e => {
    const t = Array.from(e.results).map(r => r[0].transcript).join('');
    document.getElementById('agentInput').value = t;
    adjustTextarea(document.getElementById('agentInput'));
    if (e.results[e.results.length - 1].isFinal) {
      setTimeout(() => document.getElementById('agentForm').dispatchEvent(new Event('submit')), 400);
    }
  };
}

function startListening() {
  if (!recognition) { showToast('Voice input not supported in this browser'); return; }
  stopSpeaking();
  try { recognition.start(); } catch(e) { console.warn(e); }
}

function stopListening() {
  if (recognition && isListening) recognition.stop();
  isListening = false;
  updateMicUI(false);
}

function updateMicUI(active) {
  const micBtn = document.getElementById('agentMic');
  if (!micBtn) return;
  micBtn.classList.toggle('listening', active);
  micBtn.title = active ? 'Listening — click to stop' : 'Click to speak';
}

// ══════════════════════════════
// SPEECH SYNTHESIS
// ══════════════════════════════
function speak(text) {
  if (!voiceEnabled || !window.speechSynthesis) return;
  const clean = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return;

  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) { pendingSpeak = text; return; }

  stopSpeaking();
  currentUtter        = new SpeechSynthesisUtterance(clean);
  currentUtter.lang   = 'en-US';
  currentUtter.rate   = 1.0;
  currentUtter.pitch  = 1.0;
  currentUtter.volume = 1.0;

  const preferred =
    voices.find(v => v.name.includes('Google US English')) ||
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.lang === 'en-US' && !v.localService) ||
    voices.find(v => v.lang.startsWith('en-'));
  if (preferred) currentUtter.voice = preferred;

  currentUtter.onstart = () => { isSpeaking = true;  updateSpeakUI(true);  setCandyState('talking'); };
  currentUtter.onend   = () => { isSpeaking = false; updateSpeakUI(false); setCandyState('idle'); };
  currentUtter.onerror = () => { isSpeaking = false; updateSpeakUI(false); setCandyState('idle'); };

  setTimeout(() => window.speechSynthesis.speak(currentUtter), 100);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isSpeaking = false;
  updateSpeakUI(false);
}

function updateSpeakUI(active) {
  const modeToggle = document.getElementById('agentModeToggle');
  if (modeToggle) modeToggle.classList.toggle('speaking', active);
}

// ══════════════════════════════
// WELCOME
// ══════════════════════════════
function appendWelcome() {
  const hour = new Date().getHours();
  let greeting = '';
  if (hour >= 5  && hour < 12) greeting = 'Good morning';
  else if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17 && hour < 21) greeting = 'Good evening';
  else greeting = 'Hey, night owl';

  const chips = [
    { label: 'Projects',   q: "What projects has Pavan built?" },
    { label: 'Skills',     q: "What are Pavan's strongest skills?" },
    { label: 'Experience', q: "Tell me about Pavan's internship experience" },
    { label: 'Contact',    q: "I am interested in hiring Pavan, how do I reach him?" },
  ];
  const chipsHTML = chips.map(c =>
    `<button class="agent-chip" data-q="${c.q}">${c.label}</button>`
  ).join('');

  appendMessage('assistant',
    `${greeting}! I am <strong>Candy</strong>, Pavan's personal AI assistant. What would you like to know?
    <div class="agent-chips">${chipsHTML}</div>`
  );
}

// ══════════════════════════════
// MAIN SEND
// ══════════════════════════════
async function handleSend(text) {
  stopListening();
  appendMessage('user', escapeHTML(text));
  chatHistory.push({ role: 'user', content: text });

  visitorSession.questions.push({
    time: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' }),
    message: text,
  });

  const count = visitorSession.questions.length;
  if (count % 3 === 0) sendVisitorReport();

  const typingId = appendTyping();

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory,
        ],
        max_tokens: 600,
        temperature: 0.85,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data  = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'I got an empty response. Please try again.';

    removeTyping(typingId);
    await typeMessage(formatReply(reply));
    autoScrollToSection(text);
    resetInactivityTimer();
    chatHistory.push({ role: 'assistant', content: reply });
    speak(reply);
    addSmartSuggestions(reply);
    if (!voiceEnabled) setCandyState('idle');

    if (chatHistory.length > 40) chatHistory = chatHistory.slice(-40);

  } catch (err) {
    removeTyping(typingId);
    appendMessage('error', `Something went wrong: ${escapeHTML(err.message)}`);
    console.error('[Candy]', err);
  }
}

// ══════════════════════════════
// EMAIL REPORT
// ══════════════════════════════
async function sendVisitorReport() {
  if (!emailJSReady || typeof emailjs === 'undefined') return;
  if (visitorSession.questions.length === 0) return;

  const questionLog = visitorSession.questions
    .map((q, i) => `${i + 1}. [${q.time}]  ${q.message}`)
    .join('\n');

  const fullChat = chatHistory
    .map(m => `${m.role === 'user' ? 'Visitor' : 'Candy'}: ${m.content}`)
    .join('\n\n');

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      time:         visitorSession.startTime,
      page:         visitorSession.pageUrl,
      questions:    questionLog,
      conversation: fullChat.slice(0, 3000),
      name:         'Portfolio Visitor',
      message:      questionLog,
    });
    console.log('[Candy] Visitor report emailed to Pavan');
  } catch (e) {
    console.warn('[Candy] Email report failed:', e);
  }
}

window.addEventListener('beforeunload', () => {
  if (visitorSession.questions.length > 0) sendVisitorReport();
});

// ══════════════════════════════
// DOM HELPERS
// ══════════════════════════════

// Mini planet avatar HTML helper
function miniAvatar() {
  return `<div class="agent-avatar-mini"><div class="pcore-mini">C</div></div>`;
}

function appendMessage(role, html) {
  const body = document.getElementById('agentMessages');
  const wrap = document.createElement('div');
  wrap.className = `agent-msg agent-msg--${role}`;

  const time = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });

  if (role === 'user') {
    wrap.innerHTML = `
      <div>
        <div class="agent-bubble agent-bubble--user">${html}</div>
        <div class="agent-timestamp agent-timestamp--user">${time}</div>
      </div>`;
  } else if (role === 'error') {
    wrap.innerHTML = `<div class="agent-bubble agent-bubble--error">${html}</div>`;
  } else {
    wrap.innerHTML = `
      ${miniAvatar()}
      <div>
        <div class="agent-bubble agent-bubble--assistant">${html}</div>
        <div class="agent-timestamp agent-timestamp--assistant">${time}</div>
      </div>`;
  }

  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
  return wrap;
}

function appendTyping() {
  const id   = 'typing-' + Date.now();
  const body = document.getElementById('agentMessages');
  const wrap = document.createElement('div');
  wrap.className = 'agent-msg agent-msg--assistant';
  wrap.id = id;
  wrap.innerHTML = `
    ${miniAvatar()}
    <div class="agent-bubble agent-bubble--assistant agent-typing">
      <span></span><span></span><span></span>
    </div>`;
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
  return id;
}

function removeTyping(id) { document.getElementById(id)?.remove(); }

function adjustTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatReply(text) {
  text = text.replace(/[\u{1F300}-\u{1FFFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '');
  return text
    .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
    .replace(/\*\*(.+?)\*\*/g,'<strong>$1</strong>')
    .replace(/\*(.+?)\*/g,'<em>$1</em>')
    .replace(/`([^`]+)`/g,'<code>$1</code>')
    .replace(/\n\n/g,'</p><p>')
    .replace(/\n/g,'<br>');
}

function showToast(msg) {
  const t = document.createElement('div');
  t.className = 'agent-toast';
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.classList.add('show'), 10);
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 2500);
}

// ══════════════════════════════
// TYPING SPEED EFFECT
// ══════════════════════════════
async function typeMessage(html) {
  const body = document.getElementById('agentMessages');
  const wrap = document.createElement('div');
  wrap.className = 'agent-msg agent-msg--assistant';

  const time = new Date().toLocaleTimeString('en-IN', {
    hour: '2-digit', minute: '2-digit',
    timeZone: 'Asia/Kolkata'
  });

  wrap.innerHTML = `
    ${miniAvatar()}
    <div>
      <div class="agent-bubble agent-bubble--assistant" id="typingBubble"></div>
      <div class="agent-timestamp agent-timestamp--assistant">${time}</div>
    </div>`;
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;

  const bubble = document.getElementById('typingBubble');
  bubble.removeAttribute('id');

  const plainText = html.replace(/<[^>]+>/g, '');
  const words     = plainText.split(' ');

  let displayed = '';
  for (let i = 0; i < words.length; i++) {
    displayed += (i === 0 ? '' : ' ') + words[i];
    bubble.textContent = displayed;
    body.scrollTop = body.scrollHeight;
    await new Promise(r => setTimeout(r, 65));
  }

  bubble.innerHTML = html;
  body.scrollTop = body.scrollHeight;
  return wrap;
}

// ══════════════════════════════
// SMART SUGGESTIONS
// ══════════════════════════════
function addSmartSuggestions(reply) {
  const body  = document.getElementById('agentMessages');
  const lower = reply.toLowerCase();
  let suggestions = [];

  if (lower.includes('project') || lower.includes('sparms') || lower.includes('inventoryiq')) {
    suggestions = [
      'Which project is most impressive?',
      'Does Pavan have any live projects?',
      'What tech stack does Pavan use?'
    ];
  } else if (lower.includes('skill') || lower.includes('python') || lower.includes('sql')) {
    suggestions = [
      "What is Pavan's strongest skill?",
      'Does Pavan know machine learning?',
      'What tools does Pavan use daily?'
    ];
  } else if (lower.includes('intern') || lower.includes('experience') || lower.includes('work')) {
    suggestions = [
      'What did Pavan do in his internship?',
      'Is Pavan open to new opportunities?',
      'How do I contact Pavan?'
    ];
  } else if (lower.includes('contact') || lower.includes('email') || lower.includes('hire')) {
    suggestions = [
      'What roles is Pavan looking for?',
      "Can I see Pavan's resume?",
      "What is Pavan's LinkedIn?"
    ];
  } else if (lower.includes('education') || lower.includes('mca') || lower.includes('degree')) {
    suggestions = [
      'What is Pavan studying?',
      'When does Pavan graduate?',
      'What projects has Pavan built?'
    ];
  } else {
    suggestions = [
      "Tell me about Pavan's projects",
      "What are Pavan's skills?",
      'How do I contact Pavan?'
    ];
  }

  const wrap = document.createElement('div');
  wrap.className = 'agent-smart-suggestions';
  wrap.innerHTML = suggestions.map(s =>
    `<button class="agent-chip" data-q="${s}">${s}</button>`
  ).join('');

  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;

  document.getElementById('agentForm').addEventListener('submit', () => {
    wrap.remove();
  }, { once: true });
}

// ══════════════════════════════
// AUTO SCROLL TO SECTION
// ══════════════════════════════
function autoScrollToSection(text) {
  const lower = text.toLowerCase();
  let sectionId = null;

  if (lower.includes('project') || lower.includes('sparms') ||
      lower.includes('inventoryiq') || lower.includes('digit') ||
      lower.includes('netflix') || lower.includes('zomato') ||
      lower.includes('attrition')) {
    sectionId = 'projects';
  } else if (lower.includes('skill') || lower.includes('python') ||
             lower.includes('sql') || lower.includes('power bi') ||
             lower.includes('tech stack')) {
    sectionId = 'skills';
  } else if (lower.includes('education') || lower.includes('mca') ||
             lower.includes('degree') || lower.includes('university')) {
    sectionId = 'education';
  } else if (lower.includes('experience') || lower.includes('intern') ||
             lower.includes('interncall')) {
    sectionId = 'experience';
  } else if (lower.includes('contact') || lower.includes('email') ||
             lower.includes('hire') || lower.includes('reach') ||
             lower.includes('whatsapp') || lower.includes('linkedin')) {
    sectionId = 'contact';
  }

  if (sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
      setTimeout(() => {
        const top = section.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: 'smooth' });
      }, 800);
    }
  }
}

// ══════════════════════════════
// INACTIVITY MESSAGE
// ══════════════════════════════
let inactivityTimer = null;
const INACTIVITY_MESSAGES = [
  'Still there? Feel free to ask me anything about Pavan!',
  'Not sure what to ask? Try "What projects has Pavan built?" or "How do I contact him?"',
  "I am here if you need anything. Ask me about Pavan's skills or experience!",
];

function resetInactivityTimer() {
  clearTimeout(inactivityTimer);
  const chatWindow = document.getElementById('agentChat');
  if (!chatWindow || !chatWindow.classList.contains('open')) return;

  inactivityTimer = setTimeout(() => {
    const randomMsg = INACTIVITY_MESSAGES[
      Math.floor(Math.random() * INACTIVITY_MESSAGES.length)
    ];
    appendMessage('assistant', randomMsg);
    addSmartSuggestions(randomMsg);
  }, 120000);
}

// ══════════════════════════════
// PROACTIVE BUBBLE
// ══════════════════════════════
function showProactiveBubble() {
  const chatWindow = document.getElementById('agentChat');
  if (chatWindow && chatWindow.classList.contains('open')) return;

  const existing = document.getElementById('agentProactiveBubble');
  if (existing) existing.remove();

  const bubble = document.createElement('div');
  bubble.id = 'agentProactiveBubble';
  bubble.className = 'agent-proactive';
  bubble.innerHTML = `
    <button class="agent-proactive-close" id="agentProactiveClose" title="Dismiss">x</button>
    <div class="agent-proactive-avatar">C</div>
    <div class="agent-proactive-body">
      <p class="agent-proactive-msg">Hi, I am <strong>Candy</strong>.</p>
      <p class="agent-proactive-sub">Want to know more about Pavan? I can help you connect with him.</p>
      <div class="agent-proactive-actions">
        <button class="agent-proactive-btn agent-proactive-btn--primary" id="agentProactiveChat">
          Chat with me
        </button>
        <a href="https://wa.me/918919944203" target="_blank" class="agent-proactive-btn agent-proactive-btn--whatsapp">
          WhatsApp
        </a>
        <a href="mailto:daroorpavankalyan@gmail.com" class="agent-proactive-btn agent-proactive-btn--email">
          Email
        </a>
      </div>
    </div>`;

  document.body.appendChild(bubble);
  setTimeout(() => bubble.classList.add('show'), 50);

  document.getElementById('agentProactiveChat').addEventListener('click', () => {
    bubble.classList.remove('show');
    setTimeout(() => bubble.remove(), 400);
    document.getElementById('agentToggle')?.click();
  });

  document.getElementById('agentProactiveClose').addEventListener('click', () => {
    bubble.classList.remove('show');
    setTimeout(() => bubble.remove(), 400);
  });

  setTimeout(() => {
    if (document.getElementById('agentProactiveBubble')) {
      bubble.classList.remove('show');
      setTimeout(() => bubble.remove(), 400);
    }
  }, 18000);
}

// ══════════════════════════════
// CANDY CHARACTER
// ══════════════════════════════
function buildCandyCharacter() {
  const el = document.createElement('div');
  el.className = 'candy-character idle';
  el.id = 'candyCharacter';
  el.innerHTML = `
  <svg viewBox="0 0 90 110" xmlns="http://www.w3.org/2000/svg">
    <ellipse cx="45" cy="107" rx="22" ry="4" fill="rgba(0,0,0,0.12)"/>
    <ellipse cx="45" cy="80" rx="22" ry="24" fill="#7dd3fc"/>
    <ellipse cx="45" cy="76" rx="12" ry="14" fill="rgba(255,255,255,0.18)"/>
    <ellipse cx="20" cy="78" rx="6" ry="10" fill="#7dd3fc" transform="rotate(-20 20 78)"/>
    <ellipse cx="70" cy="78" rx="6" ry="10" fill="#7dd3fc" transform="rotate(20 70 78)"/>
    <rect x="38" y="52" width="14" height="8" rx="4" fill="#93c5fd"/>
    <circle cx="45" cy="42" r="26" fill="#bfdbfe"/>
    <ellipse cx="36" cy="30" rx="8" ry="6" fill="rgba(255,255,255,0.35)" transform="rotate(-20 36 30)"/>
    <circle cx="19" cy="42" r="7" fill="#93c5fd"/>
    <circle cx="19" cy="42" r="4" fill="#bfdbfe"/>
    <circle cx="71" cy="42" r="7" fill="#93c5fd"/>
    <circle cx="71" cy="42" r="4" fill="#bfdbfe"/>
    <g id="candyEyes">
      <circle cx="36" cy="40" r="8" fill="white"/>
      <circle cx="54" cy="40" r="8" fill="white"/>
      <circle id="candyPupilL" cx="37" cy="41" r="4" fill="#1e3a5f"/>
      <circle id="candyPupilR" cx="55" cy="41" r="4" fill="#1e3a5f"/>
      <circle cx="38" cy="39" r="1.5" fill="white"/>
      <circle cx="56" cy="39" r="1.5" fill="white"/>
    </g>
    <g id="candyBlink" style="display:none">
      <rect x="28" y="37" width="16" height="6" rx="3" fill="#bfdbfe"/>
      <rect x="46" y="37" width="16" height="6" rx="3" fill="#bfdbfe"/>
    </g>
    <g id="mouthHappy">
      <path d="M36 52 Q45 60 54 52" stroke="#1e3a5f" stroke-width="2.5" fill="none" stroke-linecap="round"/>
    </g>
    <g id="mouthTalking" style="display:none">
      <ellipse cx="45" cy="54" rx="6" ry="4" fill="#1e3a5f"/>
    </g>
    <g id="mouthListening" style="display:none">
      <circle cx="45" cy="54" r="3" fill="none" stroke="#1e3a5f" stroke-width="2"/>
    </g>
    <ellipse cx="27" cy="50" rx="6" ry="4" fill="rgba(251,113,133,0.35)"/>
    <ellipse cx="63" cy="50" rx="6" ry="4" fill="rgba(251,113,133,0.35)"/>
    <line x1="45" y1="16" x2="45" y2="4" stroke="#93c5fd" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="45" cy="3" r="4" fill="#fbbf24"/>
    <circle cx="45" cy="3" r="2" fill="#fff"/>
  </svg>`;

  document.body.appendChild(el);
  startCandyBlink();
  startCandyEyeFollow();
}

function startCandyBlink() {
  function doBlink() {
    const blink = document.getElementById('candyBlink');
    const eyes  = document.getElementById('candyEyes');
    if (!blink || !eyes) return;
    blink.style.display = 'block';
    eyes.style.display  = 'none';
    setTimeout(() => {
      blink.style.display = 'none';
      eyes.style.display  = 'block';
    }, 120);
    setTimeout(doBlink, 3000 + Math.random() * 2000);
  }
  setTimeout(doBlink, 2000);
}

function startCandyEyeFollow() {
  document.addEventListener('mousemove', e => {
    const char = document.getElementById('candyCharacter');
    const pl   = document.getElementById('candyPupilL');
    const pr   = document.getElementById('candyPupilR');
    if (!char || !pl || !pr) return;

    const rect = char.getBoundingClientRect();
    const cx   = rect.left + rect.width / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / window.innerWidth;
    const dy   = (e.clientY - cy) / window.innerHeight;
    const mx   = dx * 2.5;
    const my   = dy * 2.5;

    pl.setAttribute('cx', 37 + mx);
    pl.setAttribute('cy', 41 + my);
    pr.setAttribute('cx', 55 + mx);
    pr.setAttribute('cy', 41 + my);
  });
}

function setCandyState(state) {
  const char = document.getElementById('candyCharacter');
  const mH   = document.getElementById('mouthHappy');
  const mT   = document.getElementById('mouthTalking');
  const mL   = document.getElementById('mouthListening');
  if (!char) return;

  char.classList.remove('idle', 'talking', 'listening-anim');

  if (state === 'talking') {
    char.classList.add('talking');
    if (mH) mH.style.display = 'none';
    if (mT) mT.style.display = 'block';
    if (mL) mL.style.display = 'none';
  } else if (state === 'listening') {
    char.classList.add('listening-anim');
    if (mH) mH.style.display = 'none';
    if (mT) mT.style.display = 'none';
    if (mL) mL.style.display = 'block';
  } else {
    char.classList.add('idle');
    if (mH) mH.style.display = 'block';
    if (mT) mT.style.display = 'none';
    if (mL) mL.style.display = 'none';
  }
}

function showCandyCharacter(show) {
  const char = document.getElementById('candyCharacter');
  if (!char) return;
  if (show) char.classList.add('visible');
  else      char.classList.remove('visible');
}

// ══════════════════════════════
// BUILD HTML
// ══════════════════════════════
function buildAgentHTML() {
  const html = `
  <div id="agentChat" class="agent-window">
    <div class="agent-header">
      <div class="agent-header-left">

        <!-- ── Planet Avatar ── -->
        <div class="agent-header-avatar">
          <div class="planet-scene">
            <div class="ppulse pp1"></div>
            <div class="ppulse pp2"></div>
            <div class="ppulse pp3"></div>
            <div class="phalo"></div>
            <div class="oring or1"></div>
            <div class="oring or2"></div>
            <div class="oring or3"></div>
            <div class="pcore">
              <span class="pcore-letter">C</span>
            </div>
          </div>
        </div>

        <div>
          <div class="agent-header-name">Candy <span class="agent-header-tag">AI</span></div>
          <div class="agent-header-status">
            <span class="agent-online-dot"></span>Online · Pavan's AI
          </div>
        </div>
      </div>
      <div class="agent-header-actions">

        <!-- Voice / Text toggle pill -->
        <div id="agentModeToggle" class="agent-mode-toggle voice-mode" title="Switch between voice and text mode">
          <span class="agent-mode-icon agent-mode-icon--voice">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
            </svg>
          </span>
          <span class="agent-mode-icon agent-mode-icon--text">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="17" y1="10" x2="3" y2="10"/>
              <line x1="21" y1="6" x2="3" y2="6"/>
              <line x1="21" y1="14" x2="3" y2="14"/>
              <line x1="17" y1="18" x2="3" y2="18"/>
            </svg>
          </span>
          <span class="agent-mode-label" id="agentModeLabel">Voice</span>
        </div>

        <button id="agentClear" class="agent-icon-btn" title="Clear chat">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3.3"/>
          </svg>
        </button>
        <button id="agentClose" class="agent-icon-btn" title="Close">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="agent-messages" id="agentMessages"></div>

    <form class="agent-input-row" id="agentForm">
      <div class="agent-input-wrap">
        <button type="button" id="agentMic" class="agent-mic-btn" title="Click to speak">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </button>
        <textarea
          id="agentInput"
          class="agent-input"
          placeholder="Ask me about Pavan..."
          rows="1"
          maxlength="500"
        ></textarea>
      </div>
      <button type="submit" id="agentSend" class="agent-send-btn" aria-label="Send">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </form>
  </div>

  <button id="agentToggle" class="agent-toggle" aria-label="Chat with Candy">
    <span class="agent-toggle-icon">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </span>
    <span class="agent-toggle-label">Ask Candy</span>
    <span class="agent-toggle-ping"></span>
  </button>`;

  document.body.insertAdjacentHTML('beforeend', html);
}
