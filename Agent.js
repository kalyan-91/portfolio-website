/* ═══════════════════════════════════════════════════
   PAVAN KALYAN PORTFOLIO — Agent.js
   Groq AI Chat + Voice Assistant
═══════════════════════════════════════════════════ */

'use strict';

const GROQ_MODEL    = 'llama-3.3-70b-versatile';
const GROQ_ENDPOINT = 'https://pk-groq-proxy.daroorpavankalyan.workers.dev';

// ── System prompt: dynamic, conversational ──
const SYSTEM_PROMPT = `You are PK·AI — a sharp, witty, and genuinely helpful AI assistant living inside Pavan Kalyan's portfolio. You have a personality: curious, friendly, slightly playful, and professionally confident. You are NOT a boring FAQ bot.

Your job is to help visitors learn about Pavan — but do it like a real conversation, not a bullet-point dump. Be natural. Ask follow-up questions when relevant. Show enthusiasm about his work. Use light humor when appropriate. Vary your response style — sometimes short and punchy, sometimes more detailed when the topic deserves it.

You can make your own decisions about how to respond. If someone says "hi" just say hi back warmly — don't dump his entire resume at them. If someone asks something vague, ask what they mean. If someone seems like a recruiter, be a little more professional. If they seem like a fellow student, be casual and relatable.

== FACTS ABOUT PAVAN (use these accurately, never make up extra) ==

Personal:
- Full name: D. Pavan Kalyan
- Role: MCA Student & Data Analytics Aspirant
- Location: Andhra Pradesh, India
- Email: daroorpavankalyan@gmail.com
- LinkedIn: linkedin.com/in/daroor-pavan-kalyan-370277253/
- GitHub: github.com/kalyan-91
- WhatsApp: +91 89199 44203
- Open to: internships and entry-level roles in Data Analytics / Data Science

Education:
- MCA — JNTUA, Anantapur (2025–2027, currently pursuing). Focus: Data Analytics, Database Management, Business Intelligence
- BSc MSCS (Maths, Stats, Computer Science) — Rayalaseema University, Kurnool (2021–2024, completed)

Internship:
- Data Science Intern @ Interncall, Kurnool (Jan–Apr 2024)
- Built ML models with 85%+ accuracy
- Created business visualizations, did EDA on 100K+ record datasets
- Automated data cleaning → 60% less manual work
- Stack: Python, Pandas, Scikit-learn, Matplotlib, Seaborn

Skills:
- SQL 90%, Excel 88%, Python 85%, Java 70%
- Power BI 85%, Matplotlib/Seaborn 80%, Plotly 75%
- Pandas 85%, NumPy 80%, Scikit-learn 75%, TensorFlow 70%
- HTML 85%, CSS 80%, JS 70%
- Tools: Streamlit, OpenCV, JDBC, Maven, iText PDF, ZXing

Projects:
1. SPARMS — Java Swing desktop app for academic result management. Role-based dashboards (Admin/Faculty/Student), OMR scanning, automated grades, MySQL+JDBC, PDF export. Stack: Java Swing, MySQL, JDBC, Maven, iText, ZXing.

2. InventoryIQ — Streamlit inventory + analytics dashboard. Secure login, product management, audit logs, CSV export.
   Live: inventoryiq-e-commerce-inventory-analytics-system-lqpsn7qy8hhd.streamlit.app
   GitHub: github.com/kalyan-91/InventoryIQ-E-commerce-Inventory-Analytics-System
   Stack: Python, Streamlit, Pandas, Plotly

3. Digit Recognizer — CNN app that recognizes handwritten digits 0–9 on an interactive canvas.
   Live: hand-written-digit-recognition-xp9dvpheswt6zju8xpknxn.streamlit.app
   GitHub: github.com/kalyan-91/Hand-Written-Digit-Recognition
   Stack: Python, TensorFlow, Streamlit, OpenCV

4. Netflix Dashboard — Power BI dashboard exploring 5000+ titles, genres, durations, countries.
   GitHub: github.com/kalyan-91/Netflix-PowerBI-Dashboard
   Stack: Power BI, DAX, Power Query

5. Employee Attrition Analysis — ML classification models + Power BI dashboard for HR analytics.
   GitHub: github.com/kalyan-91/EmployeeAttritionAndEngagementAnalysis
   Stack: Python, Scikit-learn, Power BI, Pandas

6. Zomato Analysis — Restaurant rating patterns + predictive classification models.
   GitHub: github.com/kalyan-91/Zomato_Restaurant_Analysis_And_Predictive_Analysis
   Stack: Python, Pandas, Scikit-learn, Excel

== RESPONSE STYLE RULES ==
- Never start every message the same way. Vary your openers.
- Don't always list everything — pick what's most relevant to the question.
- If asked about a project with a live link, always share it.
- For contact questions, share email + LinkedIn.
- Keep responses under 5 sentences unless the person clearly wants detail.
- If someone asks your opinion (e.g. "is Pavan good?"), give a genuine, confident answer.
- Never say "As an AI language model" — just answer naturally.
- If you don't know something about Pavan not covered above, say so and suggest reaching out directly.`;

// ── State ──
let chatHistory  = [];
let isListening  = false;
let isSpeaking   = false;
let recognition  = null;
let currentUtter = null;
let voiceEnabled = true;   // speak by default
let voicesLoaded = false;
let pendingSpeak = null;   // queued text if voices not ready yet

// Pre-load voices as early as possible
if (window.speechSynthesis) {
  window.speechSynthesis.getVoices(); // trigger load
  window.speechSynthesis.addEventListener('voiceschanged', () => {
    voicesLoaded = true;
    if (pendingSpeak) {
      speak(pendingSpeak);
      pendingSpeak = null;
    }
  });
}

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', initAgent);

// ── Proactive message — fires after 8s if chat is still closed ──
let proactiveSent = false;
setTimeout(() => {
  if (!proactiveSent) {
    proactiveSent = true;
    showProactiveBubble();
  }
}, 8000);

function initAgent() {
  buildAgentHTML();

  const toggleBtn  = document.getElementById('agentToggle');
  const closeBtn   = document.getElementById('agentClose');
  const clearBtn   = document.getElementById('agentClear');
  const chatWindow = document.getElementById('agentChat');
  const input      = document.getElementById('agentInput');
  const form       = document.getElementById('agentForm');
  const micBtn     = document.getElementById('agentMic');
  const voiceBtn   = document.getElementById('agentVoiceToggle');

  if (!toggleBtn || !chatWindow) return;

  // Setup speech recognition
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

  // Mic button — voice input
  if (micBtn) {
    micBtn.addEventListener('click', () => {
      if (isListening) stopListening();
      else startListening();
    });
  }

  // Voice output toggle — ON by default
  if (voiceBtn) {
    voiceBtn.classList.add('active'); // show as ON from the start
    voiceBtn.title = 'Voice output ON (click to mute)';
    voiceBtn.addEventListener('click', () => {
      voiceEnabled = !voiceEnabled;
      voiceBtn.classList.toggle('active', voiceEnabled);
      voiceBtn.title = voiceEnabled ? 'Voice output ON (click to mute)' : 'Voice output OFF (click to enable)';
      if (!voiceEnabled) stopSpeaking();
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

// ══════════════════════════════
// SPEECH RECOGNITION (voice input)
// ══════════════════════════════
function setupRecognition() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) return;

  recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = true;
  recognition.lang = 'en-IN';

  recognition.onstart = () => {
    isListening = true;
    updateMicUI(true);
  };

  recognition.onresult = e => {
    const transcript = Array.from(e.results)
      .map(r => r[0].transcript)
      .join('');
    document.getElementById('agentInput').value = transcript;
    adjustTextarea(document.getElementById('agentInput'));

    // Auto-send on final result
    if (e.results[e.results.length - 1].isFinal) {
      setTimeout(() => {
        document.getElementById('agentForm').dispatchEvent(new Event('submit'));
      }, 400);
    }
  };

  recognition.onerror = e => {
    console.warn('[PK·AI Voice]', e.error);
    stopListening();
    if (e.error === 'not-allowed') {
      showToast('Microphone access denied');
    }
  };

  recognition.onend = () => {
    isListening = false;
    updateMicUI(false);
  };
}

function startListening() {
  if (!recognition) {
    showToast('Voice input not supported in this browser');
    return;
  }
  stopSpeaking();
  try {
    recognition.start();
  } catch(e) {
    console.warn(e);
  }
}

function stopListening() {
  if (recognition && isListening) {
    recognition.stop();
  }
  isListening = false;
  updateMicUI(false);
}

function updateMicUI(active) {
  const micBtn = document.getElementById('agentMic');
  if (!micBtn) return;
  micBtn.classList.toggle('listening', active);
  micBtn.title = active ? 'Listening… (click to stop)' : 'Click to speak';
}

// ══════════════════════════════
// SPEECH SYNTHESIS (voice output)
// ══════════════════════════════
function speak(text) {
  if (!voiceEnabled || !window.speechSynthesis) return;

  // Strip HTML tags for clean speech
  const clean = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  if (!clean) return;

  // If voices aren't loaded yet, queue and wait
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) {
    pendingSpeak = text;
    return;
  }

  stopSpeaking();

  currentUtter = new SpeechSynthesisUtterance(clean);
  currentUtter.lang  = 'en-US';
  currentUtter.rate  = 1.0;
  currentUtter.pitch = 1.0;
  currentUtter.volume = 1.0;

  // Pick the best available English voice
  const preferred =
    voices.find(v => v.name.includes('Google US English')) ||
    voices.find(v => v.name.includes('Google UK English Female')) ||
    voices.find(v => v.lang === 'en-US' && !v.localService) ||
    voices.find(v => v.lang.startsWith('en-'));
  if (preferred) currentUtter.voice = preferred;

  currentUtter.onstart = () => { isSpeaking = true;  updateSpeakUI(true);  };
  currentUtter.onend   = () => { isSpeaking = false; updateSpeakUI(false); };
  currentUtter.onerror = (e) => {
    isSpeaking = false;
    updateSpeakUI(false);
    console.warn('[PK·AI speak error]', e.error);
  };

  // Small delay fixes Chrome autoplay block after page load
  setTimeout(() => {
    window.speechSynthesis.speak(currentUtter);
  }, 100);
}

function stopSpeaking() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  isSpeaking = false;
  updateSpeakUI(false);
}

function updateSpeakUI(active) {
  const voiceBtn = document.getElementById('agentVoiceToggle');
  if (voiceBtn) voiceBtn.classList.toggle('speaking', active);
}

// ══════════════════════════════
// WELCOME
// ══════════════════════════════
function appendWelcome() {
  const chips = [
    { label: '📁 Projects',   q: "What projects has Pavan built?" },
    { label: '🛠 Skills',     q: "What are Pavan's strongest skills?" },
    { label: '💼 Experience', q: "Tell me about Pavan's internship experience" },
    { label: '📬 Hire him',   q: "I'm interested in hiring Pavan, how do I reach him?" },
  ];

  const chipsHTML = chips.map(c =>
    `<button class="agent-chip" data-q="${c.q}">${c.label}</button>`
  ).join('');

  appendMessage('assistant',
    `Hey! 👋 I'm <strong>PK·AI</strong> — Pavan's personal AI.<br>
    What would you like to know?
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
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Hmm, I got an empty response. Try again?';

    removeTyping(typingId);
    appendMessage('assistant', formatReply(reply));
    chatHistory.push({ role: 'assistant', content: reply });

    // Speak the reply if voice output is on
    speak(reply);

    if (chatHistory.length > 40) chatHistory = chatHistory.slice(-40);

  } catch (err) {
    removeTyping(typingId);
    appendMessage('error', `⚠️ ${escapeHTML(err.message)}`);
    console.error('[PK·AI]', err);
  }
}

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
      <div class="agent-avatar"><span>PK</span></div>
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
    <div class="agent-avatar"><span>PK</span></div>
    <div class="agent-bubble agent-bubble--assistant agent-typing">
      <span></span><span></span><span></span>
    </div>`;
  body.appendChild(wrap);
  body.scrollTop = body.scrollHeight;
  return id;
}

function removeTyping(id) {
  document.getElementById(id)?.remove();
}

function adjustTextarea(el) {
  el.style.height = 'auto';
  el.style.height = Math.min(el.scrollHeight, 120) + 'px';
}

function escapeHTML(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function formatReply(text) {
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
  setTimeout(() => { t.classList.remove('show'); setTimeout(() => t.remove(), 400); }, 3000);
}

// ══════════════════════════════
// PROACTIVE BUBBLE
// ══════════════════════════════
function showProactiveBubble() {
  // Don't show if chat is already open
  const chatWindow = document.getElementById('agentChat');
  if (chatWindow && chatWindow.classList.contains('open')) return;

  // Remove existing bubble if any
  const existing = document.getElementById('agentProactiveBubble');
  if (existing) existing.remove();

  const bubble = document.createElement('div');
  bubble.id = 'agentProactiveBubble';
  bubble.className = 'agent-proactive';
  bubble.innerHTML = `
    <button class="agent-proactive-close" id="agentProactiveClose" title="Dismiss">×</button>
    <div class="agent-proactive-avatar">PK</div>
    <div class="agent-proactive-body">
      <p class="agent-proactive-msg">👋 Hi there! I'm <strong>PK·AI</strong>.</p>
      <p class="agent-proactive-sub">Want to know more about Pavan? I can help you connect with him!</p>
      <div class="agent-proactive-actions">
        <button class="agent-proactive-btn agent-proactive-btn--primary" id="agentProactiveChat">
          💬 Chat with me
        </button>
        <a href="https://wa.me/918919944203" target="_blank" class="agent-proactive-btn agent-proactive-btn--whatsapp">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
          WhatsApp
        </a>
        <a href="mailto:daroorpavankalyan@gmail.com" class="agent-proactive-btn agent-proactive-btn--email">
          ✉️ Email
        </a>
      </div>
    </div>
  `;

  document.body.appendChild(bubble);

  // Animate in
  setTimeout(() => bubble.classList.add('show'), 50);

  // Open chat on "Chat with me"
  document.getElementById('agentProactiveChat').addEventListener('click', () => {
    bubble.classList.remove('show');
    setTimeout(() => bubble.remove(), 400);
    const toggle = document.getElementById('agentToggle');
    if (toggle) toggle.click();
  });

  // Dismiss button
  document.getElementById('agentProactiveClose').addEventListener('click', () => {
    bubble.classList.remove('show');
    setTimeout(() => bubble.remove(), 400);
  });

  // Auto dismiss after 18 seconds
  setTimeout(() => {
    if (document.getElementById('agentProactiveBubble')) {
      bubble.classList.remove('show');
      setTimeout(() => bubble.remove(), 400);
    }
  }, 18000);
}
function buildAgentHTML() {
  const html = `
  <div id="agentChat" class="agent-window">
    <div class="agent-header">
      <div class="agent-header-left">
        <div class="agent-header-avatar">PK</div>
        <div>
          <div class="agent-header-name">PK·AI</div>
          <div class="agent-header-status">
            <span class="agent-online-dot"></span>Online · Groq powered
          </div>
        </div>
      </div>
      <div class="agent-header-actions">
        <button id="agentVoiceToggle" class="agent-icon-btn" title="Voice output OFF (click to enable)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
          </svg>
        </button>
        <button id="agentClear" class="agent-icon-btn" title="Clear chat">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 1 0 .49-3.3"/>
          </svg>
        </button>
        <button id="agentClose" class="agent-icon-btn" title="Close">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>

    <div class="agent-messages" id="agentMessages"></div>

    <form class="agent-input-row" id="agentForm">
      <button type="button" id="agentMic" class="agent-mic-btn" title="Click to speak">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
          <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
          <line x1="12" y1="19" x2="12" y2="23"/>
          <line x1="8" y1="23" x2="16" y2="23"/>
        </svg>
      </button>
      <textarea
        id="agentInput"
        class="agent-input"
        placeholder="Ask me about Pavan… or speak 🎤"
        rows="1"
        maxlength="500"
      ></textarea>
      <button type="submit" id="agentSend" class="agent-send-btn" aria-label="Send">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </form>
  </div>

  <button id="agentToggle" class="agent-toggle" aria-label="Chat with PK·AI">
    <span class="agent-toggle-icon">
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    </span>
    <span class="agent-toggle-label">Ask PK·AI</span>
    <span class="agent-toggle-ping"></span>
  </button>`;

  document.body.insertAdjacentHTML('beforeend', html);
}
