// ... existing JavaScript ...

// Initialize AOS
AOS.init({
  duration: 800,
  easing: 'ease-in-out',
  once: true,
  mirror: false
});

document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Fade-in animation for sections
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    });

    document.querySelectorAll('section').forEach((section) => {
        observer.observe(section);
    });

    // Typing effect for hero section
    /*
    const heroText = "Digital Innovator & Strategic Leader";
    const heroSubtitle = document.querySelector('.hero h2');
    let i = 0;

    function typeWriter() {
        if (i < heroText.length) {
            heroSubtitle.innerHTML += heroText.charAt(i);
            i++;
            setTimeout(typeWriter, 50);
        }
    }

    typeWriter();
    */

    // Form submission handling
    const form = document.getElementById('contact-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        // Add your form submission logic here
        alert('Thank you for your message! I will get back to you soon.');
        form.reset();
    });

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
});
