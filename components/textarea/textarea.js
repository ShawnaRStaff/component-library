/**
 * Textarea Component JavaScript
 */

function initTextarea(container) {
  // Auto-grow textareas
  const autoGrowTextareas = container.querySelectorAll('.textarea--auto-grow');

  autoGrowTextareas.forEach(textarea => {
    const resize = () => {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    };

    textarea.addEventListener('input', resize);
    resize(); // Initial resize
  });

  // Character counters
  const textareaWrappers = container.querySelectorAll('.textarea-wrapper');

  textareaWrappers.forEach(wrapper => {
    const textarea = wrapper.querySelector('.textarea');
    const counter = wrapper.querySelector('.textarea-wrapper__counter');

    if (textarea && counter) {
      const maxLength = parseInt(textarea.getAttribute('maxlength') || textarea.dataset.maxlength, 10);

      if (maxLength) {
        const updateCounter = () => {
          const current = textarea.value.length;
          const remaining = maxLength - current;

          counter.textContent = `${current}/${maxLength}`;

          counter.classList.remove('textarea-wrapper__counter--warning', 'textarea-wrapper__counter--error');

          if (remaining < 0) {
            counter.classList.add('textarea-wrapper__counter--error');
          } else if (remaining < maxLength * 0.1) {
            counter.classList.add('textarea-wrapper__counter--warning');
          }
        };

        textarea.addEventListener('input', updateCounter);
        updateCounter();
      }
    }
  });

  // Tab support for code textareas
  const codeTextareas = container.querySelectorAll('.textarea--code');

  codeTextareas.forEach(textarea => {
    textarea.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Insert tab at cursor position
        textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);

        // Move cursor after tab
        textarea.selectionStart = textarea.selectionEnd = start + 2;
      }
    });
  });
}
