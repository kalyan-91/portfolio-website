// Typing Animation
document.addEventListener('DOMContentLoaded', function() {
  new Typed('#typing-name', {
    strings: ['Daroor Pavan Kalyan'],
    typeSpeed: 100,
    backSpeed: 50,
    backDelay: 2000,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  });
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
  const navbar = document.getElementById('navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Mobile Navigation
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', function() {
  navMenu.classList.toggle('active');
  hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
  });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});

// Active Navigation Link
window.addEventListener('scroll', function() {
  const sections = document.querySelectorAll('.section, .hero');
  const navLinks = document.querySelectorAll('.nav-link');
  
  let current = '';
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;
    if (scrollY >= (sectionTop - 200)) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});

// Intersection Observer for Animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
      
      // Animate counters
      if (entry.target.classList.contains('stat-number')) {
        animateCounter(entry.target);
      }
    }
  });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.text-block, .skill-item, .stat-card, .timeline-item').forEach(el => {
  observer.observe(el);
});

// Counter Animation
function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target'));
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}

// Project Carousel
class ProjectCarousel {
  constructor() {
    this.currentProject = 0;
    this.projects = document.querySelectorAll('.project-card');
    this.indicators = document.querySelectorAll('.indicator');
    this.prevBtn = document.querySelector('.prev-btn');
    this.nextBtn = document.querySelector('.next-btn');
    this.autoPlayInterval = null;
    
    this.init();
  }
  
  init() {
    this.showProject(0);
    this.bindEvents();
    this.startAutoPlay();
  }
  
  bindEvents() {
    this.nextBtn.addEventListener('click', () => this.nextProject());
    this.prevBtn.addEventListener('click', () => this.prevProject());
    
    this.indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => this.showProject(index));
    });
    
    // Pause autoplay on hover
    const projectsContainer = document.querySelector('.projects-container');
    projectsContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
    projectsContainer.addEventListener('mouseleave', () => this.startAutoPlay());
  }
  
  showProject(index) {
    this.projects.forEach(project => project.classList.remove('active'));
    this.indicators.forEach(indicator => indicator.classList.remove('active'));
    
    this.projects[index].classList.add('active');
    this.indicators[index].classList.add('active');
    
    this.currentProject = index;
  }
  
  nextProject() {
    const next = (this.currentProject + 1) % this.projects.length;
    this.showProject(next);
  }
  
  prevProject() {
    const prev = (this.currentProject - 1 + this.projects.length) % this.projects.length;
    this.showProject(prev);
  }
  
  startAutoPlay() {
    this.autoPlayInterval = setInterval(() => {
      this.nextProject();
    }, 5000);
  }
  
  stopAutoPlay() {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }
}

// Initialize Project Carousel
new ProjectCarousel();

// Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Reset button after 3 seconds (form will redirect)
    setTimeout(() => {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 3000);
  });
}

// Last Updated Date
const lastUpdated = document.getElementById('last-updated');
if (lastUpdated) {
  const rawDate = new Date(document.lastModified);
  const options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };
  const formattedDateTime = rawDate.toLocaleString(undefined, options);
  lastUpdated.textContent = formattedDateTime;
}

// Parallax Effect for Floating Shapes
window.addEventListener('scroll', function() {
  const scrolled = window.pageYOffset;
  const gears = document.querySelectorAll('.gear');
  
  gears.forEach((gear, index) => {
    const speed = 0.5 + (index * 0.1);
    const yPos = -(scrolled * speed);
    const rotation = scrolled * 0.1;
    gear.style.transform = `translateY(${yPos}px) rotate(${rotation}deg)`;
  });
});

// Add loading animation
window.addEventListener('load', function() {
  document.body.classList.add('loaded');
});

// Keyboard Navigation
document.addEventListener('keydown', function(e) {
  if (e.key === 'ArrowLeft') {
    document.querySelector('.prev-btn').click();
  } else if (e.key === 'ArrowRight') {
    document.querySelector('.next-btn').click();
  }
});

// Touch/Swipe Support for Projects
let touchStartX = 0;
let touchEndX = 0;

const projectsContainer = document.querySelector('.projects-container');
if (projectsContainer) {
  projectsContainer.addEventListener('touchstart', function(e) {
    touchStartX = e.changedTouches[0].screenX;
  });
  
  projectsContainer.addEventListener('touchend', function(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;
    
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        // Swipe left - next project
        document.querySelector('.next-btn').click();
      } else {
        // Swipe right - previous project
        document.querySelector('.prev-btn').click();
      }
    }
  }
}

// Performance optimization: Throttle scroll events
function throttle(func, wait) {
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

// Apply throttling to scroll events
const throttledScrollHandler = throttle(function() {
  // Existing scroll handlers here
}, 16);

window.addEventListener('scroll', throttledScrollHandler);