/**
 * Kbd (Keyboard) Component
 *
 * Interactive keyboard key functionality.
 */

function initKbd(container) {
  // Handle interactive keys
  const interactiveKeys = container.querySelectorAll('.kbd--interactive');

  interactiveKeys.forEach(key => {
    key.addEventListener('mousedown', () => {
      key.classList.add('is-pressed');
    });

    key.addEventListener('mouseup', () => {
      key.classList.remove('is-pressed');
    });

    key.addEventListener('mouseleave', () => {
      key.classList.remove('is-pressed');
    });

    // Keyboard accessibility
    key.setAttribute('tabindex', '0');
    key.setAttribute('role', 'button');

    key.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        key.classList.add('is-pressed');
      }
    });

    key.addEventListener('keyup', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        key.classList.remove('is-pressed');
        key.click();
      }
    });
  });

  // Animate keys when their actual keyboard key is pressed
  const animatableKeys = container.querySelectorAll('.kbd:not(.kbd--interactive)');

  document.addEventListener('keydown', (e) => {
    animatableKeys.forEach(key => {
      const keyText = key.textContent.trim().toUpperCase();
      const pressedKey = e.key.toUpperCase();

      // Match single character keys
      if (keyText === pressedKey ||
          (keyText === 'CTRL' && e.ctrlKey) ||
          (keyText === 'ALT' && e.altKey) ||
          (keyText === 'SHIFT' && e.shiftKey) ||
          (keyText === 'META' && e.metaKey) ||
          (keyText === 'ESC' && e.key === 'Escape') ||
          (keyText === 'ENTER' && e.key === 'Enter') ||
          (keyText === 'TAB' && e.key === 'Tab') ||
          (keyText === 'SPACE' && e.key === ' ')) {
        key.classList.add('is-pressed');
      }
    });
  });

  document.addEventListener('keyup', (e) => {
    animatableKeys.forEach(key => {
      key.classList.remove('is-pressed');
    });
  });
}
