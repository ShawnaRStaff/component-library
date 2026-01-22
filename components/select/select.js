/**
 * Select/Dropdown Component
 *
 * Accessible custom dropdown with keyboard navigation.
 * Uses BaseComponent for proper event cleanup.
 *
 * Supports both:
 * - Action dropdowns (menus with clickable items)
 * - Select dropdowns (pick a value from a list)
 *
 * Usage:
 * const dropdown = new Dropdown(element, {
 *   onChange: (value, text) => console.log(value)
 * });
 *
 * dropdown.open();
 * dropdown.close();
 * dropdown.destroy();
 */

class Dropdown extends BaseComponent {
  static get selector() {
    return '.dropdown';
  }

  static get defaults() {
    return {
      closeOnSelect: true,
      closeOnOutsideClick: true,
      onChange: null
    };
  }

  init() {
    // Cache elements
    this.trigger = this.find('.dropdown__trigger');
    this.menu = this.find('.dropdown__menu');
    this.items = Array.from(this.findAll('.dropdown__item:not([disabled])'));

    if (!this.trigger || !this.menu) {
      console.warn('Dropdown: Missing trigger or menu element');
      return;
    }

    // State
    this.isOpen = false;
    this.currentIndex = -1;
    this.selectedValue = null;

    // Set up ARIA attributes
    this.setupAria();

    // Bind events
    this.bindEvents();
  }

  setupAria() {
    // Trigger button
    this.trigger.setAttribute('aria-haspopup', 'listbox');
    this.trigger.setAttribute('aria-expanded', 'false');

    // Generate unique ID for menu if needed
    const menuId = this.menu.id || `dropdown-menu-${Date.now()}`;
    this.menu.id = menuId;
    this.trigger.setAttribute('aria-controls', menuId);

    // Menu as listbox
    this.menu.setAttribute('role', 'listbox');
    this.menu.setAttribute('tabindex', '-1');

    // Items as options
    this.items.forEach((item, index) => {
      item.setAttribute('role', 'option');
      item.setAttribute('tabindex', '-1');

      // Set ID for aria-activedescendant
      if (!item.id) {
        item.id = `${menuId}-option-${index}`;
      }

      // Mark selected item
      if (item.classList.contains('dropdown__item--selected')) {
        item.setAttribute('aria-selected', 'true');
        this.selectedValue = item.dataset.value;
      } else {
        item.setAttribute('aria-selected', 'false');
      }
    });
  }

  bindEvents() {
    // Trigger click
    this.on(this.trigger, 'click', this.handleTriggerClick);

    // Item clicks
    this.items.forEach((item) => {
      this.on(item, 'click', (e) => this.handleItemClick(e, item));
    });

    // Keyboard navigation
    this.on(this.el, 'keydown', this.handleKeydown);

    // Close on outside click (document level - tracked for cleanup)
    if (this.options.closeOnOutsideClick) {
      this.on(document, 'click', this.handleOutsideClick);
    }
  }

  handleTriggerClick(e) {
    e.preventDefault();
    this.toggle();
  }

  handleItemClick(e, item) {
    e.preventDefault();
    if (!item.hasAttribute('disabled') && !item.classList.contains('dropdown__item--disabled')) {
      this.selectItem(item);
    }
  }

  handleKeydown(e) {
    // Open dropdown on Enter, Space, or ArrowDown when closed
    if (!this.isOpen && (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown')) {
      e.preventDefault();
      this.open();
      return;
    }

    if (!this.isOpen) return;

    switch (e.key) {
      case 'Escape':
        e.preventDefault();
        this.close();
        break;

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

      case 'Enter':
      case ' ':
        e.preventDefault();
        if (this.currentIndex >= 0 && this.items[this.currentIndex]) {
          this.selectItem(this.items[this.currentIndex]);
        }
        break;

      case 'Tab':
        this.close();
        break;

      default:
        // Type-ahead: focus item starting with typed character
        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
          this.typeaheadSearch(e.key);
        }
    }
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
    if (this.isOpen || this.items.length === 0) return;

    this.isOpen = true;
    this.el.classList.add('is-open');
    this.trigger.setAttribute('aria-expanded', 'true');

    // Focus selected item or first item
    const selectedIndex = this.items.findIndex((item) =>
      item.classList.contains('dropdown__item--selected')
    );
    this.focusItem(selectedIndex >= 0 ? selectedIndex : 0);

    this.emit('dropdown:open');
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.currentIndex = -1;
    this.el.classList.remove('is-open');
    this.trigger.setAttribute('aria-expanded', 'false');
    this.menu.removeAttribute('aria-activedescendant');
    this.trigger.focus();

    this.emit('dropdown:close');
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
    const item = this.items[index];
    item.focus();

    // Update aria-activedescendant
    this.menu.setAttribute('aria-activedescendant', item.id);
  }

  focusNextItem() {
    const nextIndex = Math.min(this.currentIndex + 1, this.items.length - 1);
    this.focusItem(nextIndex);
  }

  focusPrevItem() {
    const prevIndex = Math.max(this.currentIndex - 1, 0);
    this.focusItem(prevIndex);
  }

  selectItem(item) {
    const value = item.dataset.value;
    const text = item.textContent.trim();

    // Update selected states
    this.items.forEach((i) => {
      i.classList.remove('dropdown__item--selected');
      i.setAttribute('aria-selected', 'false');
    });
    item.classList.add('dropdown__item--selected');
    item.setAttribute('aria-selected', 'true');
    this.selectedValue = value;

    // Update trigger text for select dropdowns
    const valueEl = this.trigger.querySelector('.select-dropdown__value');
    if (valueEl) {
      valueEl.textContent = text;
      valueEl.classList.remove('select-dropdown__placeholder');
    }

    // Emit change event
    this.emit('dropdown:change', { value, text });

    // Callback
    if (this.options.onChange) {
      this.options.onChange(value, text);
    }

    // Close if configured
    if (this.options.closeOnSelect) {
      this.close();
    }
  }

  getValue() {
    return this.selectedValue;
  }

  setValue(value) {
    const item = this.items.find((i) => i.dataset.value === value);
    if (item) {
      this.selectItem(item);
    }
  }

  onDestroy() {
    // Ensure dropdown is closed
    if (this.isOpen) {
      this.el.classList.remove('is-open');
    }
  }
}

/**
 * Initialize dropdown functionality for a container
 * @param {HTMLElement} container
 * @returns {Dropdown[]} Array of Dropdown instances
 */
function initSelect(container) {
  const instances = [];

  const dropdowns = container.querySelectorAll('.dropdown');
  dropdowns.forEach((dropdown) => {
    const instance = new Dropdown(dropdown);
    instances.push(instance);
  });

  return instances;
}

// Export for use
if (typeof window !== 'undefined') {
  window.Dropdown = Dropdown;
}
