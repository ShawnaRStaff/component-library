/**
 * Accordion Component
 *
 * Expandable content sections with keyboard navigation.
 * Uses BaseComponent for proper event cleanup.
 *
 * Usage:
 * const accordion = new Accordion(element, {
 *   allowMultiple: false,
 *   onToggle: (item, isOpen) => console.log(isOpen)
 * });
 *
 * accordion.open(0);
 * accordion.close(0);
 * accordion.toggle(0);
 * accordion.destroy();
 */

class Accordion extends BaseComponent {
  static get selector() {
    return '.accordion';
  }

  static get defaults() {
    return {
      allowMultiple: false,
      onToggle: null
    };
  }

  init() {
    // Check for data attribute
    if (this.el.dataset.allowMultiple !== undefined) {
      this.options.allowMultiple = true;
    }

    // Cache elements
    this.items = Array.from(this.findAll('.accordion__item'));
    this.headers = [];
    this.contents = [];

    // Set up ARIA and cache headers/contents
    this.setupAria();

    // Bind events
    this.bindEvents();
  }

  setupAria() {
    const idBase = this.el.id || `accordion-${Date.now()}`;

    this.items.forEach((item, index) => {
      const header = item.querySelector('.accordion__header');
      const content = item.querySelector('.accordion__content');

      if (!header || !content) return;

      this.headers.push(header);
      this.contents.push(content);

      // Generate IDs
      const headerId = header.id || `${idBase}-header-${index}`;
      const contentId = content.id || `${idBase}-content-${index}`;

      header.id = headerId;
      content.id = contentId;

      // Set ARIA attributes
      header.setAttribute('aria-expanded', item.classList.contains('is-open') ? 'true' : 'false');
      header.setAttribute('aria-controls', contentId);

      content.setAttribute('role', 'region');
      content.setAttribute('aria-labelledby', headerId);
    });
  }

  bindEvents() {
    this.headers.forEach((header, index) => {
      // Click handler
      this.on(header, 'click', () => this.toggle(index));

      // Keyboard navigation
      this.on(header, 'keydown', (e) => this.handleKeydown(e, index));
    });
  }

  handleKeydown(e, currentIndex) {
    let newIndex = currentIndex;
    let handled = false;

    switch (e.key) {
      case 'ArrowDown':
        handled = true;
        newIndex = (currentIndex + 1) % this.headers.length;
        break;

      case 'ArrowUp':
        handled = true;
        newIndex = (currentIndex - 1 + this.headers.length) % this.headers.length;
        break;

      case 'Home':
        handled = true;
        newIndex = 0;
        break;

      case 'End':
        handled = true;
        newIndex = this.headers.length - 1;
        break;
    }

    if (handled) {
      e.preventDefault();
      this.headers[newIndex].focus();
    }
  }

  open(index) {
    if (index < 0 || index >= this.items.length) return;

    const item = this.items[index];
    const header = this.headers[index];

    if (item.classList.contains('is-open')) return;

    // Close others if not allowing multiple
    if (!this.options.allowMultiple) {
      this.items.forEach((otherItem, otherIndex) => {
        if (otherIndex !== index && otherItem.classList.contains('is-open')) {
          this.close(otherIndex);
        }
      });
    }

    item.classList.add('is-open');
    header.setAttribute('aria-expanded', 'true');

    this.emitToggle(index, true);
  }

  close(index) {
    if (index < 0 || index >= this.items.length) return;

    const item = this.items[index];
    const header = this.headers[index];

    if (!item.classList.contains('is-open')) return;

    item.classList.remove('is-open');
    header.setAttribute('aria-expanded', 'false');

    this.emitToggle(index, false);
  }

  toggle(index) {
    if (index < 0 || index >= this.items.length) return;

    const item = this.items[index];
    if (item.classList.contains('is-open')) {
      this.close(index);
    } else {
      this.open(index);
    }
  }

  emitToggle(index, isOpen) {
    this.emit('accordion:toggle', {
      index,
      item: this.items[index],
      isOpen
    });

    if (this.options.onToggle) {
      this.options.onToggle(this.items[index], isOpen);
    }
  }

  openAll() {
    if (!this.options.allowMultiple) return;
    this.items.forEach((_, index) => this.open(index));
  }

  closeAll() {
    this.items.forEach((_, index) => this.close(index));
  }

  isOpen(index) {
    return this.items[index]?.classList.contains('is-open') || false;
  }
}

/**
 * Initialize accordion functionality for a container
 * @param {HTMLElement} container
 * @returns {Accordion[]} Array of Accordion instances
 */
function initAccordion(container) {
  const instances = [];

  const accordions = container.querySelectorAll('.accordion');
  accordions.forEach((accordion) => {
    const instance = new Accordion(accordion);
    instances.push(instance);
  });

  return instances;
}

// Export for use
if (typeof window !== 'undefined') {
  window.Accordion = Accordion;
}
