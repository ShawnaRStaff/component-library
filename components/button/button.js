/**
 * Button Component JavaScript
 *
 * Optional enhancements for button behavior.
 * Most buttons work fine with just HTML + CSS.
 */

function initButton(container) {
  // Demo: Toggle loading state
  const loadingBtns = container.querySelectorAll('[data-demo-loading]');
  loadingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      btn.classList.add('btn--loading');
      setTimeout(() => {
        btn.classList.remove('btn--loading');
      }, 2000);
    });
  });

  // Demo: Toggle button state
  const toggleBtns = container.querySelectorAll('[data-demo-toggle]');
  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isActive = btn.getAttribute('aria-pressed') === 'true';
      btn.setAttribute('aria-pressed', !isActive);
      btn.classList.toggle('btn--primary', !isActive);
    });
  });
}
