/**
 * Footer Component JavaScript
 *
 * The footer is primarily CSS-based.
 * This file handles any interactive elements like newsletter forms.
 */

function initFooter(container) {
  const newsletterForms = container.querySelectorAll('.footer__newsletter-form');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.footer__newsletter-input');
      if (input && input.value) {
        // In a real app, this would submit to an API
        alert(`Thanks for subscribing with: ${input.value}`);
        input.value = '';
      }
    });
  });
}
