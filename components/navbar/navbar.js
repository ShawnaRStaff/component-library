/**
 * Navbar Component JavaScript
 * Handles mobile drawer, dropdowns, and scroll behavior
 */

function initNavbar(container) {
  const navbars = container.querySelectorAll('.navbar');

  navbars.forEach(navbar => {
    const toggle = navbar.querySelector('.navbar__toggle');
    const overlay = navbar.querySelector('.navbar__overlay');
    const dropdowns = navbar.querySelectorAll('.navbar__dropdown');

    // Mobile menu toggle
    if (toggle) {
      toggle.addEventListener('click', () => {
        const isOpen = navbar.classList.toggle('is-open');
        toggle.setAttribute('aria-expanded', isOpen);
        document.body.classList.toggle('navbar-open', isOpen);
      });
    }

    // Overlay click closes menu
    if (overlay) {
      overlay.addEventListener('click', () => {
        closeMenu();
      });
    }

    // Close menu when clicking a nav link (mobile)
    const navLinks = navbar.querySelectorAll('.navbar__link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          closeMenu();
        }
      });
    });

    // Dropdowns
    dropdowns.forEach(dropdown => {
      const dropdownToggle = dropdown.querySelector('.navbar__dropdown-toggle');

      if (dropdownToggle) {
        dropdownToggle.addEventListener('click', (e) => {
          e.preventDefault();
          e.stopPropagation();

          // Close other dropdowns
          dropdowns.forEach(other => {
            if (other !== dropdown) {
              other.classList.remove('is-open');
            }
          });

          dropdown.classList.toggle('is-open');
        });
      }
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
      if (!navbar.contains(e.target)) {
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('is-open');
        });
      }
    });

    // Keyboard support
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMenu();
        dropdowns.forEach(dropdown => {
          dropdown.classList.remove('is-open');
        });
      }
    });

    // Close mobile menu on window resize to desktop
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        closeMenu();
      }
    });

    function closeMenu() {
      navbar.classList.remove('is-open');
      if (toggle) {
        toggle.setAttribute('aria-expanded', 'false');
      }
      document.body.classList.remove('navbar-open');
    }

    // Optional: Hide/show navbar on scroll
    if (navbar.dataset.hideOnScroll !== undefined) {
      let lastScrollY = window.scrollY;
      let ticking = false;

      window.addEventListener('scroll', () => {
        if (!ticking) {
          window.requestAnimationFrame(() => {
            const currentScrollY = window.scrollY;

            if (currentScrollY > lastScrollY && currentScrollY > 100) {
              navbar.style.transform = 'translateY(-100%)';
            } else {
              navbar.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
            ticking = false;
          });
          ticking = true;
        }
      });

      navbar.style.transition = 'transform 0.3s ease';
    }
  });
}
