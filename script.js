// Enhanced JavaScript with SEO Optimizations

// Initialize AOS with optimized settings - wait for library to load since it's deferred
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

// Page load - removed blocking animation for faster initial render
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS when DOM is ready
    initAOS();
    
    // Create scroll progress indicator
    const scrollProgress = document.createElement('div');
    scrollProgress.className = 'scroll-progress';
    document.body.appendChild(scrollProgress);
    
    // Update scroll progress
    function updateScrollProgress() {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = window.pageYOffset;
        const progress = (scrolled / windowHeight) * 100;
        scrollProgress.style.width = progress + '%';
    }
    
    window.addEventListener('scroll', updateScrollProgress, { passive: true });
    updateScrollProgress();
    // Initialize Menu Toggle Functionality
    function initMenuToggle() {
        const menuToggle = document.querySelector('.menu-toggle');
        const menuOverlay = document.getElementById('menuOverlay');
        const menuItems = document.querySelectorAll('.staggered-item');
        
        if (!menuToggle || !menuOverlay) return;
        
        let isMenuOpen = false;
        
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
        
        // Helper function to wait for layout stability
        function waitForLayoutStability(callback, maxWait = 1000) {
            let lastHeight = document.body.scrollHeight;
            let lastWidth = document.body.scrollWidth;
            let stableCount = 0;
            const requiredStableFrames = 3; // Require 3 consecutive stable frames
            const startTime = Date.now();
            
            function checkStability() {
                const currentHeight = document.body.scrollHeight;
                const currentWidth = document.body.scrollWidth;
                const elapsed = Date.now() - startTime;
                
                // If layout hasn't changed, increment stable count
                if (currentHeight === lastHeight && currentWidth === lastWidth) {
                    stableCount++;
                } else {
                    stableCount = 0; // Reset if layout changed
                }
                
                lastHeight = currentHeight;
                lastWidth = currentWidth;
                
                // If layout is stable or max wait time reached, execute callback
                if (stableCount >= requiredStableFrames || elapsed >= maxWait) {
                    callback();
                } else {
                    requestAnimationFrame(checkStability);
                }
            }
            
            requestAnimationFrame(checkStability);
        }
        
        // Helper function to preload images in a section
        function preloadSectionImages(section) {
            const images = section.querySelectorAll('img');
            const imagePromises = [];
            
            images.forEach(img => {
                // Check if image is lazy-loaded and not yet loaded
                if (img.loading === 'lazy' && !img.complete && img.src) {
                    const promise = new Promise((resolve) => {
                        if (img.complete) {
                            resolve();
                            return;
                        }
                        
                        // Force load by temporarily removing lazy loading attribute
                        // This tells the browser to load the image immediately
                        const wasLazy = img.loading === 'lazy';
                        if (wasLazy) {
                            img.loading = 'eager';
                        }
                        
                        // Handle data-src if present
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                        }
                        
                        // Wait for image to load
                        const onLoad = () => {
                            resolve();
                        };
                        const onError = () => {
                            resolve(); // Resolve on error too to not block
                        };
                        
                        img.addEventListener('load', onLoad, { once: true });
                        img.addEventListener('error', onError, { once: true });
                        
                        // Timeout to not block indefinitely (200ms should be enough for most images)
                        setTimeout(() => {
                            img.removeEventListener('load', onLoad);
                            img.removeEventListener('error', onError);
                            resolve();
                        }, 300);
                    });
                    imagePromises.push(promise);
                } else if (!img.complete && img.src) {
                    // Also handle non-lazy images that aren't loaded yet
                    const promise = new Promise((resolve) => {
                        if (img.complete) {
                            resolve();
                            return;
                        }
                        
                        img.addEventListener('load', resolve, { once: true });
                        img.addEventListener('error', resolve, { once: true });
                        setTimeout(resolve, 200);
                    });
                    imagePromises.push(promise);
                }
            });
            
            // Return promise that resolves when all images are loaded or timeout
            // If no images to load, return immediately resolved promise
            return imagePromises.length > 0 ? Promise.all(imagePromises) : Promise.resolve();
        }
        
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
                        
                        // Wait for menu close animation, then preload images and wait for layout stability
                        setTimeout(() => {
                            // Preload images in the target section to prevent layout shifts
                            preloadSectionImages(targetElement).then(() => {
                                // Wait for layout to stabilize (handles any remaining layout shifts)
                                waitForLayoutStability(() => {
                                    // Double RAF to ensure everything is ready
                                    requestAnimationFrame(() => {
                                        requestAnimationFrame(() => {
                                            // Calculate position manually for more control
                                            const nav = document.querySelector('nav');
                                            const navHeight = nav ? nav.offsetHeight : 100;
                                            const rect = targetElement.getBoundingClientRect();
                                            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                                            const targetPosition = rect.top + scrollTop - navHeight;
                                            
                                            // Scroll to calculated position
                                            window.scrollTo({
                                                top: Math.max(0, targetPosition),
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
                                    });
                                }, 300); // Max 300ms wait for layout stability after images load
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
    
    // Smooth scroll enhancement with easing
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
            
            function easeInOutCubic(t) {
                return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
            }
            
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
    
    // Enhanced smooth scrolling for navigation links - faster for snappier feel
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
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
    
    // Nav logo links - scroll to top
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
    
    // Premium Section Animation System with Parallax
    function initSectionAnimations() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        // If reduced motion, show all sections immediately
        if (prefersReducedMotion) {
            document.querySelectorAll('.animate-section').forEach(section => {
                section.classList.add('animated');
            });
            return;
        }
        
        // Create Intersection Observer for sections
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
        
        // Subtle parallax effect for logos only (not gallery images to avoid conflicts)
        if (!prefersReducedMotion) {
            const parallaxElements = document.querySelectorAll('.logo');
            let ticking = false;
            
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
            
            function requestTick() {
                if (!ticking) {
                    window.requestAnimationFrame(updateParallax);
                    ticking = true;
                }
            }
            
            window.addEventListener('scroll', requestTick, { passive: true });
        }
    }
    
    // Initialize section animations - use requestIdleCallback for better performance
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initSectionAnimations(), { timeout: 2000 });
    } else {
        // Fallback for browsers without requestIdleCallback
        setTimeout(initSectionAnimations, 100);
    }
    
    // Note: Smooth scrolling is now handled above with enhanced easing

    // Track section views for analytics (separate from animations) - defer for performance
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

    // Lazy loading is now handled directly in HTML with loading="lazy" attributes
    // This is more efficient than JavaScript-based lazy loading
    // Fallback for older browsers that don't support native lazy loading
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

    // Mobile optimization enhancements (SEO improvement #8) - defer for performance
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
    
    // Run mobile optimization on load and resize - throttle resize events
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

    // Breadcrumb navigation enhancement (SEO improvement #12) - defer for performance
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
    
    // Update breadcrumbs on scroll and hash change - use passive listeners and throttle
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
    
    // Schema.org structured data enhancement (SEO improvement #5)
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

    // Form submission handling with enhanced tracking
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

    // KPI details animation
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
    
    // Check if site is being indexed by search engines
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(navigator.userAgent);
    if (isBot) {
        // Ensure critical content is fully rendered for search engine crawlers
        document.querySelectorAll('[data-aos]').forEach(el => {
            el.removeAttribute('data-aos');
            el.classList.add('fade-in');
        });
    }

    // StreamTV Image Gallery - Simplified Implementation
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
        
        // Simple function to show image by index
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
        
        // Navigation functions
        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        }
        
        function prevImage() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }
        
        // Button event listeners
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
        
        // Keyboard navigation
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
            
            // Touch/swipe support for mobile
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
        
        // Initialize: Check if first image already has active class, if not add it
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
        
        // Make container focusable for keyboard navigation
        container.setAttribute('tabindex', '0');
        
        // Track gallery interactions for analytics
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
    
    // Initialize the gallery - defer for better initial load performance
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => initStreamTVGallery(), { timeout: 2000 });
    } else {
        setTimeout(initStreamTVGallery, 200);
    }
    
    // YouTube Video Link - opens in new tab (no modal needed)
    // The link is already in the HTML, just ensure it works properly
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

// Add page load time tracking for performance monitoring
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