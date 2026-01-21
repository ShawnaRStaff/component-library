/**
 * Input Component JavaScript
 *
 * Optional enhancements for input behavior.
 */

function initInput(container) {
  // Clear button functionality
  const clearButtons = container.querySelectorAll('[data-input-clear]');
  clearButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input-wrapper');
      const input = wrapper?.querySelector('.input');
      if (input) {
        input.value = '';
        input.focus();
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
  });

  // Password visibility toggle
  const passwordToggles = container.querySelectorAll('[data-password-toggle]');
  passwordToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.input-wrapper');
      const input = wrapper?.querySelector('.input');
      if (input) {
        const isPassword = input.type === 'password';
        input.type = isPassword ? 'text' : 'password';
        btn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');

        // Update icon if present
        const icon = btn.querySelector('svg');
        if (icon) {
          icon.style.opacity = isPassword ? '1' : '0.5';
        }
      }
    });
  });

  // Character counter
  const counters = container.querySelectorAll('[data-char-counter]');
  counters.forEach(counter => {
    const inputId = counter.dataset.charCounter;
    const input = container.querySelector(`#${inputId}`);
    const max = input?.maxLength || parseInt(counter.dataset.max, 10);

    if (input && max > 0) {
      const updateCounter = () => {
        const current = input.value.length;
        counter.textContent = `${current}/${max}`;
        counter.classList.toggle('input-field__error', current >= max);
      };

      input.addEventListener('input', updateCounter);
      updateCounter();
    }
  });
}
