document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME TOGGLE SYSTEM
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const bodyElement = document.body;

    // Check localStorage
    const savedTheme = localStorage.getItem('portfolio-theme');

    if (savedTheme) {
        bodyElement.className = savedTheme;
    } else {
        // Default to light theme
        bodyElement.className = 'light-theme';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (bodyElement.classList.contains('dark-theme')) {
            bodyElement.classList.replace('dark-theme', 'light-theme');
            localStorage.setItem('portfolio-theme', 'light-theme');
        } else {
            bodyElement.classList.replace('light-theme', 'dark-theme');
            localStorage.setItem('portfolio-theme', 'dark-theme');
        }
    });


    /* ==========================================================================
       STICKY NAVBAR & ACTIVE NAV LINKS
       ========================================================================== */
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    const handleScroll = () => {
        // Sticky class
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 160;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Run once initially


    /* ==========================================================================
       MOBILE MENU DRAWER
       ========================================================================== */
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');

    const toggleMenu = () => {
        mobileToggle.classList.toggle('open');
        navMenu.classList.toggle('open');
    };

    mobileToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking a link
    const menuLinks = document.querySelectorAll('.nav-menu .nav-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* ==========================================================================
       TYPING SUBTITLE ANIMATION
       ========================================================================== */
    const typingSub = document.getElementById('typing-sub');
    const roles = ["Software Engineer", "AI & ML Specialist", "Full-Stack Developer", "Data Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    const typeRoleEffect = () => {
        const currentRole = roles[roleIndex];
        
        if (isDeleting) {
            // Delete characters
            typingSub.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50; // Deleting is faster
        } else {
            // Type characters
            typingSub.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100; // Typing speed
        }

        // Handle states transition
        if (!isDeleting && charIndex === currentRole.length) {
            // Full role is typed: wait and then delete
            isDeleting = true;
            typingSpeed = 2000; // Pause at full word
        } else if (isDeleting && charIndex === 0) {
            // Word deleted: move to next word
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typingSpeed = 500; // Pause before typing next word
        }

        setTimeout(typeRoleEffect, typingSpeed);
    };

    // Start typewriter effect after small delay
    setTimeout(typeRoleEffect, 1000);


    /* ==========================================================================
       INTERSECTION OBSERVER (SCROLL REVEAL & SKILLS ANIMATION)
       ========================================================================== */
    const revealItems = document.querySelectorAll('.reveal-item');
    const skillBars = document.querySelectorAll('.skill-progress-bar');
    const skillsSection = document.getElementById('skills');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealItems.forEach(item => {
        revealObserver.observe(item);
    });

    // Dedicated observer to trigger skill bar progress filling
    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                skillBars.forEach(bar => {
                    const widthVal = bar.getAttribute('data-width');
                    bar.style.width = widthVal;
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }


    /* ==========================================================================
       PORTFOLIO PROJECTS FILTERING
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Toggle active class on buttons
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filterValue === 'all' || category === filterValue) {
                    card.classList.remove('hide');
                    // Force display block first, then transition opacity
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'scale(0.95)';
                    // Delay hiding from layout to allow fade animation
                    setTimeout(() => {
                        card.classList.add('hide');
                    }, 300);
                }
            });
        });
    });


    /* ==========================================================================
       CONTACT FORM SUBMISSION (SIMULATION)
       ========================================================================== */
    const contactForm = document.getElementById('contact-form');
    const submitBtn = document.getElementById('btn-submit-contact');
    const formStatus = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Disable button during submit
            submitBtn.disabled = true;
            const originalBtnContent = submitBtn.innerHTML;
            submitBtn.innerHTML = `
                <span>Sending...</span>
                <svg class="submit-btn-icon spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="10"></circle>
                </svg>
            `;

            // Setup CSS for spinning loading icon in SVG
            const spinStyle = document.createElement('style');
            spinStyle.innerHTML = `
                @keyframes form-spin {
                    to { transform: rotate(360deg); }
                }
                .spin {
                    animation: form-spin 0.8s linear infinite;
                }
            `;
            document.head.appendChild(spinStyle);

            // Fetch input data
            const name = document.getElementById('form-name').value;
            const email = document.getElementById('form-email').value;
            const subject = document.getElementById('form-subject').value;
            const message = document.getElementById('form-message').value;

            // Simulate server network latency
            setTimeout(() => {
                // Success simulation
                formStatus.textContent = `Thank you, ${name}! Your message has been sent successfully.`;
                formStatus.className = 'form-status-msg success';
                
                // Clear inputs
                contactForm.reset();

                // Re-enable submit button
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalBtnContent;
                spinStyle.remove();

                // Fade out message after 6 seconds
                setTimeout(() => {
                    formStatus.style.opacity = '0';
                    setTimeout(() => {
                        formStatus.className = 'form-status-msg';
                        formStatus.style.opacity = '';
                        formStatus.textContent = '';
                    }, 300);
                }, 6000);

            }, 1800);
        });
    }
});
