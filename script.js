// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  initializeAnimations();
  initializeNavigation();
  initializeThemeSelector();
  initializeScrollAnimations();
  initializeTypedText();
  initializeCounters();
  updateLastUpdated();
});

// Navigation functionality
function initializeNavigation() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.querySelector('.hamburger');
  const navMenu = document.querySelector('.nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  // Smooth scrolling for navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });

        // Update active link
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Close mobile menu if open
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  });

  // Mobile menu toggle
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }

  // Navbar scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // Update active link based on scroll position
    updateActiveNavLink();
  });
}

// Update active navigation link based on scroll position
function updateActiveNavLink() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');

  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
}

// Theme selector functionality
function initializeThemeSelector() {
  const themeButtons = document.querySelectorAll('.theme-btn');

  // Load saved theme
  const savedTheme = localStorage.getItem('portfolio-theme') || 'blue';
  document.documentElement.setAttribute('data-theme', savedTheme);

  themeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const theme = btn.getAttribute('data-theme');
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('portfolio-theme', theme);

      // Add ripple effect
      createRipple(btn, event);
    });
  });
}

// Create ripple effect
function createRipple(element, event) {
  const ripple = document.createElement('span');
  const rect = element.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  ripple.style.width = ripple.style.height = size + 'px';
  ripple.style.left = x + 'px';
  ripple.style.top = y + 'px';
  ripple.classList.add('ripple');

  element.appendChild(ripple);

  setTimeout(() => ripple.remove(), 600);
}

// Scroll animations
function initializeScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show');

        // Animate skill bars
        if (entry.target.classList.contains('skill-category')) {
          animateSkillBars(entry.target);
        }

        // Don't observe again
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe elements
  const elementsToAnimate = document.querySelectorAll(
    '.text-block, .stat-card, .skill-category, .project-card, .timeline-item'
  );

  elementsToAnimate.forEach(el => observer.observe(el));
}

// Animate skill bars
function animateSkillBars(container) {
  const skillBars = container.querySelectorAll('.skill-progress');

  skillBars.forEach(bar => {
    const progress = bar.getAttribute('data-progress');
    setTimeout(() => {
      bar.style.width = progress + '%';
    }, 200);
  });
}

// Typed text effect
function initializeTypedText() {
  const typingElement = document.getElementById('typing-name');
  if (!typingElement) return;

  const text = 'Pavan Kalyan';
  let index = 0;

  function type() {
    if (index < text.length) {
      typingElement.textContent += text.charAt(index);
      index++;
      setTimeout(type, 100);
    } else {
      // Add cursor blink effect
      typingElement.style.borderRight = '2px solid';
      typingElement.style.animation = 'blink 1s infinite';
    }
  }

  // Start typing after a short delay
  setTimeout(type, 500);

  // Add blink animation
  const style = document.createElement('style');
  style.textContent = `
    @keyframes blink {
      0%, 100% { border-color: transparent; }
      50% { border-color: currentColor; }
    }
  `;
  document.head.appendChild(style);
}

// Counter animation
function initializeCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const observerOptions = {
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

// Animate counter
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Parallax effect for background
function initializeAnimations() {
  let mouseX = 0;
  let mouseY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX / window.innerWidth;
    mouseY = e.clientY / window.innerHeight;

    // Move particles based on mouse position
    const particles = document.querySelectorAll('.particle');
    particles.forEach((particle, index) => {
      const speed = (index + 1) * 0.5;
      const x = (mouseX - 0.5) * speed * 50;
      const y = (mouseY - 0.5) * speed * 50;

      particle.style.transform = `translate(${x}px, ${y}px)`;
    });

    // Move gradient orbs
    const orbs = document.querySelectorAll('.orb');
    orbs.forEach((orb, index) => {
      const speed = (index + 1) * 0.3;
      const x = (mouseX - 0.5) * speed * 30;
      const y = (mouseY - 0.5) * speed * 30;

      orb.style.transform = `translate(${x}px, ${y}px)`;
    });
  });

  // Parallax scroll effect
  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;

    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
      heroContent.style.transform = `translateY(${scrolled * 0.5}px)`;
      heroContent.style.opacity = 1 - (scrolled / 500);
    }
  });
}

// Update last updated date
function updateLastUpdated() {
  const lastUpdatedElement = document.getElementById('last-updated');
  if (lastUpdatedElement) {
    const now = new Date();
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    lastUpdatedElement.textContent = now.toLocaleDateString('en-US', options);
  }
}

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    const button = contactForm.querySelector('button[type="submit"]');
    const originalText = button.innerHTML;

    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    button.disabled = true;

    // Re-enable after submission (Formspree handles the actual submission)
    setTimeout(() => {
      button.innerHTML = originalText;
      button.disabled = false;
    }, 3000);
  });
}

// Add magnetic effect to buttons
const buttons = document.querySelectorAll('.btn, .social-link, .project-card');

buttons.forEach(button => {
  button.addEventListener('mousemove', (e) => {
    const rect = button.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;

    button.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  button.addEventListener('mouseleave', () => {
    button.style.transform = '';
  });
});

// Cursor trail effect
let cursorTrail = [];
const maxTrailLength = 20;

document.addEventListener('mousemove', (e) => {
  cursorTrail.push({ x: e.clientX, y: e.clientY, time: Date.now() });

  if (cursorTrail.length > maxTrailLength) {
    cursorTrail.shift();
  }
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const navMenu = document.querySelector('.nav-menu');
    const hamburger = document.querySelector('.hamburger');

    if (navMenu.classList.contains('active')) {
      navMenu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  }
});

// Add loading animation
window.addEventListener('load', () => {
  document.body.classList.add('loaded');

  // Trigger fade-in animations
  setTimeout(() => {
    const fadeElements = document.querySelectorAll('.text-block');
    fadeElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('fade-in');
      }, index * 100);
    });
  }, 300);
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Apply debounce to scroll handlers
const debouncedScrollHandler = debounce(() => {
  updateActiveNavLink();
}, 100);

window.addEventListener('scroll', debouncedScrollHandler);

// Easter egg: Konami code
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
  konamiCode.push(e.key);
  konamiCode = konamiCode.slice(-10);

  if (konamiCode.join(',') === konamiPattern.join(',')) {
    activateEasterEgg();
  }
});

function activateEasterEgg() {
  // Add confetti or special animation
  console.log('🎉 Easter egg activated!');
  document.body.style.animation = 'rainbow 2s linear infinite';

  setTimeout(() => {
    document.body.style.animation = '';
  }, 5000);
}

// Add rainbow animation
const rainbowStyle = document.createElement('style');
rainbowStyle.textContent = `
  @keyframes rainbow {
    0% { filter: hue-rotate(0deg); }
    100% { filter: hue-rotate(360deg); }
  }
`;
document.head.appendChild(rainbowStyle);

// Log performance metrics
if ('performance' in window) {
  window.addEventListener('load', () => {
    const perfData = window.performance.timing;
    const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
    console.log(`Page loaded in ${pageLoadTime}ms`);
  });
}

// Service Worker registration (for future PWA capabilities)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Uncomment when you have a service worker file
    // navigator.serviceWorker.register('/sw.js').then(registration => {
    //   console.log('SW registered:', registration);
    // }).catch(error => {
    //   console.log('SW registration failed:', error);
    // });
  });
}

console.log('%c✨ Welcome to my portfolio! ✨', 'font-size: 20px; font-weight: bold; color: #667eea;');
console.log('%cBuilt with passion by Pavan Kalyan', 'font-size: 14px; color: #a0aec0;');
