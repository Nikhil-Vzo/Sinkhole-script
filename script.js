document.addEventListener('DOMContentLoaded', () => {
    // Loading Screen Logic
    const loadingScreen = document.getElementById('loading-screen');
    if (loadingScreen) {
        // Hold the screen for 3 seconds of animation, then fade out
        setTimeout(() => {
            loadingScreen.classList.add('hidden');
            // Re-enable scrolling on the body once hidden
            document.body.style.overflow = '';
        }, 3200);
    }

    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.getElementById('mobile-menu-btn');
    const menuIconRect = '<rect x="3" y="12" width="18" height="2" fill="currentColor"></rect><rect x="3" y="6" width="18" height="2" fill="currentColor"></rect><rect x="3" y="18" width="18" height="2" fill="currentColor"></rect>';
    const closeIconPath = '<line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" stroke-width="2"></line><line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" stroke-width="2"></line>';

    // Create an overlay for mobile menu
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Mobile Menu Toggle logic
    let isMenuOpen = false;

    function toggleMenu() {
        isMenuOpen = !isMenuOpen;
        if (isMenuOpen) {
            sidebar.classList.add('open');
            overlay.classList.add('open');
            menuBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24">${closeIconPath}</svg>`;
            document.body.style.overflow = 'hidden'; // Prevent scroll when nav is open
        } else {
            sidebar.classList.remove('open');
            overlay.classList.remove('open');
            menuBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24">${menuIconRect}</svg>`;
            document.body.style.overflow = '';
        }
    }

    menuBtn.addEventListener('click', toggleMenu);
    overlay.addEventListener('click', toggleMenu);

    // Initial setup of icon
    menuBtn.innerHTML = `<svg viewBox="0 0 24 24" width="24" height="24">${menuIconRect}</svg>`;

    // Smooth Scrolling & Close menu on click for links
    document.querySelectorAll('#scene-nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            if(this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                const targetEl = document.getElementById(targetId);
                
                if (targetEl) {
                    window.scrollTo({
                        top: targetEl.offsetTop - 50,
                        behavior: 'smooth'
                    });
                }
                if (isMenuOpen) toggleMenu();
            }
        });
    });

    // Intersection Observer for scroll spy (updating active nav link)
    const sceneBlocks = document.querySelectorAll('.scene-block');
    const navLinks = document.querySelectorAll('#scene-nav a');

    // Observer for Active Navigation Links
    const activeNavOptions = {
        root: null,
        rootMargin: '-30% 0px -70% 0px',
        threshold: 0
    };

    const activeNavObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Remove active class from all
                navLinks.forEach(link => link.classList.remove('active'));
                
                // Add active to current
                const activeLink = document.querySelector(`#scene-nav a[href="#${entry.target.id}"]`);
                if (activeLink) activeLink.classList.add('active');
            }
        });
    }, activeNavOptions);

    // Observer for Reveal Animation
    const revealOptions = {
        root: null,
        rootMargin: '0px 0px -10% 0px',
        threshold: 0.1
    };

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Reveal only once
            }
        });
    }, revealOptions);

    sceneBlocks.forEach(block => {
        activeNavObserver.observe(block);
        revealObserver.observe(block);
    });
});
