/* ═══════════════════════════════════════════════════
   PAVAN KALYAN PORTFOLIO — script.js
   Features: Custom cursor, particles, scroll reveals,
   skill tabs, role cycler, navbar, magnetic buttons
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
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
  });

  // Smooth ring follow
  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover effect on interactive elements
  const hoverTargets = document.querySelectorAll(
    'a, button, .skill-tab, .proj-card, .c-card, .tech-chip, .social-pill, .edu-card'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hover'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hover'));
  });

  // Hide on leave
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
  });

  // Particles
  const COUNT = Math.min(80, Math.floor(W * H / 18000));
  const particles = Array.from({ length: COUNT }, () => createParticle(W, H));

  // Mouse position for interactivity
  let mouse = { x: W / 2, y: H / 2 };
  window.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  function createParticle(w, h) {
    const type = Math.random();
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      r: Math.random() * 1.2 + 0.3,
      alpha: Math.random() * 0.5 + 0.1,
      // Space palette: white stars, violet, cyan-blue, soft gold
      hue: type < 0.5 ? 220 : type < 0.7 ? 270 : type < 0.85 ? 195 : 45,
      sat: type < 0.5 ? 10 : 90,
      twinkle: Math.random() * Math.PI * 2,
      twinkleSpeed: Math.random() * 0.02 + 0.005,
    };
  }

  function drawConnections() {
    const maxDist = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          const alpha = (1 - dist / maxDist) * 0.08;
          ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    drawConnections();

    particles.forEach(p => {
      // Gentle mouse attraction
      const dx = mouse.x - p.x;
      const dy = mouse.y - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 200) {
        p.vx += dx / dist * 0.008;
        p.vy += dy / dist * 0.008;
      }

      // Damping
      p.vx *= 0.99;
      p.vy *= 0.99;

      // Clamp speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > 0.8) {
        p.vx = (p.vx / speed) * 0.8;
        p.vy = (p.vy / speed) * 0.8;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap
      if (p.x < 0)  p.x = W;
      if (p.x > W)  p.x = 0;
      if (p.y < 0)  p.y = H;
      if (p.y > H)  p.y = 0;

      // Draw
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${p.hue}, 100%, 65%, ${p.alpha})`;
      ctx.fill();
    });

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

  // Close on link click
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
  const targets = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );

  const observer = new IntersectionObserver(
    (entries) => {
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

      tabs.forEach(t => t.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));

      tab.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      if (panel) {
        panel.classList.add('active');
        // Re-animate bars in newly visible panel
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
        // Animate bars in active panel
        document.querySelectorAll('.skill-panel.active .sk-fill').forEach((bar, i) => {
          const pct = bar.style.getPropertyValue('--pct') || bar.getAttribute('style')?.match(/--pct:\s*(\S+)/)?.[1] || '0%';
          setTimeout(() => {
            bar.style.width = pct;
          }, i * 120 + 200);
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
  const magnets = document.querySelectorAll('.magnetic');

  magnets.forEach(magnet => {
    magnet.addEventListener('mousemove', e => {
      const rect   = magnet.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) * 0.25;
      const dy     = (e.clientY - cy) * 0.25;
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
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
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
// 13. TILT EFFECT ON PROJECT CARDS
// ═══════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.proj-card, .edu-card');

  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width  - 0.5;
      const y = (e.clientY - rect.top)  / rect.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 6}deg) rotateX(${-y * 6}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
});

// ═══════════════════════════════════
// 14. CONTACT FORM FEEDBACK
// ═══════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', () => {
    const btn = form.querySelector('button[type="submit"]');
    if (btn) {
      btn.querySelector('span').innerHTML = '<i class="fas fa-check"></i> Sending…';
      btn.style.opacity = '0.8';
      btn.style.pointerEvents = 'none';
    }
  });
});

// ═══════════════════════════════════
// 15. COUNTER ANIMATION FOR HERO STATS
// ═══════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  const heroSection = document.getElementById('home');
  const statNums    = document.querySelectorAll('.stat-num');
  let animated      = false;

  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting && !animated) {
      animated = true;
      statNums.forEach(el => {
        const finalText = el.textContent.trim();
        const num = parseFloat(finalText);
        if (isNaN(num)) return;

        const suffix = finalText.replace(/[\d.]/g, '');
        const duration = 1200;
        const start = performance.now();

        function update(now) {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = num * eased;
          el.textContent = (Number.isInteger(num) ? Math.round(current) : current.toFixed(0)) + suffix;
          if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
      });
    }
  }, { threshold: 0.5 });

  if (heroSection) observer.observe(heroSection);
});
