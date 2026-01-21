/**
 * Drawer Component
 *
 * Slide-out panel with focus trapping and keyboard navigation.
 * Uses BaseComponent for proper event cleanup.
 *
 * Usage:
 * const drawer = new Drawer(element, {
 *   onOpen: () => console.log('opened'),
 *   onClose: () => console.log('closed'),
 *   closeOnOverlay: true,
 *   closeOnEscape: true
 * });
 *
 * drawer.open();
 * drawer.close();
 * drawer.destroy();
 */

class Drawer extends BaseComponent {
  static get selector() {
    return '.drawer';
  }

  static get defaults() {
    return {
      closeOnOverlay: true,
      closeOnEscape: true,
      trapFocus: true,
      lockScroll: true,
      onOpen: null,
      onClose: null
    };
  }

  init() {
    // Cache elements
    this.closeButtons = this.findAll('[data-drawer-close]');
    this.title = this.find('.drawer__title');

    // Find associated overlay
    const drawerId = this.el.id;
    this.overlay = drawerId
      ? document.querySelector(`[data-drawer-overlay="${drawerId}"]`)
      : null;
    if (!this.overlay) {
      this.overlay = this.el.parentElement?.querySelector('.drawer-overlay');
    }

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
    // Drawer as dialog
    this.el.setAttribute('role', 'dialog');
    this.el.setAttribute('aria-modal', 'true');
    this.el.setAttribute('aria-hidden', 'true');

    // Link title for screen readers
    if (this.title && !this.el.hasAttribute('aria-labelledby')) {
      const titleId = this.title.id || `drawer-title-${Date.now()}`;
      this.title.id = titleId;
      this.el.setAttribute('aria-labelledby', titleId);
    }
  }

  bindEvents() {
    // Close button clicks
    this.closeButtons.forEach((btn) => {
      this.on(btn, 'click', this.close);
    });

    // Overlay click
    if (this.overlay && this.options.closeOnOverlay) {
      this.on(this.overlay, 'click', this.close);
    }

    // Escape key (tracked for cleanup)
    if (this.options.closeOnEscape) {
      this.on(document, 'keydown', this.handleKeydown);
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

    // Store current focus
    this.previouslyFocused = document.activeElement;

    // Close any other open drawers first
    const openDrawers = document.querySelectorAll('.drawer.is-open');
    openDrawers.forEach((drawer) => {
      if (drawer !== this.el) {
        const instance = Drawer.getInstance(drawer);
        if (instance) {
          instance.close();
        } else {
          drawer.classList.remove('is-open');
        }
      }
    });

    // Update state
    this.isOpen = true;
    this.el.classList.add('is-open');
    this.el.setAttribute('aria-hidden', 'false');

    if (this.overlay) {
      this.overlay.classList.add('is-open');
    }

    // Lock scroll
    if (this.options.lockScroll) {
      document.body.style.overflow = 'hidden';
    }

    // Create and activate focus trap
    if (this.options.trapFocus && window.FocusUtils) {
      this.focusTrap = window.FocusUtils.createFocusTrap(this.el, {
        onEscape: this.options.closeOnEscape ? () => this.close() : null,
        returnFocus: false
      });
      this.focusTrap.activate();
    } else {
      // Fallback: focus first focusable element
      const firstFocusable = this.el.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (firstFocusable) {
        setTimeout(() => firstFocusable.focus(), 100);
      }
    }

    this.emit('drawer:open');

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

    if (this.overlay) {
      this.overlay.classList.remove('is-open');
    }

    // Unlock scroll
    if (this.options.lockScroll) {
      // Only unlock if no other drawers are open
      const otherOpen = document.querySelectorAll('.drawer.is-open');
      if (otherOpen.length === 0) {
        document.body.style.overflow = '';
      }
    }

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

    this.emit('drawer:close');

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
    // Ensure drawer is closed
    if (this.isOpen) {
      this.el.classList.remove('is-open');
      if (this.overlay) {
        this.overlay.classList.remove('is-open');
      }
      document.body.style.overflow = '';
    }

    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = null;
    }
  }
}

/**
 * Initialize drawer functionality for a container
 * @param {HTMLElement} container
 * @returns {Drawer[]} Array of Drawer instances
 */
function initDrawer(container) {
  const instances = [];

  // Initialize all drawers
  const drawers = container.querySelectorAll('.drawer');
  console.log('Found drawers:', drawers.length, Array.from(drawers).map(d => d.id));

  // Debug: Check if drawer-lg exists anywhere
  const lgInContainer = container.querySelector('#drawer-lg');
  const lgInDocument = document.getElementById('drawer-lg');
  console.log('drawer-lg in container:', !!lgInContainer, 'in document:', !!lgInDocument);

  // Check if full demo loaded
  const hasEndMarker = container.innerHTML.includes('END_OF_DRAWER_DEMO');
  const hasLgDrawer = container.innerHTML.includes('drawer--lg');
  console.log('Full demo loaded:', hasEndMarker, '| Has drawer-lg:', hasLgDrawer);

  if (!hasLgDrawer) {
    console.log('Last 200 chars:', container.innerHTML.slice(-200));
  }

  drawers.forEach((drawer) => {
    try {
      const instance = new Drawer(drawer);
      instances.push(instance);
    } catch (e) {
      console.error('Failed to initialize drawer:', drawer.id, e);
    }
  });

  // Create a map of drawer IDs to instances for quick lookup
  const drawerMap = new Map();
  instances.forEach((inst) => {
    if (inst.el && inst.el.id) {
      drawerMap.set(inst.el.id, inst);
    }
  });

  // Handle trigger buttons - use event delegation for reliability
  container.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-drawer-trigger]');
    if (!trigger) return;

    e.preventDefault();
    e.stopPropagation();

    const drawerId = trigger.dataset.drawerTrigger;
    if (!drawerId) return;

    // First try our local map (most reliable)
    let instance = drawerMap.get(drawerId);

    // Fallback: try to find by ID in container
    if (!instance) {
      const drawer = container.querySelector(`#${CSS.escape(drawerId)}`);
      if (drawer) {
        instance = Drawer.getInstance(drawer);
        if (!instance) {
          try {
            instance = new Drawer(drawer);
            drawerMap.set(drawerId, instance);
          } catch (err) {
            console.error('Failed to create drawer:', drawerId, err);
            return;
          }
        }
      }
    }

    // Last resort: search entire document
    if (!instance) {
      const drawer = document.getElementById(drawerId);
      if (drawer) {
        instance = Drawer.getInstance(drawer);
        if (!instance) {
          try {
            instance = new Drawer(drawer);
            drawerMap.set(drawerId, instance);
          } catch (err) {
            console.error('Failed to create drawer:', drawerId, err);
            return;
          }
        }
      }
    }

    if (instance) {
      instance.open();
    } else {
      console.warn(`Drawer not found: ${drawerId}. Available:`, Array.from(drawerMap.keys()));
    }
  });

  return instances;
}

// Export for use
if (typeof window !== 'undefined') {
  window.Drawer = Drawer;
}
