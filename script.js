// Loading Screen Functionality
document.addEventListener('DOMContentLoaded', function() {
    const loadingScreen = document.getElementById('loadingScreen');
    const progressBar = document.getElementById('progressBar');
    
    // Simulate loading progress
    let progress = 0;
    const loadingInterval = setInterval(() => {
        progress += Math.random() * 10;
        if (progress > 100) progress = 100;
        
        progressBar.style.width = progress + '%';
        
        if (progress >= 100) {
            clearInterval(loadingInterval);
            
            // Hide loading screen after a short delay
            setTimeout(() => {
                loadingScreen.classList.add('fade-out');
                
                // Remove loading screen from DOM after animation
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                    
                    // Trigger scroll animations for elements already in view
                    const elementsInView = document.querySelectorAll('.animate-on-scroll');
                    elementsInView.forEach(el => {
                        const rect = el.getBoundingClientRect();
                        if (rect.top < window.innerHeight && rect.bottom > 0) {
                            el.classList.add('animated');
                        }
                    });
                }, 800);
            }, 500);
        }
    }, 100);
    
    // Ensure loading screen is hidden even if something goes wrong
    window.addEventListener('load', () => {
        setTimeout(() => {
            if (loadingScreen && !loadingScreen.classList.contains('fade-out')) {
                loadingScreen.classList.add('fade-out');
                setTimeout(() => {
                    loadingScreen.style.display = 'none';
                }, 800);
            }
        }, 3000); // Maximum 3 seconds loading time
    });
});

// DOM Elements
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Theme Toggle Functionality
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

// Check for saved theme preference or default to 'light'
const currentTheme = localStorage.getItem('theme') || 'dark';
document.documentElement.setAttribute('data-theme', currentTheme);

// Update icon based on current theme
function updateThemeIcon(theme) {
    if (theme === 'dark') {
        themeIcon.className = 'fas fa-moon';
    } else {
        themeIcon.className = 'fas fa-sun';
    }
}

// Initialize theme icon
updateThemeIcon(currentTheme);

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add smooth transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
});

// Navigation functionality - Enhanced mobile support
function initializeNavigation() {
    // Remove any existing event listeners to prevent duplicates
    const newHamburger = hamburger.cloneNode(true);
    hamburger.parentNode.replaceChild(newHamburger, hamburger);
    
    // Update reference
    const hamburgerBtn = document.querySelector('.hamburger');
    
    // Prevent body scroll when mobile menu is open
    function toggleBodyScroll(shouldLock) {
        if (shouldLock) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
    }

    // Toggle mobile menu
    hamburgerBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isActive = hamburgerBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        toggleBodyScroll(isActive);
    });

    // Close mobile menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            toggleBodyScroll(false);
        });
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        const isClickInsideNav = navMenu.contains(e.target) || hamburgerBtn.contains(e.target);
        if (!isClickInsideNav && navMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            toggleBodyScroll(false);
        }
    });

    // Close mobile menu on window resize if larger than mobile breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            hamburgerBtn.classList.remove('active');
            navMenu.classList.remove('active');
            toggleBodyScroll(false);
        }
    });
}

// Initialize navigation
initializeNavigation();

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').includes(current)) {
            link.classList.add('active');
        }
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href').substring(1);
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            
            // Trigger specific animations based on element type
            if (entry.target.classList.contains('stat-item')) {
                animateCounter(entry.target);
            }
            
            if (entry.target.classList.contains('skill-category')) {
                animateSkillBars(entry.target);
            }
        }
    });
}, observerOptions);

// Observe all elements with animate-on-scroll class
document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// Counter animation for statistics
function animateCounter(element) {
    const numberElement = element.querySelector('.stat-number');
    const target = parseInt(numberElement.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        numberElement.textContent = Math.floor(current);
    }, 16);
}

// Skill bar animation
function animateSkillBars(element) {
    const skillBars = element.querySelectorAll('.skill-progress');
    
    skillBars.forEach((bar, index) => {
        setTimeout(() => {
            const width = bar.getAttribute('data-width');
            bar.style.width = width;
        }, index * 200);
    });
}

// Parallax effect for floating shapes
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const shapes = document.querySelectorAll('.shape');
    
    shapes.forEach((shape, index) => {
        const speed = 0.5 + (index * 0.1);
        const yPos = -(scrolled * speed);
        shape.style.transform = `translateY(${yPos}px) rotate(${scrolled * 0.1}deg)`;
    });
});

// 3D tilt effect for cards
function addTiltEffect() {
    const cards = document.querySelectorAll('.project-card, .skill-category, .timeline-content');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            card.style.transform = `
                perspective(1000px) 
                rotateX(${rotateX}deg) 
                rotateY(${rotateY}deg) 
                translateZ(10px)
            `;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        });
    });
}

// Initialize tilt effect
addTiltEffect();

// Typing animation for hero title
function typeWriter() {
    const titleElement = document.querySelector('.title-name');
    const text = 'Rendi Dwi Kurniasandi';
    let i = 0;
    
    titleElement.textContent = '';
    
    function type() {
        if (i < text.length) {
            titleElement.textContent += text.charAt(i);
            i++;
            setTimeout(type, 100);
        }
    }
    
    setTimeout(type, 1000);
}

// Initialize typing animation
window.addEventListener('load', typeWriter);

// Particle animation for background
function createParticles() {
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles';
    particleContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
    `;
    
    document.body.appendChild(particleContainer);
    
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 2px;
            height: 2px;
            background: rgba(102, 126, 234, 0.3);
            border-radius: 50%;
            animation: float ${5 + Math.random() * 10}s linear infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        particleContainer.appendChild(particle);
    }
}

// Add particle styles
const particleStyles = document.createElement('style');
particleStyles.textContent = `
    @keyframes particleFloat {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(particleStyles);

// Initialize particles
createParticles();

// Form submission with animation
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Animate button
        submitBtn.textContent = 'Sending...';
        submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
        
        // Simulate form submission
        setTimeout(() => {
            submitBtn.textContent = 'Sent!';
            submitBtn.style.background = 'linear-gradient(135deg, #28a745 0%, #20c997 100%)';
            
            setTimeout(() => {
                submitBtn.textContent = originalText;
                submitBtn.style.background = '';
                contactForm.reset();
            }, 2000);
        }, 1500);
    });
}

// Advanced scroll animations with GSAP-like effects
function createScrollTimeline() {
    window.addEventListener('scroll', () => {
        const scrollProgress = window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight);
        
        // Animate hero background
        const hero = document.querySelector('.hero');
        if (hero) {
            const offset = window.pageYOffset * 0.5;
            hero.style.transform = `translateY(${offset}px)`;
        }
        
        // Animate timeline dots
        const timelineDots = document.querySelectorAll('.timeline-dot');
        timelineDots.forEach((dot, index) => {
            const rect = dot.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
            
            if (isVisible) {
                dot.style.animationDelay = `${index * 0.2}s`;
                dot.classList.add('animate');
            }
        });
    });
}

// Initialize scroll timeline
createScrollTimeline();

// Cursor trail effect
function createCursorTrail() {
    const trail = [];
    const trailLength = 20;
    
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        dot.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(102, 126, 234, ${1 - i / trailLength});
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            transition: all 0.1s ease;
        `;
        document.body.appendChild(dot);
        trail.push(dot);
    }
    
    document.addEventListener('mousemove', (e) => {
        trail.forEach((dot, index) => {
            setTimeout(() => {
                dot.style.left = e.clientX + 'px';
                dot.style.top = e.clientY + 'px';
            }, index * 10);
        });
    });
}

// Initialize cursor trail on desktop
if (window.innerWidth > 768) {
    createCursorTrail();
}

// Page transition animations
function initPageTransitions() {
    // Fade in animation on load
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    
    window.addEventListener('load', () => {
        document.body.style.opacity = '1';
    });
}

// Initialize page transitions
initPageTransitions();

// Advanced hover effects for buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('mouseenter', (e) => {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: scale(0);
            animation: ripple 0.6s linear;
            left: ${e.offsetX}px;
            top: ${e.offsetY}px;
            width: 20px;
            height: 20px;
            margin-left: -10px;
            margin-top: -10px;
        `;
        
        btn.style.position = 'relative';
        btn.style.overflow = 'hidden';
        btn.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add ripple animation styles
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);

// Performance optimization - Debounced scroll handler
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

// Apply debouncing to scroll-heavy functions
const debouncedScrollHandler = debounce(() => {
    // Heavy scroll operations here
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

// Intersection Observer for better performance
const performanceObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-viewport');
        } else {
            entry.target.classList.remove('in-viewport');
        }
    });
}, { threshold: 0.1 });

// Observe all major sections
document.querySelectorAll('section').forEach(section => {
    performanceObserver.observe(section);
});

// Preload images for better performance
function preloadImages() {
    const images = [
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop&crop=face',
        'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop'
    ];
    
    images.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Initialize image preloading
preloadImages();

// Console welcome message
console.log(`
🚀 Welcome to Rendi Dwi Kurniasandi's Portfolio!
💼 Flutter & Mobile Specialist | Fullstack Developer
🎨 Featuring beautiful animations and 3D effects
📱 Fully responsive design
⚡ Optimized for performance

Connect with me:
📧 rendidwikurniasandi@gmail.com
🔗 LinkedIn: /in/rendidwikurniasandi
🐱 GitHub: /rendidwikurniasandi
`);

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully! 🎉');
});

// Project Modal Functionality
const projectModal = document.getElementById('projectModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalCategory = document.getElementById('modalCategory');
const modalStatus = document.getElementById('modalStatus');
const modalDescription = document.getElementById('modalDescription');
const modalFeatures = document.getElementById('modalFeatures');
const modalTechStack = document.getElementById('modalTechStack');
const modalGithubLink = document.getElementById('modalGithubLink');
const modalLiveLink = document.getElementById('modalLiveLink');

// Project data
const projectsData = {
    littlewallet: {
        title: "Little Wallet",
        category: "Mobile App",
        status: "Published",
        description: "A comprehensive family financial education app designed to teach financial literacy across generations. Features multi-role login system for Parents, Teens, and Elders with real-time push notifications, GPS tracking, and multilingual support covering English, Indonesian, and Vietnamese markets.",
        features: [
            "Multi-role authentication system",
            "Real-time push notifications", 
            "GPS location tracking",
            "Multilingual support (EN/ID/VN)",
            "Family financial management",
            "Educational content delivery",
            "Cross-platform compatibility",
            "Secure payment integration"
        ],
        tech: ["Flutter", "Firebase", "Riverpod", "Lottie", "Push Notifications", "GPS Integration"],
        github: "https://github.com/sniren210",
        live: "#",
        image: "./images/littlewallet.png"
    },
    tanahub: {
        title: "Tanahub",
        category: "Web3 Platform", 
        status: "In Production",
        description: "A revolutionary blockchain-based property listing platform that combines real estate with Web3 technology. Features smart contract integration, wallet connectivity, and responsive design for both mobile and web platforms. Built for modern property investment and management.",
        features: [
            "Smart contract integration",
            "Wallet connectivity (MetaMask, WalletConnect)",
            "Property NFT minting",
            "Responsive web and mobile design",
            "Firebase real-time messaging",
            "Property listing and discovery",
            "Blockchain transaction history",
            "Multi-platform compatibility"
        ],
        tech: ["Flutter", "Next.js", "Ethers.js", "Solidity", "Web3", "Firebase", "Smart Contracts"],
        github: "https://github.com/sniren210",
        live: "#",
        image: "./images/tanahub.png"
    },
    hararu: {
        title: "Hararu",
        category: "E-commerce Platform",
        status: "Completed", 
        description: "A comprehensive halal product marketplace featuring location-based store discovery, real-time chat system, and dynamic deep linking. Built with Flutter Web for responsive design and integrated with Laravel backend APIs for robust performance.",
        features: [
            "Location-based store discovery",
            "Real-time chat via WebSocket",
            "Dynamic deep links",
            "Google Maps integration",
            "NFT product listing",
            "Responsive web design",
            "Laravel API integration",
            "Wallet system integration"
        ],
        tech: ["Flutter", "Laravel", "GetX", "WebSocket", "Google Maps", "NFT Integration"],
        github: "https://github.com/sniren210",
        live: "#",
        image: "./images/hararu.png"
    },
    harti: {
        title: "Harti",
        category: "NFT Platform",
        status: "Completed",
        description: "An innovative NFT campaign application featuring custom roadmap animations, OpenSea integration, and invite-only access control. Built to showcase NFT collections with engaging user experience.",
        features: [
            "Custom Lottie animations",
            "OpenSea integration", 
            "Invite-only access system",
            "NFT collection showcase",
            "Interactive roadmap",
            "Firebase backend",
            "Supabase integration",
            "Mobile-first design"
        ],
        tech: ["Flutter", "Firebase", "Supabase", "Lottie", "NFT APIs"],
        github: "https://github.com/sniren210",
        live: "#",
        image: "./images/harti.png"
    },
    instantad: {
        title: "InstantAd.ai",
        category: "AI Application",
        status: "Published",
        description: "A powerful AI-powered advertising assistant designed to help users launch complete, high-quality ad campaigns in seconds. Targeted at business owners, marketers, and content creators. Publicly available on Google Play Store.",
        features: [
            "AI-powered campaign generation",
            "Real-time ad optimization",
            "Multi-platform publishing",
            "Analytics dashboard",
            "Template management",
            "API integrations",
            "User role management",
            "Google Play Store published"
        ],
        tech: ["Flutter", "Firebase", "AI SDK/API", "REST API", "Machine Learning"],
        github: "https://github.com/sniren210",
        live: "https://play.google.com/store",
        image: "./images/instandad.png"
    },
    gatsby: {
        title: "Gatsby.co.id (Refactor)",
        category: "Web Development",
        status: "Completed",
        description: "Website optimization and frontend refactor project that reduced load time by 40% and increased interaction metrics by 30%. Focused on performance optimization and modern development practices.",
        features: [
            "40% load time reduction",
            "30% interaction improvement",
            "Modern build pipeline",
            "Performance optimization",
            "SEO improvements",
            "Responsive design upgrade",
            "Code splitting implementation",
            "Progressive enhancement"
        ],
        tech: ["SvelteKit", "TailwindCSS", "Vite", "Performance Optimization"],
        github: "https://github.com/sniren210",
        live: "#",
        image: "./images/gatsby.png"
    }
};

// Open modal function
function openProjectModal(projectKey) {
    const project = projectsData[projectKey];
    if (!project) return;

    // Populate modal content
    modalTitle.textContent = project.title;
    modalImage.src = project.image;
    modalImage.alt = project.title;
    modalCategory.textContent = project.category;
    modalStatus.textContent = project.status;
    modalDescription.textContent = project.description;
    
    // Clear and populate features
    modalFeatures.innerHTML = '';
    project.features.forEach(feature => {
        const li = document.createElement('li');
        li.textContent = feature;
        modalFeatures.appendChild(li);
    });
    
    // Clear and populate tech stack
    modalTechStack.innerHTML = '';
    project.tech.forEach(tech => {
        const span = document.createElement('span');
        span.className = 'tech-tag';
        span.textContent = tech;
        modalTechStack.appendChild(span);
    });
    
    // Update links
    modalGithubLink.href = project.github;
    modalLiveLink.href = project.live;
    
    // Show modal with animation
    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

// Close modal function
function closeProjectModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

// Event listeners for project cards
document.addEventListener('DOMContentLoaded', function() {
    // Add click listeners to view details buttons
    // document.querySelectorAll('.view-details').forEach(button => {
    //     button.addEventListener('click', function(e) {
    //         e.preventDefault();
    //         e.stopPropagation();
            
    //         const projectCard = this.closest('.project-card');
    //         const projectKey = projectCard.dataset.project;
    //         openProjectModal(projectKey);
    //     });
    // });
    
    // Add click listeners to project cards themselves
    // document.querySelectorAll('.project-card').forEach(card => {
    //     card.addEventListener('click', function(e) {
    //         // Don't trigger if clicking on links or buttons
    //         if (e.target.closest('a') || e.target.closest('button')) return;
            
    //         const projectKey = this.dataset.project;
    //         openProjectModal(projectKey);
    //     });
    // });
    
    // Close modal events
    modalClose.addEventListener('click', closeProjectModal);
    modalOverlay.addEventListener('click', closeProjectModal);
    
    // Close modal on ESC key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && projectModal.classList.contains('active')) {
            closeProjectModal();
        }
    });
});
