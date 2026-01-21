/**
 * Menu Component
 *
 * Accessible dropdown menu with keyboard navigation.
 * Implements ARIA menu pattern.
 * Uses BaseComponent for proper event cleanup.
 *
 * Usage:
 * const menu = new Menu(element, {
 *   onSelect: (item, value) => console.log(value),
 *   closeOnSelect: true
 * });
 *
 * menu.open();
 * menu.close();
 * menu.destroy();
 */

class Menu extends BaseComponent {
  static get selector() {
    return '.menu';
  }

  static get defaults() {
    return {
      closeOnSelect: true,
      closeOnOutsideClick: true,
      onSelect: null
    };
  }

  init() {
    // Cache elements
    this.trigger = this.find('.menu__trigger');
    this.content = this.find('.menu__content');
    this.items = Array.from(this.findAll('.menu__item:not([disabled])'));

    if (!this.trigger || !this.content) {
      console.warn('Menu: Missing trigger or content element');
      return;
    }

    // State
    this.isOpen = false;
    this.currentIndex = -1;

    // Set up ARIA attributes
    this.setupAria();

    // Bind events
    this.bindEvents();
  }

  setupAria() {
    // Trigger button
    this.trigger.setAttribute('aria-haspopup', 'menu');
    this.trigger.setAttribute('aria-expanded', 'false');

    // Menu content
    const menuId = this.content.id || `menu-content-${Date.now()}`;
    this.content.id = menuId;
    this.content.setAttribute('role', 'menu');
    this.trigger.setAttribute('aria-controls', menuId);

    // Menu items
    this.items.forEach((item, index) => {
      item.setAttribute('role', 'menuitem');
      item.setAttribute('tabindex', '-1');

      if (!item.id) {
        item.id = `${menuId}-item-${index}`;
      }

      // Handle checkbox items
      if (item.classList.contains('menu__item--check')) {
        item.setAttribute('role', 'menuitemcheckbox');
        item.setAttribute('aria-checked', item.classList.contains('is-checked') ? 'true' : 'false');
      }

      // Handle radio items
      if (item.classList.contains('menu__item--radio')) {
        item.setAttribute('role', 'menuitemradio');
        item.setAttribute('aria-checked', item.classList.contains('is-checked') ? 'true' : 'false');
      }
    });
  }

  bindEvents() {
    // Trigger click
    this.on(this.trigger, 'click', this.handleTriggerClick);

    // Keyboard navigation
    this.on(this.el, 'keydown', this.handleKeydown);

    // Item clicks
    this.items.forEach((item) => {
      this.on(item, 'click', (e) => this.handleItemClick(e, item));
    });

    // Prevent clicks inside menu from closing it
    this.on(this.content, 'click', (e) => e.stopPropagation());

    // Close on outside click
    if (this.options.closeOnOutsideClick) {
      this.on(document, 'click', this.handleOutsideClick);
    }
  }

  handleTriggerClick(e) {
    e.stopPropagation();
    this.toggle();
  }

  handleKeydown(e) {
    // Open menu on arrow down, enter, or space when closed
    if (!this.isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.open();
        this.focusItem(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusNextItem();
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.focusPrevItem();
        break;

      case 'Home':
        e.preventDefault();
        this.focusItem(0);
        break;

      case 'End':
        e.preventDefault();
        this.focusItem(this.items.length - 1);
        break;

      case 'Escape':
        e.preventDefault();
        this.close();
        this.trigger.focus();
        break;

      case 'Tab':
        this.close();
        break;

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.currentIndex >= 0 && this.items[this.currentIndex]) {
          this.selectItem(this.items[this.currentIndex]);
        }
        break;

      default:
        // Type-ahead
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          this.typeaheadSearch(e.key);
        }
    }
  }

  handleItemClick(e, item) {
    e.preventDefault();
    this.selectItem(item);
  }

  handleOutsideClick(e) {
    if (this.isOpen && !this.el.contains(e.target)) {
      this.close();
    }
  }

  typeaheadSearch(char) {
    const searchChar = char.toLowerCase();
    const startIndex = this.currentIndex >= 0 ? this.currentIndex + 1 : 0;

    // Search from current position
    for (let i = startIndex; i < this.items.length; i++) {
      if (this.items[i].textContent.trim().toLowerCase().startsWith(searchChar)) {
        this.focusItem(i);
        return;
      }
    }

    // Wrap around to beginning
    for (let i = 0; i < startIndex; i++) {
      if (this.items[i].textContent.trim().toLowerCase().startsWith(searchChar)) {
        this.focusItem(i);
        return;
      }
    }
  }

  open() {
    if (this.isOpen) return;

    // Close other menus first
    document.querySelectorAll('.menu.is-open').forEach((menu) => {
      if (menu !== this.el) {
        const instance = Menu.getInstance(menu);
        if (instance) {
          instance.close();
        }
      }
    });

    this.isOpen = true;
    this.el.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');
    this.currentIndex = -1;

    this.emit('menu:open');
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.el.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.currentIndex = -1;

    this.emit('menu:close');
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  focusItem(index) {
    if (index < 0 || index >= this.items.length) return;

    this.currentIndex = index;
    this.items[index].focus();
  }

  focusNextItem() {
    const nextIndex = (this.currentIndex + 1) % this.items.length;
    this.focusItem(nextIndex);
  }

  focusPrevItem() {
    const prevIndex = this.currentIndex <= 0 ? this.items.length - 1 : this.currentIndex - 1;
    this.focusItem(prevIndex);
  }

  selectItem(item) {
    const value = item.dataset.value;
    const action = item.dataset.action;

    // Handle checkbox items
    if (item.getAttribute('role') === 'menuitemcheckbox') {
      const isChecked = item.classList.toggle('is-checked');
      item.setAttribute('aria-checked', isChecked ? 'true' : 'false');

      this.emit('menu:change', { item, value, checked: isChecked });
      return; // Don't close menu for checkboxes
    }

    // Handle radio items
    if (item.getAttribute('role') === 'menuitemradio') {
      // Uncheck other radios in the same group
      const group = item.closest('.menu__group') || this.content;
      group.querySelectorAll('[role="menuitemradio"]').forEach((radio) => {
        radio.classList.remove('is-checked');
        radio.setAttribute('aria-checked', 'false');
      });
      item.classList.add('is-checked');
      item.setAttribute('aria-checked', 'true');
    }

    this.emit('menu:select', { item, value, action });

    if (this.options.onSelect) {
      this.options.onSelect(item, value);
    }

    if (this.options.closeOnSelect) {
      this.close();
      this.trigger.focus();
    }
  }

  onDestroy() {
    if (this.isOpen) {
      this.el.classList.remove('is-open');
    }
  }
}

/**
 * Initialize menu functionality for a container
 * @param {HTMLElement} container
 * @returns {Menu[]} Array of Menu instances
 */
function initMenu(container) {
  const instances = [];

  const menus = container.querySelectorAll('.menu');
  menus.forEach((menu) => {
    const instance = new Menu(menu);
    instances.push(instance);
  });

  return instances;
}

// Export for use
if (typeof window !== 'undefined') {
  window.Menu = Menu;
}
