// Enhanced JavaScript with SEO Optimizations

// Initialize AOS with optimized settings
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false,
  disable: 'mobile' // Disable on mobile for better performance
});

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links with enhanced tracking
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });
            
            // Track internal link clicks for analytics (SEO improvement #7)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'internal_navigation', {
                    'event_category': 'Internal Links',
                    'event_label': `Clicked: ${targetId}`
                });
            }
        });
    });

    // Enhanced fade-in animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                
                // Track visible sections for engagement metrics
                if (typeof gtag !== 'undefined' && entry.target.id) {
                    gtag('event', 'section_view', {
                        'event_category': 'Content Engagement',
                        'event_label': `Viewed: ${entry.target.id} section`
                    });
                }
            }
        });
    }, {
        threshold: 0.2 // Trigger when 20% of the element is visible
    });

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Implement lazy loading for images (SEO improvement #9)
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        document.querySelectorAll('img').forEach(img => {
            if (!img.hasAttribute('loading') && !img.classList.contains('critical')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Fallback for browsers that don't support native lazy loading
        const lazyImages = document.querySelectorAll('img[data-src]');
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    lazyImageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            lazyImageObserver.observe(img);
        });
    }

    // Mobile optimization enhancements (SEO improvement #8)
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
    
    // Run mobile optimization on load and resize
    handleMobileOptimization();
    window.addEventListener('resize', handleMobileOptimization);

    // Breadcrumb navigation enhancement (SEO improvement #12)
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
    
    // Update breadcrumbs on scroll and hash change
    window.addEventListener('scroll', updateBreadcrumbs);
    window.addEventListener('hashchange', updateBreadcrumbs);
    updateBreadcrumbs();
    
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

    // StreamTV Image Gallery functionality
    function initStreamTVGallery() {
        const gallery = document.querySelector('.streamtv-gallery');
        if (!gallery) return;
        
        const images = gallery.querySelectorAll('.gallery-image');
        const prevBtn = gallery.querySelector('.prev-btn');
        const nextBtn = gallery.querySelector('.next-btn');
        const currentImageSpan = gallery.querySelector('.current-image');
        const totalImagesSpan = gallery.querySelector('.total-images');
        
        let currentIndex = 0;
        // let autoPlayInterval; // Removed auto-rotation
        
        // Set total images count
        if (totalImagesSpan) {
            totalImagesSpan.textContent = images.length;
        }
        
        function showImage(index) {
            // Remove active class from all images
            images.forEach(img => img.classList.remove('active'));
            
            // Add active class to current image
            images[index].classList.add('active');
            
            // Update image counter
            if (currentImageSpan) {
                currentImageSpan.textContent = index + 1;
            }
            
            currentIndex = index;
        }
        
        function nextImage() {
            const nextIndex = (currentIndex + 1) % images.length;
            showImage(nextIndex);
        }
        
        function prevImage() {
            const prevIndex = (currentIndex - 1 + images.length) % images.length;
            showImage(prevIndex);
        }
        
        // function startAutoPlay() {
        //     autoPlayInterval = setInterval(nextImage, 5000); // Change image every 5 seconds
        // }
        
        // function stopAutoPlay() {
        //     if (autoPlayInterval) {
        //         clearInterval(autoPlayInterval);
        //     }
        // }
        
        // Event listeners for overlay buttons
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                prevImage();
                // stopAutoPlay();
                // startAutoPlay(); // Restart autoplay
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                nextImage();
                // stopAutoPlay();
                // startAutoPlay(); // Restart autoplay
            });
        }
        
        // Pause autoplay on hover - removed since no autoplay
        // gallery.addEventListener('mouseenter', stopAutoPlay);
        // gallery.addEventListener('mouseleave', startAutoPlay);
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (gallery.matches(':hover') || gallery.matches(':focus-within')) {
                if (e.key === 'ArrowLeft') {
                    e.preventDefault();
                    prevImage();
                    // stopAutoPlay();
                    // startAutoPlay();
                } else if (e.key === 'ArrowRight') {
                    e.preventDefault();
                    nextImage();
                    // stopAutoPlay();
                    // startAutoPlay();
                }
            }
        });
        
        // Touch/swipe support for mobile
        let touchStartX = 0;
        let touchEndX = 0;
        let touchStartY = 0;
        let touchEndY = 0;
        
        gallery.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        });
        
        gallery.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            handleSwipe();
        });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            const diffX = touchStartX - touchEndX;
            const diffY = touchStartY - touchEndY;
            
            // Only handle horizontal swipes (ignore vertical scrolling)
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > swipeThreshold) {
                if (diffX > 0) {
                    // Swipe left - next image
                    nextImage();
                } else {
                    // Swipe right - previous image
                    prevImage();
                }
                // stopAutoPlay();
                // startAutoPlay();
            }
        }
        
        // Start autoplay - removed
        // startAutoPlay();
        
        // Track gallery interactions for analytics
        gallery.addEventListener('click', (e) => {
            if (e.target.classList.contains('gallery-btn')) {
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'gallery_interaction', {
                        'event_category': 'Content Engagement',
                        'event_label': 'StreamTV Gallery Navigation'
                    });
                }
            }
        });
        
        // Handle visibility change to pause autoplay when tab is not active - removed
        // document.addEventListener('visibilitychange', () => {
        //     if (document.hidden) {
        //         stopAutoPlay();
        //     } else {
        //         startAutoPlay();
        //     }
        // });
    }
    
    // Initialize the gallery
    initStreamTVGallery();
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