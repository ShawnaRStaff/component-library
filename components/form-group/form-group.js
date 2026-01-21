/**
 * Form Group Component JavaScript
 */

function initFormGroup(container) {
  // Character counter functionality
  const counters = container.querySelectorAll('[data-counter]');

  counters.forEach(input => {
    const maxLength = parseInt(input.dataset.counter, 10);
    const counter = input.parentElement.querySelector('.form-group__counter') ||
                    input.closest('.form-group').querySelector('.form-group__counter');

    if (counter && maxLength) {
      const updateCounter = () => {
        const current = input.value.length;
        counter.textContent = `${current}/${maxLength}`;

        counter.classList.remove('form-group__counter--warning', 'form-group__counter--error');

        if (current > maxLength) {
          counter.classList.add('form-group__counter--error');
        } else if (current > maxLength * 0.9) {
          counter.classList.add('form-group__counter--warning');
        }
      };

      input.addEventListener('input', updateCounter);
      updateCounter(); // Initial count
    }
  });

  // Real-time validation example
  const emailInputs = container.querySelectorAll('input[type="email"][data-validate]');

  emailInputs.forEach(input => {
    const formGroup = input.closest('.form-group');

    input.addEventListener('blur', () => {
      const isValid = input.checkValidity();
      formGroup.classList.remove('form-group--error', 'form-group--success');

      if (input.value) {
        formGroup.classList.add(isValid ? 'form-group--success' : 'form-group--error');
      }
    });

    input.addEventListener('input', () => {
      formGroup.classList.remove('form-group--error', 'form-group--success');
    });
  });
}
