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
 * Helper function to safely use requestIdleCallback with fallback
 * Provides consistent API for deferring non-critical work across all browsers
 * @param {Function} callback - Function to execute
 * @param {Object} options - Options object with timeout property (max wait time in ms)
 * @returns {void}
 */
function safeIdleCallback(callback, options = { timeout: 2000 }) {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(callback, options);
  } else {
    // Fallback for browsers without requestIdleCallback support
    // Use Math.min to cap fallback delay at 100ms for better UX (don't wait full timeout)
    setTimeout(callback, Math.min(options.timeout || 2000, 100));
  }
}

/**
 * Wait for fonts to load to prevent layout shifts
 * @returns {Promise<void>}
 */
function waitForFonts() {
  if (document.fonts && document.fonts.ready) {
    return document.fonts.ready;
  }
  // Fallback for browsers without Font Loading API
  return new Promise((resolve) => {
    if (document.readyState === 'complete') {
      // Give fonts time to load
      setTimeout(resolve, 100);
    } else {
      window.addEventListener('load', () => {
        setTimeout(resolve, 100);
      });
    }
  });
}

/**
 * Wait for page to be fully rendered
 * Ensures layout is stable before scroll calculations
 * @returns {Promise<void>}
 */
function waitForRender() {
  return new Promise((resolve) => {
    // Wait for fonts first
    waitForFonts().then(() => {
      // Then wait for next frame to ensure layout is calculated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          resolve();
        });
      });
    });
  });
}

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
 * Track if page is fully loaded and ready for scroll calculations
 * This prevents scroll calculations before fonts and layout are stable
 */
let pageReady = false;

/**
 * Mark page as ready once fonts and layout are stable
 */
function markPageReady() {
    waitForRender().then(() => {
        pageReady = true;
    });
}

/**
 * Main initialization - runs when DOM is ready
 * Removed blocking animations for faster initial render
 */
document.addEventListener('DOMContentLoaded', () => {
    // Mark page as ready in the background
    markPageReady();
    
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
     * Optimized with requestAnimationFrame for smooth performance
     * @returns {void}
     */
    let scrollProgressTicking = false;
    function updateScrollProgress() {
        if (!scrollProgressTicking) {
            window.requestAnimationFrame(() => {
                const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                const progress = windowHeight > 0 ? (scrolled / windowHeight) * 100 : 0;
                scrollProgress.style.width = Math.min(100, Math.max(0, progress)) + '%';
                scrollProgressTicking = false;
            });
            scrollProgressTicking = true;
        }
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
                        // Optimized scroll calculation to reduce layout thrashing
                        setTimeout(() => {
                            // If page isn't ready yet (first load), wait a bit longer
                            const scrollDelay = pageReady ? 0 : 200;
                            
                            setTimeout(() => {
                                // Use requestAnimationFrame for optimal timing
                                requestAnimationFrame(() => {
                                    // Batch DOM reads to prevent layout thrashing
                                    const nav = document.querySelector('nav');
                                    const navHeight = nav ? Math.ceil(nav.getBoundingClientRect().height) : 100;
                                    
                                    // Use offsetTop for better performance (no layout recalculation needed)
                                    let elementTop = targetElement.offsetTop;
                                    
                                    // Fallback to getBoundingClientRect if offsetTop is not reliable
                                    if (elementTop === 0 || isNaN(elementTop)) {
                                        const rect = targetElement.getBoundingClientRect();
                                        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                                        elementTop = rect.top + scrollTop;
                                    }
                                    
                                    // Calculate target scroll: element top - nav height - small buffer
                                    const buffer = 20; // Extra spacing for visual clarity
                                    const targetScroll = Math.max(0, elementTop - navHeight - buffer);
                                    
                                    // Scroll to target position
                                    window.scrollTo({
                                        top: targetScroll,
                                        behavior: 'smooth'
                                    });
                                    
                                    // Track navigation for analytics (defer to avoid blocking)
                                    if (typeof gtag !== 'undefined') {
                                        safeIdleCallback(() => {
                                            gtag('event', 'internal_navigation', {
                                                'event_category': 'Internal Links',
                                                'event_label': `Clicked: ${targetId}`
                                            });
                                        }, { timeout: 1000 });
                                    }
                                });
                            }, scrollDelay);
                        }, 400); // Wait for menu animation to complete (300ms) + buffer
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
     * Optimized to reduce layout calculations and improve performance
     * @param {string} target - CSS selector for target element
     * @param {number} duration - Animation duration in milliseconds (default: 1000ms)
     * @returns {void}
     */
    function smoothScrollTo(target, duration = 1000) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        // Use requestAnimationFrame for optimal timing
        requestAnimationFrame(() => {
            // Batch DOM reads to prevent layout thrashing
            const nav = document.querySelector('nav');
            const navHeight = nav ? Math.ceil(nav.getBoundingClientRect().height) : 100;
            
            // Prefer offsetTop for better performance (no layout recalculation)
            let elementTop = targetElement.offsetTop;
            
            // Fallback to getBoundingClientRect if offsetTop is not reliable
            if (elementTop === 0 || isNaN(elementTop)) {
                const rect = targetElement.getBoundingClientRect();
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                elementTop = rect.top + scrollTop;
            }
            
            // Calculate target position with buffer for visual clarity
            const buffer = 20;
            const targetPosition = Math.max(0, elementTop - navHeight - buffer);
            const startPosition = window.pageYOffset || document.documentElement.scrollTop;
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
         * Optimized with better threshold and rootMargin for performance
         * Triggers when 10% of section is visible for faster perceived performance
         */
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    // Unobserve after animation to prevent re-triggering and free memory
                    sectionObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1, // Trigger when 10% of section is visible (reduced from 0.12 for better performance)
            rootMargin: '0px 0px -50px 0px' // Reduced margin for better performance
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
         * Optimized with Intersection Observer to only update visible elements
         * Not applied to gallery images to avoid conflicts
         * Uses requestAnimationFrame for smooth performance
         */
        if (!prefersReducedMotion) {
            const parallaxElements = document.querySelectorAll('.logo');
            let ticking = false;
            const visibleElements = new Set();
            
            // Use Intersection Observer to track which elements are visible
            const parallaxObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        visibleElements.add(entry.target);
                    } else {
                        visibleElements.delete(entry.target);
                    }
                });
            }, {
                rootMargin: '50px' // Preload slightly before viewport
            });
            
            parallaxElements.forEach(el => parallaxObserver.observe(el));
            
            /**
             * Update parallax transform for visible logo elements only
             * Optimized to only process elements in viewport
             * @returns {void}
             */
            function updateParallax() {
                if (visibleElements.size === 0) {
                    ticking = false;
                    return;
                }
                
                const scrolled = window.pageYOffset || document.documentElement.scrollTop;
                const windowHeight = window.innerHeight;
                
                visibleElements.forEach((el) => {
                    const rect = el.getBoundingClientRect();
                    const elementTop = rect.top + scrolled;
                    
                    // Only apply parallax when element is in viewport
                    if (elementTop < scrolled + windowHeight && 
                        elementTop + rect.height > scrolled) {
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
    safeIdleCallback(() => initSectionAnimations(), { timeout: 2000 });
    
    /**
     * Track section views for analytics
     * Separate from animations - defers for performance
     * Triggers when 30% of section is visible
     */
    safeIdleCallback(() => {
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

    /**
     * Lazy loading fallback for older browsers
     * Modern browsers handle lazy loading natively via loading="lazy" attribute
     * This provides fallback support for browsers without native lazy loading
     * Optimized with better Intersection Observer settings
     */
    if (!('loading' in HTMLImageElement.prototype)) {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        if (lazyImages.length > 0) {
            const lazyImageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        // Force load for browsers without native support
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        // Unobserve after loading to free memory
                        lazyImageObserver.unobserve(img);
                    }
                });
            }, {
                // Start loading images slightly before they enter viewport
                rootMargin: '50px',
                // Trigger when 10% of image is visible
                threshold: 0.1
            });
            
            lazyImages.forEach(img => {
                lazyImageObserver.observe(img);
            });
        }
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
    
    safeIdleCallback(handleMobileOptimization, { timeout: 1000 });
    window.addEventListener('resize', throttledMobileOptimization, { passive: true });

    /**
     * Note: Breadcrumb navigation code removed - not used in HTML
     * If breadcrumbs are needed in the future, this code can be restored
     */
    
    /**
     * Note: Schema.org structured data is already included in the HTML
     * (see index.html lines 373-419) for better SEO and faster initial load.
     * No JavaScript injection needed.
     */

    /**
     * Note: Form submission and KPI code removed - not used in HTML
     * If these features are needed in the future, this code can be restored
     */
    
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
     * StreamTV Image Gallery - Optimized Implementation
     * Handles image carousel with navigation buttons, keyboard controls, and touch/swipe support
     * Includes lazy loading for non-visible images and analytics tracking
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
        const loadedImages = new Set([0]); // Track which images have been loaded
        
        // Set total images count
        if (totalImagesSpan) {
            totalImagesSpan.textContent = images.length;
        }
        
        /**
         * Preload adjacent images for smoother navigation
         * @param {number} index - Current image index
         * @returns {void}
         */
        function preloadAdjacentImages(index) {
            const nextIndex = (index + 1) % images.length;
            const prevIndex = (index - 1 + images.length) % images.length;
            
            // Preload next image
            if (!loadedImages.has(nextIndex) && images[nextIndex]) {
                const img = images[nextIndex];
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                loadedImages.add(nextIndex);
            }
            
            // Preload previous image
            if (!loadedImages.has(prevIndex) && images[prevIndex]) {
                const img = images[prevIndex];
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }
                loadedImages.add(prevIndex);
            }
        }
        
        /**
         * Show image by index
         * Updates active class, counter, and current index
         * Preloads adjacent images for smooth navigation
         * @param {number} index - Zero-based index of image to show
         * @returns {void}
         */
        function showImage(index) {
            // Remove active class from all images
            images.forEach(img => img.classList.remove('active'));
            
            // Add active class to current image
            if (images[index]) {
                images[index].classList.add('active');
                loadedImages.add(index);
            }
            
            // Update counter
            if (currentImageSpan) {
                currentImageSpan.textContent = index + 1;
            }
            
            currentIndex = index;
            
            // Preload adjacent images for smoother navigation
            safeIdleCallback(() => preloadAdjacentImages(index), { timeout: 500 });
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
    safeIdleCallback(() => initStreamTVGallery(), { timeout: 2000 });
    
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
    // Ensure page is marked as ready after all resources load
    markPageReady();
    
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