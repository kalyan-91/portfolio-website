// Enhanced Interactive Portfolio JavaScript

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');
const projectCards = document.querySelectorAll('.project-card');
const projectIndicators = document.querySelectorAll('.indicator');
const prevBtn = document.querySelector('.prev-btn');
const nextBtn = document.querySelector('.next-btn');
const textBlocks = document.querySelectorAll('.text-block');
const statNumbers = document.querySelectorAll('.stat-number');
const lastUpdated = document.getElementById('last-updated');

// State
let currentProject = 0;
let isScrolling = false;

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    initializePortfolio();
    setupEventListeners();
    setupScrollAnimations();
    setupTypingEffect();
    setupParticles();
    setupCursor();
    updateLastModified();
    setupLoadingScreen();
});

// Initialize Portfolio
function initializePortfolio() {
    // Add loading screen
    const loadingScreen = document.createElement('div');
    loadingScreen.className = 'loading';
    loadingScreen.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loadingScreen);

    // Animate stat numbers
    animateStatNumbers();
    
    // Setup project navigation
    updateProjectDisplay();
    
    // Add fade-in classes to elements
    addFadeInClasses();
}

// Setup Loading Screen
function setupLoadingScreen() {
    window.addEventListener('load', function() {
        setTimeout(() => {
            const loading = document.querySelector('.loading');
            if (loading) {
                loading.classList.add('hidden');
                setTimeout(() => {
                    loading.remove();
                }, 500);
            }
        }, 1000);
    });
}

// Setup Event Listeners
function setupEventListeners() {
    // Navbar scroll effect
    window.addEventListener('scroll', handleScroll);
    
    // Mobile menu toggle
    hamburger.addEventListener('click', toggleMobileMenu);
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavClick);
    });
    
    // Project navigation
    prevBtn.addEventListener('click', () => changeProject(-1));
    nextBtn.addEventListener('click', () => changeProject(1));
    
    // Project indicators
    projectIndicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => goToProject(index));
    });
    
    // Smooth scroll for scroll indicator
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', () => {
            document.getElementById('about').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Form submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Add hover effects to interactive elements
    setupHoverEffects();
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboardNavigation);
}

// Handle Scroll
function handleScroll() {
    if (isScrolling) return;
    
    isScrolling = true;
    requestAnimationFrame(() => {
        // Navbar scroll effect
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Update active navigation
        updateActiveNavigation();
        
        // Trigger scroll animations
        triggerScrollAnimations();
        
        isScrolling = false;
    });
}

// Update Active Navigation
function updateActiveNavigation() {
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach((section, index) => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`a[href="#${section.id}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Toggle Mobile Menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
    
    // Animate hamburger
    const spans = hamburger.querySelectorAll('span');
    spans.forEach((span, index) => {
        if (navMenu.classList.contains('active')) {
            if (index === 0) span.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) span.style.opacity = '0';
            if (index === 2) span.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            span.style.transform = '';
            span.style.opacity = '';
        }
    });
}

// Handle Navigation Click
function handleNavClick(e) {
    e.preventDefault();
    const targetId = e.currentTarget.getAttribute('href');
    const targetSection = document.querySelector(targetId);
    
    if (targetSection) {
        targetSection.scrollIntoView({ behavior: 'smooth' });
        
        // Close mobile menu
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
        
        // Reset hamburger
        const spans = hamburger.querySelectorAll('span');
        spans.forEach(span => {
            span.style.transform = '';
            span.style.opacity = '';
        });
    }
}

// Setup Scroll Animations
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Animate text blocks in about section
                if (entry.target.id === 'about') {
                    animateTextBlocks();
                }
            }
        });
    }, observerOptions);
    
    sections.forEach(section => {
        observer.observe(section);
    });
}

// Trigger Scroll Animations
function triggerScrollAnimations() {
    const fadeElements = document.querySelectorAll('.fade-in-up, .fade-in-left, .fade-in-right');
    
    fadeElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('visible');
        }
    });
}

// Add Fade In Classes
function addFadeInClasses() {
    // Add fade-in classes to various elements
    const skillCategories = document.querySelectorAll('.skill-category');
    const statCards = document.querySelectorAll('.stat-card');
    const contactMethods = document.querySelectorAll('.contact-method');
    
    skillCategories.forEach((category, index) => {
        category.classList.add('fade-in-up');
        category.style.animationDelay = `${index * 0.2}s`;
    });
    
    statCards.forEach((card, index) => {
        card.classList.add('fade-in-right');
        card.style.animationDelay = `${index * 0.3}s`;
    });
    
    contactMethods.forEach((method, index) => {
        method.classList.add('fade-in-left');
        method.style.animationDelay = `${index * 0.2}s`;
    });
}

// Animate Text Blocks
function animateTextBlocks() {
    textBlocks.forEach((block, index) => {
        setTimeout(() => {
            block.classList.add('fade-in');
        }, index * 200);
    });
}

// Animate Stat Numbers
function animateStatNumbers() {
    const animateNumber = (element, target, duration = 2000) => {
        const start = 0;
        const increment = target / (duration / 16);
        let current = start;
        
        const timer = setInterval(() => {
            current += increment;
            element.textContent = Math.floor(current);
            
            if (current >= target) {
                element.textContent = target;
                clearInterval(timer);
            }
        }, 16);
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.getAttribute('data-target'));
                animateNumber(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    });
    
    statNumbers.forEach(number => {
        observer.observe(number);
    });
}

// Project Navigation
function changeProject(direction) {
    currentProject += direction;
    
    if (currentProject >= projectCards.length) {
        currentProject = 0;
    } else if (currentProject < 0) {
        currentProject = projectCards.length - 1;
    }
    
    updateProjectDisplay();
}

function goToProject(index) {
    currentProject = index;
    updateProjectDisplay();
}

function updateProjectDisplay() {
    // Update project cards
    projectCards.forEach((card, index) => {
        card.classList.remove('active');
        if (index === currentProject) {
            setTimeout(() => {
                card.classList.add('active');
            }, 100);
        }
    });
    
    // Update indicators
    projectIndicators.forEach((indicator, index) => {
        indicator.classList.remove('active');
        if (index === currentProject) {
            indicator.classList.add('active');
        }
    });
}

// Setup Typing Effect
function setupTypingEffect() {
    const typingElement = document.getElementById('typing-name');
    if (typingElement && typeof Typed !== 'undefined') {
        new Typed('#typing-name', {
            strings: ['Pavan Kalyan',],
            typeSpeed: 100,
            backSpeed: 50,
            backDelay: 2000,
            loop: true,
            showCursor: true,
            cursorChar: '|'
        });
    }
}

// Setup Hover Effects
function setupHoverEffects() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('.btn, .social-link, .nav-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
    
    // Add tilt effect to cards
    const cards = document.querySelectorAll('.stat-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });
}

// Setup Particles
function setupParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);
    
    for (let i = 0; i < 50; i++) {
        createParticle(particlesContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    
    // Random animation delay
    particle.style.animationDelay = Math.random() * 6 + 's';
    particle.style.animationDuration = (Math.random() * 3 + 3) + 's';
    
    container.appendChild(particle);
    
    // Remove and recreate particle after animation
    setTimeout(() => {
        particle.remove();
        createParticle(container);
    }, 6000);
}

// Setup Custom Cursor
function setupCursor() {
    const cursor = document.createElement('div');
    const cursorFollower = document.createElement('div');
    
    cursor.className = 'cursor';
    cursorFollower.className = 'cursor-follower';
    
    document.body.appendChild(cursor);
    document.body.appendChild(cursorFollower);
    
    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        cursor.style.left = mouseX + 'px';
        cursor.style.top = mouseY + 'px';
    });
    
    // Smooth follower animation
    function animateFollower() {
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        
        cursorFollower.style.left = followerX + 'px';
        cursorFollower.style.top = followerY + 'px';
        
        requestAnimationFrame(animateFollower);
    }
    
    animateFollower();
    
    // Hide cursor on mobile
    if (window.innerWidth <= 768) {
        cursor.style.display = 'none';
        cursorFollower.style.display = 'none';
    }
}

// Handle Form Submission
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    submitBtn.disabled = true;
    
    // Simulate form submission (replace with actual form handling)
    setTimeout(() => {
        // Show success message
        submitBtn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        
        // Reset form
        form.reset();
        
        // Reset button after delay
        setTimeout(() => {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = '';
        }, 3000);
    }, 2000);
}

// Keyboard Navigation
function handleKeyboardNavigation(e) {
    switch(e.key) {
        case 'ArrowLeft':
            if (document.activeElement.closest('.projects-container')) {
                changeProject(-1);
            }
            break;
        case 'ArrowRight':
            if (document.activeElement.closest('.projects-container')) {
                changeProject(1);
            }
            break;
        case 'Escape':
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
            break;
    }
}

// Update Last Modified Date
function updateLastModified() {
    const lastUpdated = document.getElementById("last-updated");
    if (lastUpdated) {
        const modifiedDate = new Date(document.lastModified);
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        };
        lastUpdated.textContent = modifiedDate.toLocaleDateString('en-US', options);
    }
}


// Auto-advance projects
function startProjectAutoAdvance() {
    setInterval(() => {
        if (!document.querySelector('.projects-container:hover')) {
            changeProject(1);
        }
    }, 8000);
}

// Performance optimization
function optimizePerformance() {
    // Lazy load images
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
    
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(handleScroll, 10);
    }, { passive: true });
}

// Initialize auto-advance and performance optimizations
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        startProjectAutoAdvance();
        optimizePerformance();
    }, 2000);
});

// Add CSS for ripple effect
const rippleCSS = `
.ripple {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.3);
    transform: scale(0);
    animation: ripple-animation 0.6s linear;
    pointer-events: none;
}

@keyframes ripple-animation {
    to {
        transform: scale(4);
        opacity: 0;
    }
}
`;

const style = document.createElement('style');
style.textContent = rippleCSS;
document.head.appendChild(style);

// Smooth scrolling polyfill for older browsers
if (!('scrollBehavior' in document.documentElement.style)) {
    const smoothScrollPolyfill = document.createElement('script');
    smoothScrollPolyfill.src = 'https://cdn.jsdelivr.net/gh/iamdustan/smoothscroll@master/src/smoothscroll.js';
    document.head.appendChild(smoothScrollPolyfill);
}

// Add intersection observer polyfill for older browsers
if (!window.IntersectionObserver) {
    const polyfillScript = document.createElement('script');
    polyfillScript.src = 'https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver';
    document.head.appendChild(polyfillScript);
}

// Console welcome message
console.log(`
🚀 Welcome to Pavan Kalyan's Portfolio!
📧 Contact: daroorpavankalyan@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/daroor-pavan-kalyan-370277253/
💻 GitHub: https://github.com/kalyan-91

Built with ❤️ using vanilla JavaScript, CSS3, and HTML5
`);

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        changeProject,
        updateProjectDisplay,
        handleScroll,
        toggleMobileMenu
    };
}
