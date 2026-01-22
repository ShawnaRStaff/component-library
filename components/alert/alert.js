/**
 * Alert & Toast Component JavaScript
 */

function initAlert(container) {
  // Dismissible alerts
  const alertCloseButtons = container.querySelectorAll('.alert__close');
  alertCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const alert = btn.closest('.alert');
      if (alert) {
        alert.style.opacity = '0';
        alert.style.transform = 'translateX(10px)';
        alert.style.transition = 'all 0.2s ease';
        setTimeout(() => alert.remove(), 200);
      }
    });
  });

  // Toast close buttons
  const toastCloseButtons = container.querySelectorAll('.toast__close');
  toastCloseButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const toast = btn.closest('.toast');
      if (toast) {
        dismissToast(toast);
      }
    });
  });

  // Demo: Show toast button
  const showToastBtns = container.querySelectorAll('[data-show-toast]');
  showToastBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.showToast || 'info';
      showDemoToast(type);
    });
  });
}

function dismissToast(toast) {
  toast.classList.add('is-leaving');
  setTimeout(() => toast.remove(), 150);
}

function showDemoToast(type) {
  let container = document.querySelector('.toast-container--top-right');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container toast-container--top-right';
    document.body.appendChild(container);
  }

  const icons = {
    success: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/></svg>',
    error: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/></svg>',
    warning: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/></svg>',
    info: '<svg viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/></svg>'
  };

  const titles = {
    success: 'Success!',
    error: 'Error',
    warning: 'Warning',
    info: 'Information'
  };

  const messages = {
    success: 'Your changes have been saved successfully.',
    error: 'Something went wrong. Please try again.',
    warning: 'Please review before continuing.',
    info: 'Here is some useful information.'
  };

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.innerHTML = `
    <span class="toast__icon">${icons[type]}</span>
    <div class="toast__content">
      <div class="toast__title">${titles[type]}</div>
      <div class="toast__message">${messages[type]}</div>
    </div>
    <button class="toast__close" aria-label="Close">
      <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
        <path d="M4.3 4.3a1 1 0 011.4 0L8 6.6l2.3-2.3a1 1 0 111.4 1.4L9.4 8l2.3 2.3a1 1 0 01-1.4 1.4L8 9.4l-2.3 2.3a1 1 0 01-1.4-1.4L6.6 8 4.3 5.7a1 1 0 010-1.4z"/>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  // Close button
  toast.querySelector('.toast__close').addEventListener('click', () => {
    dismissToast(toast);
  });

  // Auto dismiss after 5 seconds
  setTimeout(() => {
    if (toast.parentNode) {
      dismissToast(toast);
    }
  }, 5000);
}
