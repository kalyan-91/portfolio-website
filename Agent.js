/* ═══════════════════════════════════════════════════
   PAVAN KALYAN PORTFOLIO — agent.js
   Groq-powered AI Chat Agent (via Cloudflare Worker proxy)
═══════════════════════════════════════════════════ */

'use strict';

const GROQ_MODEL    = 'llama3-8b-8192';
const GROQ_ENDPOINT = 'https://pk-groq-proxy.daroorpavankalyan.workers.dev';

// ── System prompt: everything about Pavan ──
const SYSTEM_PROMPT = `You are PK·AI, a friendly and knowledgeable personal AI assistant embedded in Pavan Kalyan's portfolio website. Your role is to help visitors learn about Pavan and his work.

About Pavan Kalyan:
- Full name: D. Pavan Kalyan
- Role: MCA Student & Data Analytics Aspirant
- Location: Andhra Pradesh, India
- Email: daroorpavankalyan@gmail.com
- LinkedIn: linkedin.com/in/daroor-pavan-kalyan-370277253/
- GitHub: github.com/kalyan-91
- WhatsApp: +91 89199 44203

Education:
- MCA (Master of Computer Applications) — JNTUA, Anantapur (2025–2027, currently pursuing)
  Focus: Data Analytics, Database Management, Business Intelligence
- BSc (MSCS — Mathematics, Statistics & Computer Science) — Rayalaseema University, Kurnool (2021–2024, completed)

Experience:
- Data Science Intern at Interncall, Kurnool (Jan 2024 – Apr 2024)
  • Developed ML models with 85%+ accuracy
  • Created interactive visualizations for business stakeholders
  • Performed EDA on 100K+ record datasets
  • Automated data cleaning reducing manual work by 60%
  Skills used: Python, Pandas, Scikit-learn, Matplotlib, Seaborn, EDA

Skills:
- Programming & Data: SQL (90%), Python (85%), Excel (88%), Java (70%)
- Visualization: Power BI (85%), Matplotlib (80%), Seaborn (80%), Plotly (75%)
- Machine Learning: Scikit-learn (75%), TensorFlow (70%), Pandas (85%), NumPy (80%)
- Web: HTML (85%), CSS (80%), JavaScript (70%)
- Other tools: Streamlit, OpenCV, ZXing, iText PDF, Maven, JDBC

Projects:
1. SPARMS (Student Performance Analysis & Result Management System)
   - Java Swing desktop app with role-based dashboards (Admin, Faculty, Student)
   - Features: automated grade computation, OMR scanning, MySQL + JDBC, PDF export
   - Tech: Java Swing, MySQL, JDBC, Maven, iText PDF, ZXing

2. InventoryIQ — E-commerce Inventory & Analytics System
   - Streamlit-based dashboard with secure login, product management, audit logs, CSV export
   - Live: inventoryiq-e-commerce-inventory-analytics-system-lqpsn7qy8hhd.streamlit.app
   - Tech: Python, Streamlit, Pandas, Plotly
   - GitHub: github.com/kalyan-91/InventoryIQ-E-commerce-Inventory-Analytics-System

3. Digit Recognizer — Handwritten Digit Recognition
   - CNN model recognizing digits 0–9 with interactive canvas
   - Live: hand-written-digit-recognition-xp9dvpheswt6zju8xpknxn.streamlit.app
   - Tech: Python, TensorFlow, Streamlit, OpenCV
   - GitHub: github.com/kalyan-91/Hand-Written-Digit-Recognition

4. Netflix Dashboard — Power BI Analytics
   - Explores 5000+ Netflix titles, trends in genres, durations, countries
   - Tech: Power BI, DAX, Power Query, Data Modeling
   - GitHub: github.com/kalyan-91/Netflix-PowerBI-Dashboard

5. Employee Attrition Analysis
   - Classification models to predict attrition + Power BI dashboard
   - Tech: Python, Scikit-learn, Power BI, Pandas
   - GitHub: github.com/kalyan-91/EmployeeAttritionAndEngagementAnalysis

6. Zomato Restaurant Analysis & Predictive Analysis
   - Patterns affecting ratings; classification models for restaurant types
   - Tech: Python, Pandas, Scikit-learn, Excel
   - GitHub: github.com/kalyan-91/Zomato_Restaurant_Analysis_And_Predictive_Analysis

Availability: Open to internships and entry-level roles in Data Analytics, Data Science, and related fields.

Guidelines for your responses:
- Be concise, friendly, and professional. Max 3–4 sentences per reply unless asked for detail.
- When visitors ask about contacting Pavan, share his email or LinkedIn.
- When they ask about a project, mention the live link if available.
- If you don't know something specific about Pavan, say so honestly and suggest they reach out directly.
- Never make up information. Stick to what's provided above.
- You can discuss general data science / ML / Python topics briefly if asked.`;

// ── Conversation history (in-memory) ──
let chatHistory = [];

// ── DOM Ready ──
document.addEventListener('DOMContentLoaded', initAgent);

function initAgent() {
  buildAgentHTML();

  const toggleBtn  = document.getElementById('agentToggle');
  const closeBtn   = document.getElementById('agentClose');
  const clearBtn   = document.getElementById('agentClear');
  const chatWindow = document.getElementById('agentChat');
  const input      = document.getElementById('agentInput');
  const form       = document.getElementById('agentForm');

  if (!toggleBtn || !chatWindow) return;

  // Open / close
  toggleBtn.addEventListener('click', () => {
    const isOpen = chatWindow.classList.toggle('open');
    toggleBtn.classList.toggle('active', isOpen);
    if (isOpen) {
      input.focus();
      if (chatHistory.length === 0) appendWelcome();
    }
  });

  closeBtn.addEventListener('click', () => {
    chatWindow.classList.remove('open');
    toggleBtn.classList.remove('active');
  });

  // Clear chat
  clearBtn.addEventListener('click', () => {
    chatHistory = [];
    document.getElementById('agentMessages').innerHTML = '';
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

  // Enter to send (Shift+Enter = newline)
  input.addEventListener('keydown', e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.dispatchEvent(new Event('submit'));
    }
  });

  input.addEventListener('input', () => adjustTextarea(input));

  // Quick-chip clicks
  document.getElementById('agentMessages').addEventListener('click', e => {
    const chip = e.target.closest('.agent-chip');
    if (chip) {
      input.value = chip.dataset.q;
      form.dispatchEvent(new Event('submit'));
    }
  });
}

// ── Welcome message ──
function appendWelcome() {
  const chips = [
    { label: '📁 Projects',   q: "Tell me about Pavan's projects" },
    { label: '🛠 Skills',     q: "What are Pavan's top skills?" },
    { label: '💼 Experience', q: "Tell me about Pavan's internship" },
    { label: '📬 Contact',    q: 'How can I contact Pavan?' },
  ];

  const chipsHTML = chips.map(c =>
    `<button class="agent-chip" data-q="${c.q}">${c.label}</button>`
  ).join('');

  appendMessage('assistant',
    `Hey there! 👋 I'm <strong>PK·AI</strong>, Pavan's personal AI assistant.<br>
     Ask me anything about his skills, projects, or experience!
     <div class="agent-chips">${chipsHTML}</div>`
  );
}

// ── Main send handler ──
async function handleSend(text) {
  appendMessage('user', escapeHTML(text));
  chatHistory.push({ role: 'user', content: text });

  const typingId = appendTyping();

  try {
    const response = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header — key is stored securely in Cloudflare Worker
      },
      body: JSON.stringify({
        model: GROQ_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          ...chatHistory,
        ],
        max_tokens: 512,
        temperature: 0.7,
        stream: false,
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err?.error?.message || `HTTP ${response.status}`);
    }

    const data  = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim() || 'Sorry, I got an empty response.';

    removeTyping(typingId);
    appendMessage('assistant', formatReply(reply));
    chatHistory.push({ role: 'assistant', content: reply });

    // Keep history manageable (last 40 messages = 20 turns)
    if (chatHistory.length > 40) chatHistory = chatHistory.slice(-40);

  } catch (err) {
    removeTyping(typingId);
    appendMessage('error', `⚠️ Something went wrong: ${escapeHTML(err.message)}`);
    console.error('[PK·AI]', err);
  }
}

// ── DOM helpers ──
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
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function formatReply(text) {
  return text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\n/g, '<br>');
}

// ── Inject widget HTML into page ──
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
      <textarea
        id="agentInput"
        class="agent-input"
        placeholder="Ask me about Pavan…"
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
