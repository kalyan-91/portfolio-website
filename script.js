/* ═══════════════════════════════════════════════════
   PAVAN KALYAN PORTFOLIO — script.js
   Features: Custom cursor, particles, scroll reveals,
   skill tabs, role cycler, navbar, magnetic buttons,
   video autoplay on card flip, contact form feedback
═══════════════════════════════════════════════════ */

'use strict';

// ─── DOM Ready ───
document.addEventListener('DOMContentLoaded', () => {
  initCursor();
  initParticles();
  initNavbar();
  initHamburger();
  initScrollReveal();
  initSkillTabs();
  initRoleCycler();
  initScrollTop();
  initMagneticButtons();
  initSmoothLinks();
  initActiveNav();
  animateSkillBars();
  initProjectCards();   // ← handles tilt + video
  initEduCardTilt();    // ← edu-card tilt only
  initContactForm();    // ← fixed selector
  initHeroCounter();    // ← stat counter
  initProjectFilter();
  initTechStack(); 
});

// ═══════════════════════════════════
// 1. CUSTOM CURSOR
// ═══════════════════════════════════
function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let mx = 0, my = 0;
  let rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll(
    'a, button, .skill-tab, .proj-card, .tech-chip, .social-pill, .edu-card'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
}

// ═══════════════════════════════════
// 2. PARTICLE CANVAS
// ═══════════════════════════════════
function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    stars.length = 0;
    for (let i = 0; i < STAR_COUNT; i++) stars.push(createStar());
  });

  const STAR_COUNT = Math.min(200, Math.floor(W * H / 6000));
  const stars = Array.from({ length: STAR_COUNT }, createStar);

  function createStar() {
    const t = Math.random();
    return {
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.2,
      alpha: Math.random() * 0.7 + 0.15,
      hue: t < 0.5 ? 220 + Math.random()*20
         : t < 0.75 ? 265 + Math.random()*20
         : t < 0.9  ? 195 + Math.random()*15
         : 42,
      sat: t < 0.5 ? 15 : 85,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.025 + 0.004,
      vx: (Math.random() - 0.5) * 0.12,
      vy: (Math.random() - 0.5) * 0.12,
    };
  }

  const shooters = [];
  function spawnShooter() {
    shooters.push({
      x: Math.random() * W * 0.7,
      y: Math.random() * H * 0.4,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 5,
      angle: Math.PI / 4 + (Math.random() - 0.5) * 0.4,
      life: 1,
    });
  }
  setInterval(() => { if (Math.random() < 0.6) spawnShooter(); }, 3500);

  let mouse = { x: W / 2, y: H / 2 };
  window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

  function tick() {
    ctx.clearRect(0, 0, W, H);

    stars.forEach(s => {
      s.twinkle += s.twinkleSpeed;
      const twinkleAlpha = s.alpha * (0.6 + 0.4 * Math.sin(s.twinkle));
      const px = s.x + (mouse.x - W/2) * s.r * 0.003;
      const py = s.y + (mouse.y - H/2) * s.r * 0.003;

      if (s.r > 1.0) {
        ctx.beginPath();
        const grad = ctx.createRadialGradient(px, py, 0, px, py, s.r * 4);
        grad.addColorStop(0, `hsla(${s.hue}, ${s.sat}%, 80%, ${twinkleAlpha * 0.3})`);
        grad.addColorStop(1, 'transparent');
        ctx.fillStyle = grad;
        ctx.arc(px, py, s.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.beginPath();
      ctx.arc(px, py, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${s.hue}, ${s.sat}%, 85%, ${twinkleAlpha})`;
      ctx.fill();

      s.x += s.vx; s.y += s.vy;
      if (s.x < 0) s.x = W; if (s.x > W) s.x = 0;
      if (s.y < 0) s.y = H; if (s.y > H) s.y = 0;
    });

    for (let i = shooters.length - 1; i >= 0; i--) {
      const sh = shooters[i];
      sh.x += Math.cos(sh.angle) * sh.speed;
      sh.y += Math.sin(sh.angle) * sh.speed;
      sh.life -= 0.018;
      if (sh.life <= 0) { shooters.splice(i, 1); continue; }

      const tailX = sh.x - Math.cos(sh.angle) * sh.len;
      const tailY = sh.y - Math.sin(sh.angle) * sh.len;
      const grad  = ctx.createLinearGradient(tailX, tailY, sh.x, sh.y);
      grad.addColorStop(0,   'transparent');
      grad.addColorStop(0.7, `rgba(167, 139, 250, ${sh.life * 0.4})`);
      grad.addColorStop(1,   `rgba(255, 255, 255, ${sh.life * 0.9})`);

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(sh.x, sh.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = sh.life * 1.8;
      ctx.stroke();
    }

    requestAnimationFrame(tick);
  }
  tick();
}

// ═══════════════════════════════════
// 3. NAVBAR SCROLL EFFECT
// ═══════════════════════════════════
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

// ═══════════════════════════════════
// 4. HAMBURGER MENU
// ═══════════════════════════════════
function initHamburger() {
  const btn  = document.getElementById('hamburger');
  const menu = document.getElementById('mobileMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  menu.querySelectorAll('.mob-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      menu.classList.remove('open');
    });
  });
}

// ═══════════════════════════════════
// 5. SCROLL REVEAL
// ═══════════════════════════════════
function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  targets.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════
// 6. SKILL TABS
// ═══════════════════════════════════
function initSkillTabs() {
  const tabs   = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t   => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        panel.querySelectorAll('.sk-fill').forEach(bar => {
          const pct = bar.style.getPropertyValue('--pct') || '0%';
          bar.style.width = '0';
          requestAnimationFrame(() => {
            setTimeout(() => { bar.style.width = pct; }, 60);
          });
        });
      }
    });
  });
}

// ═══════════════════════════════════
// 7. SKILL BAR ANIMATION ON SCROLL
// ═══════════════════════════════════
function animateSkillBars() {
  const skillsSection = document.getElementById('skills');
  if (!skillsSection) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        document.querySelectorAll('.skill-panel.active .sk-fill').forEach((bar, i) => {
          const styleAttr = bar.getAttribute('style') || '';
          const match     = styleAttr.match(/--pct:\s*([^;]+)/);
          const pct       = match ? match[1].trim() : '0%';
          setTimeout(() => { bar.style.width = pct; }, i * 120 + 200);
        });
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(skillsSection);
}

// ═══════════════════════════════════
// 8. ROLE CYCLER
// ═══════════════════════════════════
function initRoleCycler() {
  const words = document.querySelectorAll('.role-word');
  if (!words.length) return;

  let current = 0;

  function cycle() {
    const prev = current;
    current = (current + 1) % words.length;

    words[prev].classList.remove('active');
    words[prev].classList.add('exit');
    setTimeout(() => words[prev].classList.remove('exit'), 500);

    words[current].classList.add('active');
  }

  setInterval(cycle, 2500);
}

// ═══════════════════════════════════
// 9. SCROLL TO TOP BUTTON
// ═══════════════════════════════════
function initScrollTop() {
  const btn = document.getElementById('scrollTopBtn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// ═══════════════════════════════════
// 10. MAGNETIC BUTTONS
// ═══════════════════════════════════
function initMagneticButtons() {
  document.querySelectorAll('.magnetic').forEach(magnet => {
    magnet.addEventListener('mousemove', e => {
      const rect = magnet.getBoundingClientRect();
      const dx   = (e.clientX - (rect.left + rect.width  / 2)) * 0.25;
      const dy   = (e.clientY - (rect.top  + rect.height / 2)) * 0.25;
      magnet.style.transform = `translate(${dx}px, ${dy}px)`;
    });
    magnet.addEventListener('mouseleave', () => {
      magnet.style.transform = '';
    });
  });
}

// ═══════════════════════════════════
// 11. SMOOTH SCROLL FOR ANCHOR LINKS
// ═══════════════════════════════════
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const top = target.getBoundingClientRect().top + window.scrollY - 80;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
}

// ═══════════════════════════════════
// 12. ACTIVE NAV LINK ON SCROLL
// ═══════════════════════════════════
function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle(
            'active',
            link.getAttribute('href') === '#' + entry.target.id
          );
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ═══════════════════════════════════
// 13. PROJECT CARDS — TILT + VIDEO
// ═══════════════════════════════════
// FIX: The old code applied a tilt transform via mousemove on every proj-card,
// which conflicted with the CSS :hover flip. Now we separate the two:
//  - Cards WITHOUT video: gentle tilt only before flip starts, cleared on leave
//  - The SPARMS card (data-has-video="true"): no tilt at all (video is priority),
//    play video after flip completes, pause + reset on mouse leave

function initProjectCards() {
  document.querySelectorAll('.proj-card').forEach(card => {
    const inner    = card.querySelector('.proj-card-inner');
    const hasVideo = card.dataset.hasVideo === 'true';

    if (hasVideo) {
      // ── VIDEO CARD (SPARMS) ──
      const video   = card.querySelector('.proj-demo-video');
      const overlay = card.querySelector('.video-play-overlay');
      const playBtn = card.querySelector('.video-play-btn');

      if (!video) return;

      // Flip delay is 0.7s (matches CSS transition); start video after flip
      let flipTimer = null;

      card.addEventListener('mouseenter', () => {
        // Wait for the flip animation to finish before playing
        flipTimer = setTimeout(() => {
          if (overlay) overlay.style.display = 'none';
          video.play().catch(() => {
            // Autoplay blocked — show the overlay play button instead
            if (overlay) overlay.style.display = 'flex';
          });
        }, 720); // slightly > 0.7s flip
      });

      card.addEventListener('mouseleave', () => {
        clearTimeout(flipTimer);
        video.pause();
        video.currentTime = 0;
        // Re-show overlay for next hover
        if (overlay) overlay.style.display = 'flex';
      });

      // Manual play button (for browsers that block autoplay)
      if (playBtn) {
        playBtn.addEventListener('click', e => {
          e.stopPropagation(); // don't trigger card events
          if (overlay) overlay.style.display = 'none';
          video.play().catch(() => {});
        });
      }

      // When video ends (it's looped, but just in case)
      video.addEventListener('ended', () => {
        if (overlay) overlay.style.display = 'flex';
      });

    } else {
      // ── NORMAL CARD: subtle pre-flip tilt ──
      // Only tilt when the card is NOT in its flipped state
      let flipped = false;

      card.addEventListener('mouseenter', () => { flipped = true; });
      card.addEventListener('mouseleave', () => {
        flipped = false;
        if (inner) inner.style.transform = '';
      });

      card.addEventListener('mousemove', e => {
        // Once CSS :hover fires the flip we stop manual tilt
        if (flipped) return;
        const rect = card.getBoundingClientRect();
        const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
        const y    = (e.clientY - rect.top)    / rect.height - 0.5;
        if (inner) {
          inner.style.transform =
            `perspective(900px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg)`;
        }
      });
    }
  });
}

// ═══════════════════════════════════
// 17. PROJECT FILTER
// ═══════════════════════════════════
function initProjectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projCards  = document.querySelectorAll('.proj-card');
  if (!filterBtns.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      projCards.forEach(card => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ═══════════════════════════════════
// 14. EDUCATION CARD TILT
// ═══════════════════════════════════
function initEduCardTilt() {
  document.querySelectorAll('.edu-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = (e.clientX - rect.left)  / rect.width  - 0.5;
      const y    = (e.clientY - rect.top)    / rect.height - 0.5;
      card.style.transform =
        `perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// ═══════════════════════════════════
// 15. CONTACT FORM FEEDBACK
// FIX: was '.contact-form', HTML uses '#contactForm'
// ═══════════════════════════════════
function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', () => {
    const btn      = document.getElementById('cfnSubmitBtn');
    const textSpan = btn && btn.querySelector('.cfn-submit-text');
    if (btn && textSpan) {
      textSpan.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Sending…';
      btn.style.opacity       = '0.8';
      btn.style.pointerEvents = 'none';
    }
  });
}

// ═══════════════════════════════════
// 16. HERO STAT COUNTER ANIMATION
// ═══════════════════════════════════
function initHeroCounter() {
  const heroSection = document.getElementById('home');
  const statNums    = document.querySelectorAll('.stat-num');
  let animated      = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      statNums.forEach(el => {
        const finalText = el.textContent.trim();
        const num       = parseFloat(finalText);
        if (isNaN(num)) return;

        const suffix   = finalText.replace(/[\d.]/g, '');
        const duration = 1200;
        const start    = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased    = 1 - Math.pow(1 - progress, 3);
          const current  = num * eased;
          el.textContent = (Number.isInteger(num)
            ? Math.round(current)
            : current.toFixed(0)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }
  }, { threshold: 0.5 });

  if (heroSection) observer.observe(heroSection);
}

// ═══════════════════════════════════
// 17. TECH STACK SCROLLING WALL
// ═══════════════════════════════════
function initTechStack() {
  const track = document.getElementById('techTrack');
  if (!track) return;

  const techs = [
    { icon: 'fab fa-python',        name: 'Python' },
    { icon: 'fas fa-database',      name: 'SQL' },
    { icon: 'fab fa-java',          name: 'Java' },
    { icon: 'fab fa-html5',         name: 'HTML' },
    { icon: 'fab fa-css3-alt',      name: 'CSS' },
    { icon: 'fab fa-js',            name: 'JavaScript' },
    { icon: 'fas fa-chart-bar',     name: 'Power BI' },
    { icon: 'fas fa-wave-square',   name: 'Matplotlib' },
    { icon: 'fas fa-palette',       name: 'Seaborn' },
    { icon: 'fas fa-project-diagram', name: 'Plotly' },
    { icon: 'fas fa-file-excel',    name: 'Excel' },
    { icon: 'fab fa-github',        name: 'GitHub' },
    { icon: 'fas fa-cloud',           name: 'Netlify' },
    { icon: 'fas fa-server',          name: 'Vercel' },
  ];

  // Duplicate for seamless infinite loop
  [...techs, ...techs].forEach(t => {
    const chip = document.createElement('div');
    chip.className = 'tech-chip-card';
    chip.innerHTML = `<i class="${t.icon}"></i><span>${t.name}</span>`;
    track.appendChild(chip);
  });
}
