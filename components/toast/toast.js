/**
 * Toast/Snackbar Component
 *
 * Accessible toast notification system with auto-dismiss and actions.
 * Uses ARIA live regions and role="alert" for screen reader announcements.
 *
 * Usage:
 * const toast = new Toast({
 *   position: 'top-right',
 *   duration: 5000
 * });
 *
 * toast.show('Hello!');
 * toast.success('Saved successfully!');
 * toast.error('Something went wrong');
 * toast.warning('Please check your input');
 * toast.info('New update available');
 */

class Toast {
  constructor(options = {}) {
    this.container = options.container || this.createContainer(options.position || 'top-right');
    this.duration = options.duration || 5000;
    this.toasts = [];
  }

  createContainer(position) {
    let container = document.querySelector(`.toast-container--${position}`);
    if (!container) {
      container = document.createElement('div');
      container.className = `toast-container toast-container--${position}`;

      // ARIA live region for screen reader announcements
      container.setAttribute('role', 'region');
      container.setAttribute('aria-live', 'polite');
      container.setAttribute('aria-label', 'Notifications');

      document.body.appendChild(container);
    }
    return container;
  }

  show(message, options = {}) {
    const toast = document.createElement('div');
    const isError = options.variant === 'error';

    toast.className = `toast ${options.variant ? `toast--${options.variant}` : ''}`;

    // ARIA attributes for accessibility
    toast.setAttribute('role', isError ? 'alert' : 'status');
    toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');
    toast.setAttribute('aria-atomic', 'true');

    let html = '';

    // Icon
    if (options.icon) {
      html += `<div class="toast__icon" aria-hidden="true">${options.icon}</div>`;
    }

    // Content
    html += '<div class="toast__content">';
    if (options.title) {
      html += `<div class="toast__title">${this.escapeHtml(options.title)}</div>`;
    }
    html += `<div class="toast__message">${this.escapeHtml(message)}</div>`;
    html += '</div>';

    // Action button (if provided)
    if (options.action) {
      html += `
        <button class="toast__action" type="button">
          ${this.escapeHtml(options.action.label)}
        </button>
      `;
    }

    // Close button
    html += `
      <button class="toast__close" type="button" aria-label="Dismiss notification">
        <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
      </button>
    `;

    toast.innerHTML = html;

    // Event handlers
    const closeBtn = toast.querySelector('.toast__close');
    closeBtn.addEventListener('click', () => this.dismiss(toast));

    const actionBtn = toast.querySelector('.toast__action');
    if (actionBtn && options.action?.onClick) {
      actionBtn.addEventListener('click', () => {
        options.action.onClick();
        if (options.action.dismissOnClick !== false) {
          this.dismiss(toast);
        }
      });
    }

    // Allow keyboard focus to pause auto-dismiss
    let dismissTimeout = null;

    toast.addEventListener('mouseenter', () => {
      if (dismissTimeout) {
        clearTimeout(dismissTimeout);
        dismissTimeout = null;
      }
    });

    toast.addEventListener('mouseleave', () => {
      if (options.duration !== 0 && !toast.classList.contains('is-leaving')) {
        dismissTimeout = setTimeout(() => this.dismiss(toast), 1000);
      }
    });

    toast.addEventListener('focusin', () => {
      if (dismissTimeout) {
        clearTimeout(dismissTimeout);
        dismissTimeout = null;
      }
    });

    toast.addEventListener('focusout', (e) => {
      // Only restart timer if focus moved outside the toast
      if (!toast.contains(e.relatedTarget) && options.duration !== 0 && !toast.classList.contains('is-leaving')) {
        dismissTimeout = setTimeout(() => this.dismiss(toast), 1000);
      }
    });

    // Add to container
    this.container.appendChild(toast);
    this.toasts.push(toast);

    // Auto dismiss
    if (options.duration !== 0) {
      dismissTimeout = setTimeout(() => {
        this.dismiss(toast);
      }, options.duration || this.duration);
    }

    // Return the toast element and a dismiss function
    return {
      element: toast,
      dismiss: () => this.dismiss(toast)
    };
  }

  dismiss(toast) {
    if (toast.classList.contains('is-leaving')) return;

    toast.classList.add('is-leaving');

    // Remove from tracking array
    const index = this.toasts.indexOf(toast);
    if (index > -1) {
      this.toasts.splice(index, 1);
    }

    // Remove from DOM after animation
    setTimeout(() => {
      if (toast.parentNode) {
        toast.remove();
      }
    }, 200);
  }

  dismissAll() {
    [...this.toasts].forEach((toast) => this.dismiss(toast));
  }

  success(message, options = {}) {
    return this.show(message, {
      ...options,
      variant: 'success',
      icon: options.icon || `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"/>
        </svg>
      `
    });
  }

  error(message, options = {}) {
    return this.show(message, {
      ...options,
      variant: 'error',
      icon: options.icon || `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"/>
        </svg>
      `
    });
  }

  warning(message, options = {}) {
    return this.show(message, {
      ...options,
      variant: 'warning',
      icon: options.icon || `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"/>
        </svg>
      `
    });
  }

  info(message, options = {}) {
    return this.show(message, {
      ...options,
      variant: 'info',
      icon: options.icon || `
        <svg viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"/>
        </svg>
      `
    });
  }

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  destroy() {
    this.dismissAll();
    // Remove container if we created it and it's empty
    if (this.container.children.length === 0 && this.container.parentNode) {
      this.container.remove();
    }
  }
}

/**
 * Initialize toast functionality for a container (demo toasts)
 * @param {HTMLElement} container
 */
function initToast(container) {
  // Handle close buttons in existing demo toasts
  const closeButtons = container.querySelectorAll('.toast__close');
  closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const toast = button.closest('.toast');
      if (toast) {
        toast.classList.add('is-leaving');
        setTimeout(() => toast.remove(), 200);
      }
    });
  });

  // Add ARIA attributes to existing demo toasts
  const toasts = container.querySelectorAll('.toast');
  toasts.forEach((toast) => {
    if (!toast.hasAttribute('role')) {
      const isError = toast.classList.contains('toast--error');
      toast.setAttribute('role', isError ? 'alert' : 'status');
      toast.setAttribute('aria-live', isError ? 'assertive' : 'polite');
      toast.setAttribute('aria-atomic', 'true');
    }
  });
}

// Export for use
if (typeof window !== 'undefined') {
  window.Toast = Toast;
}
