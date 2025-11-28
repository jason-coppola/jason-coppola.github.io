/**
 * Enhanced JavaScript with SEO Optimizations
 * 
 * This file handles all interactive functionality for the portfolio site including:
 * - Menu toggle and navigation
 * - Smooth scrolling
 * - Section animations
 * - Image gallery controls
 * - Analytics tracking
 * - Performance optimizations
 */

/**
 * Initialize AOS (Animate On Scroll) library
 * Waits for the deferred library to load before initializing
 * @returns {void}
 */
function initAOS() {
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true,
      mirror: false,
      disable: 'mobile' // Disable on mobile for better performance
    });
  } else {
    // Retry if AOS hasn't loaded yet (for deferred scripts)
    setTimeout(initAOS, 50);
  }
}

/**
 * Main initialization - runs when DOM is ready
 * Removed blocking animations for faster initial render
 */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS when DOM is ready
    initAOS();
    
    /**
     * Scroll Progress Indicator
     * Creates a visual progress bar at the top of the page showing scroll position
     */
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    /**
     * Update scroll progress bar width based on scroll position
     * @returns {void}
     */
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / windowHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }
    
    // Update progress on scroll (using passive listener for better performance)
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    
    /**
     * Menu Toggle Functionality
     * Handles opening/closing the mobile menu overlay with smooth animations
     * @returns {void}
     */
    function initMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuItems = document.querySelectorAll('.staggered-item');
        
        // Exit early if menu elements don't exist
        if (!menuToggle || !menuOverlay) return;
        
        let isMenuOpen = false;
        
        /**
         * Toggle menu open/closed state
         * Updates ARIA attributes, prevents body scroll when open, and animates menu items
         * @returns {void}
         */
        function toggleMenu() {
            isMenuOpen = !isMenuOpen;
            menuToggle.setAttribute('aria-expanded', isMenuOpen);
            menuOverlay.classList.toggle('active');
            
            // Prevent body scroll when menu is open
            if (isMenuOpen) {
                document.body.style.overflow = 'hidden';
                // Animate menu items when menu opens
                animateMenuItems();
            } else {
                document.body.style.overflow = '';
                // Reset menu items for next opening
                menuItems.forEach(item => {
                    item.classList.remove('visible');
                });
            }
        }
        
        /**
         * Animate menu items with staggered delay when menu opens
         * Respects user's reduced motion preference
         * @returns {void}
         */
        function animateMenuItems() {
            // Check for reduced motion preference
            const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            
            if (prefersReducedMotion) {
                // Show all items immediately if reduced motion is preferred
                menuItems.forEach(item => {
                    item.classList.add('visible');
                });
            } else {
                // Animate items with staggered delay - start after overlay animation begins
                menuItems.forEach((item, index) => {
                    setTimeout(() => {
                        item.classList.add('visible');
                    }, 150 + (index * 80)); // 150ms initial delay + 80ms between items
                });
            }
        }
        
        // Toggle menu on button click
        menuToggle.addEventListener('click', toggleMenu);
        
        // Close menu when clicking outside the menu overlay
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !menuOverlay.contains(e.target) && !menuToggle.contains(e.target)) {
                toggleMenu();
            }
        });
        
        // Close menu when clicking on a menu link - ensure scroll happens after layout stabilizes
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            if (link) {
                link.addEventListener('click', (e) => {
                    // Only close if it's an internal link
                    if (link.getAttribute('href').startsWith('#')) {
                        e.preventDefault();
                        e.stopPropagation(); // Prevent general anchor handler from also firing
                        
                        const targetId = link.getAttribute('href');
                        const targetElement = document.querySelector(targetId);
                        
                        if (!targetElement) return;
                        
                        // Close menu immediately
                        isMenuOpen = false;
                        menuToggle.setAttribute('aria-expanded', 'false');
                        menuOverlay.classList.remove('active');
                        document.body.style.overflow = '';
                        // Reset menu items for next opening
                        menuItems.forEach(item => {
                            item.classList.remove('visible');
                        });
                        
                        // Wait for menu close animation, then scroll
                        setTimeout(() => {
                            // Use requestAnimationFrame to ensure DOM is ready
                            requestAnimationFrame(() => {
                                // Calculate scroll position accounting for fixed nav
                                const nav = document.querySelector('nav');
                                const navHeight = nav ? nav.offsetHeight : 100;
                                
                                // Get current scroll position
                                const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
                                
                                // Get element's bounding rect relative to viewport
                                const rect = targetElement.getBoundingClientRect();
                                
                                // Calculate target scroll position
                                // rect.top is relative to viewport, add current scroll to get absolute position
                                const targetScroll = rect.top + currentScroll - navHeight;
                                
                                // Scroll to calculated position
                                window.scrollTo({
                                    top: Math.max(0, targetScroll),
                                    behavior: 'smooth'
                                });
                                
                                // Track navigation for analytics
                                if (typeof gtag !== 'undefined') {
                                    gtag('event', 'internal_navigation', {
                                        'event_category': 'Internal Links',
                                        'event_label': `Clicked: ${targetId}`
                                    });
                                }
                            });
                        }, 350); // Wait 350ms for menu animation (300ms) + small buffer
                    }
                });
            }
        });
        
        // Close menu on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && isMenuOpen) {
                toggleMenu();
            }
        });
    }
    
    // Initialize menu toggle
    initMenuToggle();
    
    /**
     * Smooth scroll to target element with custom easing
     * Calculates proper offset to account for fixed navigation bar
     * @param {string} target - CSS selector for target element
     * @param {number} duration - Animation duration in milliseconds (default: 1000ms)
     * @returns {void}
     */
    function smoothScrollTo(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        // Calculate nav height dynamically for accurate offset
        const nav = document.querySelector('nav');
        const navHeight = nav ? nav.offsetHeight : 80;
        
        // Use requestAnimationFrame to ensure layout is stable before calculating position
        requestAnimationFrame(() => {
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;
            const startPosition = window.pageYOffset;
            const distance = targetPosition - startPosition;
            let startTime = null;
            
            /**
             * Cubic easing function for smooth animation
             * @param {number} t - Progress value between 0 and 1
             * @returns {number} - Eased progress value
             */
            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }
            
            /**
             * Animation frame handler
             * @param {number} currentTime - Current timestamp from requestAnimationFrame
             * @returns {void}
             */
            function animation(currentTime) {
                if (startTime === null) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const progress = Math.min(timeElapsed / duration, 1);
                const ease = easeInOutCubic(progress);
                
                window.scrollTo(0, startPosition + distance * ease);
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                }
            }
            
            requestAnimationFrame(animation);
        });
    }
    
    /**
     * Enhanced smooth scrolling for navigation links
     * Faster duration (600ms) for snappier feel
     * Skips menu items as they have their own handler
     */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            // Skip if this is a menu item (handled by menu handler)
            if (this.closest('.staggered-item') || this.closest('.menu-nav')) {
                return;
            }
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            // Use faster scroll duration for snappier feel
            smoothScrollTo(targetId, 600);
            
            // Track internal link clicks for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'internal_navigation', {
                    'event_category': 'Internal Links',
                    'event_label': `Clicked: ${targetId}`
                });
            }
        });
    });
    
    /**
     * Nav logo links - scroll to top when clicked
     * Tracks logo clicks for analytics
     */
    document.querySelectorAll('.nav-logo-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            
            // Track logo click for analytics
            if (typeof gtag !== 'undefined') {
                gtag('event', 'logo_click', {
                    'event_category': 'Navigation',
                    'event_label': 'Scroll to top'
                });
            }
        });
    });
    
    /**
     * Section Animation System with Parallax Effect
     * Uses Intersection Observer for efficient scroll-based animations
     * Applies subtle parallax to logos only (not gallery images)
     * @returns {void}
     */
    function initSectionAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // If reduced motion, show all sections immediately
        if (prefersReducedMotion) {
            document.querySelectorAll('.animate-section').forEach(section => {
                section.classList.add('animated');
            });
            return;
        }
        
        /**
         * Intersection Observer for section animations
         * Triggers when 12% of section is visible
         * Uses negative rootMargin to start animation earlier for smoother feel
         */
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Unobserve after animation to prevent re-triggering
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.12, // Trigger when 12% of section is visible
            rootMargin: '0px 0px -80px 0px' // Start animation earlier for smoother feel
        });
        
        // Observe all sections with animate-section class
        const sections = document.querySelectorAll('.animate-section');
        sections.forEach(section => {
            sectionObserver.observe(section);
            
            // Check if section is already in viewport on load (for above-the-fold content)
            const rect = section.getBoundingClientRect();
            const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
            if (isInViewport) {
                // Small delay to ensure smooth animation
                setTimeout(() => {
                    section.classList.add('animated');
                }, 100);
            }
        });
        
        // Animate intro section immediately on load (already visible)
        const introSection = document.querySelector('#intro');
        if (introSection) {
            // Small delay to ensure page is loaded
            setTimeout(() => {
                introSection.classList.add('animated');
            }, 200);
        }
        
        /**
         * Subtle parallax effect for logos only
         * Not applied to gallery images to avoid conflicts
         * Uses requestAnimationFrame for smooth performance
         */
        if (!prefersReducedMotion) {
            const parallaxElements = document.querySelectorAll('.logo');
            let ticking = false;
            
            /**
             * Update parallax transform for all logo elements
             * Only applies when element is in viewport
             * @returns {void}
             */
            function updateParallax() {
                parallaxElements.forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    const elementTop = rect.top + window.pageYOffset;
                    const elementHeight = rect.height;
                    const windowHeight = window.innerHeight;
                    const scrolled = window.pageYOffset;
                    
                    // Only apply parallax when element is in viewport
                    if (elementTop < scrolled + windowHeight && 
                        elementTop + elementHeight > scrolled) {
                        const offset = (scrolled - elementTop + windowHeight) * 0.03;
                        el.style.transform = `translateY(${offset}px)`;
                    }
                });
                
                ticking = false;
            }
            
            /**
             * Throttle parallax updates using requestAnimationFrame
             * Prevents excessive calculations during scroll
             * @returns {void}
             */
            function requestTick() {
                if (!ticking) {
                    window.requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', requestTick, { passive: true });
        }
    }
    
    /**
     * Initialize section animations
     * Uses requestIdleCallback for better performance (defers until browser is idle)
     * Falls back to setTimeout for browsers without requestIdleCallback support
     */
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initSectionAnimations(), { timeout: 2000 });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(initSectionAnimations, 100);
    }
    
    /**
     * Track section views for analytics
     * Separate from animations - defers for performance
     * Triggers when 30% of section is visible
     */
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            const analyticsObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.target.id) {
                        // Track visible sections for engagement metrics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'section_view', {
                                'event_category': 'Content Engagement',
                                'event_label': `Viewed: ${entry.target.id} section`
                            });
                        }
                        // Unobserve after tracking to prevent duplicate events
                        analyticsObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3 // Trigger when 30% of the element is visible
            });

            // Observe all sections for analytics
            document.querySelectorAll('section[id]').forEach((section) => {
                analyticsObserver.observe(section);
            });
        }, { timeout: 3000 });
    } else {
        setTimeout(() => {
            const analyticsObserver = new IntersectionObserver((entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && entry.target.id) {
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'section_view', {
                                'event_category': 'Content Engagement',
                                'event_label': `Viewed: ${entry.target.id} section`
                            });
                        }
                        analyticsObserver.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.3
            });
            document.querySelectorAll('section[id]').forEach((section) => {
                analyticsObserver.observe(section);
            });
        }, 500);
    }

    /**
     * Lazy loading fallback for older browsers
     * Modern browsers handle lazy loading natively via loading="lazy" attribute
     * This provides fallback support for browsers without native lazy loading
     */
    if (!('loading' in HTMLImageElement.prototype)) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    // Force load for browsers without native support
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    lazyImageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    /**
     * Mobile optimization enhancements
     * Optimizes gallery image quality and simplifies animations on mobile devices
     * @returns {void}
     */
    function handleMobileOptimization() {
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // Optimize gallery image quality on mobile
            document.querySelectorAll('.gallery img').forEach(img => {
                if (img.dataset.mobileSrc) {
                    img.src = img.dataset.mobileSrc;
                }
            });
            
            // Simplify animations on mobile for better performance
            document.querySelectorAll('[data-aos]').forEach(el => {
                el.setAttribute('data-aos-duration', '400');
            });
        }
    }
    
    /**
     * Throttled mobile optimization handler
     * Runs on load and resize events to optimize for mobile devices
     * Throttles resize events to prevent excessive calculations
     */
    let resizeTimeout;
    const throttledMobileOptimization = () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(handleMobileOptimization, 150);
    };
    
    if ('requestIdleCallback' in window) {
        requestIdleCallback(handleMobileOptimization, { timeout: 1000 });
    } else {
        setTimeout(handleMobileOptimization, 100);
    }
    window.addEventListener('resize', throttledMobileOptimization, { passive: true });

    /**
     * Breadcrumb navigation enhancement
     * Updates active breadcrumb state based on current section visibility
     * Defers execution for performance
     * @returns {void}
     */
    function updateBreadcrumbs() {
        const breadcrumbs = document.querySelector('.breadcrumb');
        if (!breadcrumbs) return;
        
        // Get current section from URL or visible section
        let currentSection = '';
        const hash = window.location.hash;
        
        if (hash) {
            currentSection = hash.substring(1);
        } else {
            // Find the most visible section
            let maxVisibility = 0;
            let mostVisibleSection = '';
            
            document.querySelectorAll('section[id]').forEach(section => {
                const rect = section.getBoundingClientRect();
                const sectionHeight = rect.height;
                const visibleHeight = Math.min(rect.bottom, window.innerHeight) - 
                                     Math.max(rect.top, 0);
                
                const visibilityRatio = visibleHeight / sectionHeight;
                
                if (visibilityRatio > maxVisibility) {
                    maxVisibility = visibilityRatio;
                    mostVisibleSection = section.id;
                }
            });
            
            currentSection = mostVisibleSection;
        }
        
        // Update breadcrumb active state
        document.querySelectorAll('.breadcrumb li').forEach(li => {
            const link = li.querySelector('a');
            if (link && link.getAttribute('href') === `#${currentSection}`) {
                li.classList.add('active');
            } else {
                li.classList.remove('active');
            }
        });
    }
    
    /**
     * Throttled breadcrumb update handler
     * Updates breadcrumbs on scroll and hash change
     * Uses passive listeners and throttling for performance
     */
    let breadcrumbTimeout;
    const throttledUpdateBreadcrumbs = () => {
        clearTimeout(breadcrumbTimeout);
        breadcrumbTimeout = setTimeout(updateBreadcrumbs, 100);
    };
    window.addEventListener('scroll', throttledUpdateBreadcrumbs, { passive: true });
    window.addEventListener('hashchange', updateBreadcrumbs);
    // Defer initial update
    if ('requestIdleCallback' in window) {
        requestIdleCallback(updateBreadcrumbs, { timeout: 1000 });
    } else {
        setTimeout(updateBreadcrumbs, 100);
    }
    
    /**
     * Schema.org structured data enhancement
     * Injects JSON-LD structured data for better SEO
     * Only creates script if it doesn't already exist
     * @returns {void}
     */
    function injectStructuredData() {
        const structuredData = {
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Jason Coppola",
            "jobTitle": "Product Management Executive",
            "description": "Product Management Executive with 15+ years experience in streaming media innovation",
            "url": "https://www.jasoncoppola.bio",
            "sameAs": [
                "https://www.linkedin.com/in/coppolajason/"
            ],
            "knowsAbout": ["Product Management", "Streaming Media", "Digital Transformation", "User Experience", "Global Market Expansion"],
            "worksFor": [
                {
                    "@type": "Organization",
                    "name": "CW Network",
                    "description": "American television network"
                }
            ],
            "alumniOf": [
                {
                    "@type": "Organization",
                    "name": "Disney",
                    "description": "Global entertainment company"
                },
                {
                    "@type": "Organization",
                    "name": "Paramount",
                    "description": "American global media company"
                },
                {
                    "@type": "Organization",
                    "name": "WarnerMedia",
                    "description": "American multinational mass media and entertainment conglomerate"
                },
                {
                    "@type": "Organization",
                    "name": "HBO",
                    "description": "American pay television network"
                }
            ],
            "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://www.jasoncoppola.bio"
            }
        };
        
        // Create the script element if it doesn't exist
        if (!document.querySelector('script[type="application/ld+json"]')) {
            const script = document.createElement('script');
            script.type = 'application/ld+json';
            script.textContent = JSON.stringify(structuredData);
            document.head.appendChild(script);
        }
    }
    
    injectStructuredData();

    /**
     * Form submission handling with enhanced tracking
     * Currently shows alert (replace with actual form submission logic)
     * Tracks form submissions for conversion analytics
     */
    const form = document.getElementById('contact-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            // Add your form submission logic here
            alert('Thank you for your message! I will get back to you soon.');
            form.reset();
            
            // Track form submissions for conversion tracking
            if (typeof gtag !== 'undefined') {
                gtag('event', 'form_submission', {
                    'event_category': 'Contact',
                    'event_label': 'Contact Form Submitted'
                });
            }
        });
    }

    /**
     * KPI details animation
     * Handles toggle animations for expandable KPI sections
     */
    const details = document.querySelectorAll('.kpi-list');
    details.forEach(detail => {
        detail.addEventListener('toggle', () => {
            if (detail.open) {
                setTimeout(() => {
                    detail.querySelector('.kpi-content').style.opacity = '1';
                    detail.querySelector('.kpi-content').style.transform = 'translateY(0)';
                }, 10);
            } else {
                detail.querySelector('.kpi-content').style.opacity = '0';
                detail.querySelector('.kpi-content').style.transform = 'translateY(-10px)';
            }
        });
    });
    
    /**
     * Search engine bot detection
     * Ensures critical content is fully rendered for search engine crawlers
     * Removes animation attributes that might prevent proper indexing
     */
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    if (isBot) {
        // Ensure critical content is fully rendered for search engine crawlers
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.classList.add('fade-in');
        });
    }

    /**
     * StreamTV Image Gallery - Simplified Implementation
     * Handles image carousel with navigation buttons, keyboard controls, and touch/swipe support
     * Includes analytics tracking for gallery interactions
     * @returns {void}
     */
    function initStreamTVGallery() {
        const gallery = document.querySelector('.streamtv-gallery');
        if (!gallery) return;
        
        const container = gallery.querySelector('.gallery-container');
        const images = gallery.querySelectorAll('.gallery-image');
        const prevBtn = gallery.querySelector('.prev-btn');
        const nextBtn = gallery.querySelector('.next-btn');
        const currentImageSpan = gallery.querySelector('.current-image');
        const totalImagesSpan = gallery.querySelector('.total-images');
        
        if (images.length === 0) return;
        
        let currentIndex = 0;
        
        // Set total images count
        if (totalImagesSpan) {
            totalImagesSpan.textContent = images.length;
        }
        
        /**
         * Show image by index
         * Updates active class, counter, and current index
         * @param {number} index - Zero-based index of image to show
         * @returns {void}
         */
        function showImage(index) {
            // Remove active class from all images
            images.forEach(img => img.classList.remove('active'));
            
            // Add active class to current image
            if (images[index]) {
                images[index].classList.add('active');
            }
            
            // Update counter
            if (currentImageSpan) {
                currentImageSpan.textContent = index + 1;
            }
            
            currentIndex = index;
        }
        
        /**
         * Navigate to next image (wraps to first if at end)
         * @returns {void}
         */
        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        }
        
        /**
         * Navigate to previous image (wraps to last if at beginning)
         * @returns {void}
         */
        function prevImage() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }
        
        // Button event listeners for navigation
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevImage();
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextImage();
            });
        }
        
        /**
         * Keyboard navigation support
         * Arrow keys for navigation, tabindex for focus management
         */
        if (container) {
            container.addEventListener('keydown', (e) => {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevImage();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextImage();
                }
            });
            
            /**
             * Touch/swipe support for mobile devices
             * Detects swipe gestures and navigates accordingly
             */
            let touchStartX = 0;
            let touchEndX = 0;
            
            container.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            container.addEventListener('touchend', (e) => {
                touchEndX = e.changedTouches[0].screenX;
                const diffX = touchStartX - touchEndX;
                const swipeThreshold = 50;
                
                if (Math.abs(diffX) > swipeThreshold) {
                    if (diffX > 0) {
                        nextImage(); // Swipe left = next
                    } else {
                        prevImage(); // Swipe right = previous
                    }
                }
            }, { passive: true });
            
            // Make container focusable for keyboard navigation
            container.setAttribute('tabindex', '0');
        }
        
        /**
         * Initialize gallery state
         * Checks if first image already has active class, otherwise sets it
         */
        const firstImage = images[0];
        if (firstImage && !firstImage.classList.contains('active')) {
            showImage(0);
        } else {
            // First image already has active class, just set currentIndex
            currentIndex = 0;
            if (currentImageSpan) {
                currentImageSpan.textContent = 1;
            }
        }
        
        /**
         * Track gallery interactions for analytics
         * Records navigation button clicks for engagement metrics
         */
        if (typeof gtag !== 'undefined') {
            [prevBtn, nextBtn].forEach(btn => {
                if (btn) {
                    btn.addEventListener('click', () => {
                        gtag('event', 'gallery_interaction', {
                            'event_category': 'Content Engagement',
                            'event_label': 'StreamTV Gallery Navigation'
                        });
                    });
                }
            });
        }
    }
    
    /**
     * Initialize the gallery
     * Defers execution for better initial load performance
     * Uses requestIdleCallback when available, falls back to setTimeout
     */
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initStreamTVGallery(), { timeout: 2000 });
    } else {
        setTimeout(initStreamTVGallery, 200);
    }
    
    /**
     * YouTube Video Link tracking
     * The link opens in new tab (no modal needed)
     * Tracks clicks for analytics
     */
    const youtubeLink = document.querySelector('.youtube-thumbnail-link');
    if (youtubeLink) {
        // Track clicks for analytics
        youtubeLink.addEventListener('click', () => {
            if (typeof gtag !== 'undefined') {
                gtag('event', 'youtube_video_click', {
                    'event_category': 'Video',
                    'event_label': 'Stream TV 2025 Video',
                    'transport_type': 'beacon'
                });
            }
        });
    }
});

/**
 * Page load time tracking for performance monitoring
 * Measures and reports page load time to analytics
 * Runs after all resources are loaded
 */
window.addEventListener('load', () => {
    setTimeout(() => {
        const performanceData = window.performance.timing;
        const pageLoadTime = performanceData.loadEventEnd - performanceData.navigationStart;
        
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'name': 'page_load',
                'value': pageLoadTime,
                'event_category': 'Performance'
            });
        }
        
        // Log to console in development
        console.log(`Page load time: ${pageLoadTime}ms`);
    }, 0);
});