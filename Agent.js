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
- Location: Andhra Pradesh, India
- Email: daroorpavankalyan@gmail.com
- LinkedIn: linkedin.com/in/daroor-pavan-kalyan-370277253/
- GitHub: github.com/kalyan-91
- WhatsApp: +91 89199 44203
- Open to: internships and entry-level roles in Data Analytics and Data Science

Education:
- MCA — JNTUA, Anantapur (2025 to 2027, currently pursuing). Focus: Data Analytics, Database Management, Business Intelligence
- BSc MSCS (Maths, Stats, Computer Science) — Rayalaseema University, Kurnool (2021 to 2024, completed)

Internship:
- Data Science Intern at Interncall, Kurnool (Jan to Apr 2024)
- Built ML models with 85 percent or higher accuracy
- Created business visualizations, did EDA on datasets with over 100K records
- Automated data cleaning reducing manual work by 60 percent
- Stack: Python, Pandas, Scikit-learn, Matplotlib, Seaborn

Skills:
- SQL 90%, Excel 88%, Python 85%, Java 70%
- Power BI 85%, Matplotlib and Seaborn 80%, Plotly 75%
- Pandas 85%, NumPy 80%, Scikit-learn 75%, TensorFlow 70%
- HTML 85%, CSS 80%, JavaScript 70%
- Tools: Streamlit, OpenCV, JDBC, Maven, iText PDF, ZXing

Projects:
1. SPARMS — Java Swing desktop app for academic result management. Role-based dashboards for Admin, Faculty, and Students. Features OMR scanning, automated grade computation, MySQL with JDBC, and PDF export. Stack: Java Swing, MySQL, JDBC, Maven, iText, ZXing.

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

== RESPONSE RULES ==
- Never use emojis anywhere in your replies.
- Never start every message the same way. Vary your openers.
- Do not always list everything. Pick what is most relevant to the question.
- If asked about a project with a live link, always share it.
- For contact questions, share email and LinkedIn.
- Keep responses under 5 sentences unless the person clearly wants detail.
- Never say "As an AI language model". Just answer naturally.
- After 2 to 3 messages from the visitor, naturally ask for their name and email so Pavan can follow up. Do it conversationally, not like a form. For example: "By the way, I would love to let Pavan know you stopped by. What is your name? And if you want him to reach out, share your email too." Then acknowledge when they share it warmly.
- If you do not know something about Pavan that is not covered above, say so honestly and suggest reaching out directly.`;

// ── State ──
let chatHistory  = [];
let isListening  = false;
let isSpeaking   = false;
let recognition  = null;
let currentUtter = null;
let voiceEnabled = true;   // voice ON by default
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

  // Open / close
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.toggle('open');
    toggleBtn.classList.toggle('active', isOpen);
    if (isOpen) {
      input.focus();
      if (chatHistory.length === 0) appendWelcome();
    } else {
      stopSpeaking();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    toggleBtn.classList.remove('active');
    stopSpeaking();
    stopListening();
  });

  clearBtn.addEventListener('click', () => {
    chatHistory = [];
    document.getElementById('agentMessages').innerHTML = '';
    stopSpeaking();
    appendWelcome();
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
    // Set initial state
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
}

function updateModeUI() {
  const modeToggle  = document.getElementById('agentModeToggle');
  const modeLabel   = document.getElementById('agentModeLabel');
  const micBtn      = document.getElementById('agentMic');
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
  recognition.continuous    = false;
  recognition.interimResults = true;
  recognition.lang          = 'en-IN';

  recognition.onstart  = () => { isListening = true;  updateMicUI(true);  };
  recognition.onend    = () => { isListening = false; updateMicUI(false); };
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
  currentUtter         = new SpeechSynthesisUtterance(clean);
  currentUtter.lang    = 'en-US';
  currentUtter.rate    = 1.0;
  currentUtter.pitch   = 1.0;
  currentUtter.volume  = 1.0;

  const preferred =
    voices.find(v => v.name.includes('Google US English')) ||
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.lang === 'en-US' && !v.localService) ||
    voices.find(v => v.lang.startsWith('en-'));
  if (preferred) currentUtter.voice = preferred;

  currentUtter.onstart = () => { isSpeaking = true;  updateSpeakUI(true);  };
  currentUtter.onend   = () => { isSpeaking = false; updateSpeakUI(false); };
  currentUtter.onerror = () => { isSpeaking = false; updateSpeakUI(false); };

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
  const chips = [
    { label: 'Projects',   q: 'What projects has Pavan built?' },
    { label: 'Skills',     q: 'What are Pavan\'s strongest skills?' },
    { label: 'Experience', q: 'Tell me about Pavan\'s internship experience' },
    { label: 'Contact',    q: 'I am interested in hiring Pavan, how do I reach him?' },
  ];
  const chipsHTML = chips.map(c =>
    `<button class="agent-chip" data-q="${c.q}">${c.label}</button>`
  ).join('');

  appendMessage('assistant',
    `Hi, I am <strong>Candy</strong>, Pavan's personal AI assistant. What would you like to know?
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
    appendMessage('assistant', formatReply(reply));
    chatHistory.push({ role: 'assistant', content: reply });
    speak(reply);

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
function appendMessage(role, html) {
  const body = document.getElementById('agentMessages');
  const wrap = document.createElement('div');
  wrap.className = `agent-msg agent-msg--${role}`;

  if (role === 'user') {
    wrap.innerHTML = `<div class="agent-bubble agent-bubble--user">${html}</div>`;
  } else if (role === 'error') {
    wrap.innerHTML = `<div class="agent-bubble agent-bubble--error">${html}</div>`;
  } else {
    wrap.innerHTML = `
      <div class="agent-avatar"><span>C</span></div>
      <div class="agent-bubble agent-bubble--assistant">${html}</div>`;
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
    <div class="agent-avatar"><span>C</span></div>
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
  // Strip emojis from AI reply
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
// BUILD HTML
// ══════════════════════════════
function buildAgentHTML() {
  const html = `
  <div id="agentChat" class="agent-window">
    <div class="agent-header">
      <div class="agent-header-left">
        <div class="agent-header-avatar">C</div>
        <div>
          <div class="agent-header-name">Candy</div>
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
