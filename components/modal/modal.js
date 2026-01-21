/**
 * Modal Component
 *
 * Accessible modal dialog with focus trapping and keyboard navigation.
 * Uses BaseComponent for proper event cleanup.
 *
 * Usage:
 * const modal = new Modal(element, {
 *   onOpen: () => console.log('opened'),
 *   onClose: () => console.log('closed'),
 *   closeOnBackdrop: true,
 *   closeOnEscape: true
 * });
 *
 * modal.open();
 * modal.close();
 * modal.destroy();
 */

class Modal extends BaseComponent {
  static get selector() {
    return '.modal';
  }

  static get defaults() {
    return {
      closeOnBackdrop: true,
      closeOnEscape: true,
      trapFocus: true,
      onOpen: null,
      onClose: null
    };
  }

  init() {
    // Cache elements
    this.backdrop = this.find('.modal__backdrop');
    this.dialog = this.find('.modal__dialog') || this.el;
    this.closeButtons = this.findAll('[data-modal-close]');
    this.title = this.find('.modal__title');

    // State
    this.isOpen = false;
    this.focusTrap = null;
    this.previouslyFocused = null;

    // Set up ARIA attributes
    this.setupAria();

    // Bind events
    this.bindEvents();
  }

  setupAria() {
    // Ensure proper ARIA attributes
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-hidden', 'true');

    // Link title to dialog for screen readers
    if (this.title && !this.el.hasAttribute('aria-labelledby')) {
      const titleId = this.title.id || `modal-title-${Date.now()}`;
      this.title.id = titleId;
      this.el.setAttribute('aria-labelledby', titleId);
    }
  }

  bindEvents() {
    // Close button clicks
    this.closeButtons.forEach((btn) => {
      this.on(btn, 'click', this.close);
    });

    // Backdrop click
    if (this.backdrop && this.options.closeOnBackdrop) {
      this.on(this.backdrop, 'click', this.close);
    }

    // Escape key (on the modal element)
    if (this.options.closeOnEscape) {
      this.on(this.el, 'keydown', this.handleKeydown);
    }
  }

  handleKeydown(e) {
    if (e.key === 'Escape' && this.isOpen) {
      e.preventDefault();
      this.close();
    }
  }

  open() {
    if (this.isOpen) return;

    // Store currently focused element
    this.previouslyFocused = document.activeElement;

    // Update state
    this.isOpen = true;
    this.el.classList.add('is-open');
    this.el.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    // Create and activate focus trap
    if (this.options.trapFocus && window.FocusUtils) {
      this.focusTrap = window.FocusUtils.createFocusTrap(this.el, {
        onEscape: this.options.closeOnEscape ? () => this.close() : null,
        returnFocus: false // We handle this ourselves
      });
      this.focusTrap.activate();
    } else {
      // Fallback: focus first focusable element
      const firstFocusable = this.el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        firstFocusable.focus();
      }
    }

    // Emit event
    this.emit('modal:open');

    // Callback
    if (this.options.onOpen) {
      this.options.onOpen(this);
    }
  }

  close() {
    if (!this.isOpen) return;

    // Update state
    this.isOpen = false;
    this.el.classList.remove('is-open');
    this.el.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    // Deactivate focus trap
    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = null;
    }

    // Restore focus
    if (this.previouslyFocused && this.previouslyFocused.focus) {
      this.previouslyFocused.focus();
    }
    this.previouslyFocused = null;

    // Emit event
    this.emit('modal:close');

    // Callback
    if (this.options.onClose) {
      this.options.onClose(this);
    }
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  onDestroy() {
    // Ensure modal is closed and focus trap is deactivated
    if (this.isOpen) {
      this.isOpen = false;
      this.el.classList.remove('is-open');
      document.body.classList.remove('modal-open');
    }

    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = null;
    }
  }
}

/**
 * Initialize modal functionality for a container
 * @param {HTMLElement} container
 * @returns {Modal[]} Array of Modal instances
 */
function initModal(container) {
  const instances = [];

  // Initialize all modals
  const modals = container.querySelectorAll('.modal');
  modals.forEach((modal) => {
    const instance = new Modal(modal);
    instances.push(instance);

    // Expose methods on element for backwards compatibility
    modal.openModal = () => instance.open();
    modal.closeModal = () => instance.close();
  });

  // Handle trigger buttons
  const triggers = container.querySelectorAll('[data-modal-trigger]');
  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const modalId = trigger.dataset.modalTrigger;
      const modal = document.getElementById(modalId);
      if (modal) {
        const instance = Modal.getInstance(modal);
        if (instance) {
          instance.open();
        } else if (modal.openModal) {
          modal.openModal();
        }
      }
    });
  });

  return instances;
}

// Export for use
if (typeof window !== 'undefined') {
  window.Modal = Modal;
}
