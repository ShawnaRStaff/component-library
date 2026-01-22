/**
 * Command Palette Component
 *
 * Keyboard-driven command interface with search and navigation.
 * Implements ARIA combobox pattern for accessibility.
 * Uses BaseComponent for proper event cleanup.
 *
 * Usage:
 * const palette = new CommandPalette(element, {
 *   onSelect: (item, data) => console.log('Selected:', data),
 *   onClose: () => console.log('Closed'),
 *   shortcut: 'k' // Ctrl+K or Cmd+K to open
 * });
 *
 * palette.open();
 * palette.close();
 * palette.destroy();
 */

class CommandPalette extends BaseComponent {
  static get selector() {
    return '.command-palette';
  }

  static get defaults() {
    return {
      shortcut: 'k', // Key to use with Ctrl/Cmd
      enableShortcut: true,
      closeOnSelect: true,
      closeOnEscape: true,
      onSelect: null,
      onClose: null,
      onOpen: null
    };
  }

  init() {
    // Cache elements
    this.overlay = this.el.closest('.command-palette-overlay') || this.el;
    this.input = this.find('.command-palette__input');
    this.results = this.find('.command-palette__results');
    this.allItems = [];
    this.visibleItems = [];

    if (!this.input || !this.results) {
      console.warn('CommandPalette: Missing input or results element');
      return;
    }

    // State
    this.isOpen = false;
    this.highlightedIndex = -1;
    this.previouslyFocused = null;
    this.focusTrap = null;

    // Set up ARIA attributes
    this.setupAria();

    // Bind events
    this.bindEvents();

    // Cache initial items
    this.updateItems();
  }

  setupAria() {
    // Input as combobox
    this.input.setAttribute('role', 'combobox');
    this.input.setAttribute('aria-autocomplete', 'list');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.setAttribute('aria-haspopup', 'listbox');

    // Results as listbox
    const resultsId = this.results.id || `command-results-${Date.now()}`;
    this.results.id = resultsId;
    this.results.setAttribute('role', 'listbox');
    this.input.setAttribute('aria-controls', resultsId);

    // Label the input
    const label = this.find('.command-palette__label');
    if (label) {
      const labelId = label.id || `command-label-${Date.now()}`;
      label.id = labelId;
      this.input.setAttribute('aria-labelledby', labelId);
    } else {
      this.input.setAttribute('aria-label', 'Search commands');
    }

    // Set up items
    this.setupItemsAria();
  }

  setupItemsAria() {
    const items = this.results.querySelectorAll('.command-palette__item');
    items.forEach((item, index) => {
      item.setAttribute('role', 'option');
      item.setAttribute('aria-selected', 'false');
      if (!item.id) {
        item.id = `${this.results.id}-option-${index}`;
      }
    });
  }

  bindEvents() {
    // Input keyboard navigation
    this.on(this.input, 'keydown', this.handleInputKeydown);

    // Search input
    this.on(this.input, 'input', this.handleSearch);

    // Click on items
    this.on(this.results, 'click', this.handleResultsClick);

    // Hover to highlight
    this.on(this.results, 'mousemove', this.handleResultsMousemove);

    // Close on overlay click
    if (this.overlay !== this.el) {
      this.on(this.overlay, 'click', this.handleOverlayClick);
    }

    // Global keyboard shortcut (Ctrl+K or Cmd+K)
    if (this.options.enableShortcut && this.options.shortcut) {
      this.on(document, 'keydown', this.handleGlobalKeydown);
    }
  }

  handleInputKeydown(e) {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.highlightNext();
        break;
      case 'ArrowUp':
        e.preventDefault();
        this.highlightPrev();
        break;
      case 'Enter':
        e.preventDefault();
        this.selectHighlighted();
        break;
      case 'Escape':
        if (this.options.closeOnEscape) {
          e.preventDefault();
          this.close();
        }
        break;
      case 'Home':
        e.preventDefault();
        this.highlightIndex(0);
        break;
      case 'End':
        e.preventDefault();
        this.highlightIndex(this.visibleItems.length - 1);
        break;
    }
  }

  handleSearch() {
    this.search(this.input.value);
  }

  handleResultsClick(e) {
    const item = e.target.closest('.command-palette__item');
    if (item && !item.hasAttribute('disabled')) {
      e.preventDefault();
      this.selectItem(item);
    }
  }

  handleResultsMousemove(e) {
    const item = e.target.closest('.command-palette__item');
    if (item) {
      this.highlightItem(item);
    }
  }

  handleOverlayClick(e) {
    // Close if clicking on overlay background (not the palette itself)
    if (e.target === this.overlay) {
      this.close();
    }
  }

  handleGlobalKeydown(e) {
    const shortcutKey = this.options.shortcut.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === shortcutKey) {
      e.preventDefault();
      this.toggle();
    }
  }

  open() {
    if (this.isOpen) return;

    // Store current focus
    this.previouslyFocused = document.activeElement;

    this.isOpen = true;
    this.overlay.classList.add('is-open');
    this.input.setAttribute('aria-expanded', 'true');

    // Focus input
    this.input.focus();
    this.input.select();

    // Reset state
    this.updateItems();
    this.highlightIndex(0);

    // Create focus trap if available
    if (window.FocusUtils) {
      this.focusTrap = window.FocusUtils.createFocusTrap(this.el, {
        initialFocus: this.input,
        onEscape: this.options.closeOnEscape ? () => this.close() : null,
        returnFocus: false
      });
      this.focusTrap.activate();
    }

    this.emit('commandpalette:open');

    if (this.options.onOpen) {
      this.options.onOpen(this);
    }
  }

  close() {
    if (!this.isOpen) return;

    this.isOpen = false;
    this.overlay.classList.remove('is-open');
    this.input.setAttribute('aria-expanded', 'false');
    this.input.removeAttribute('aria-activedescendant');

    // Clear search
    this.input.value = '';
    this.resetSearch();

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

    this.emit('commandpalette:close');

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

  updateItems() {
    this.allItems = Array.from(this.results.querySelectorAll('.command-palette__item'));
    this.visibleItems = this.allItems.filter((item) => item.style.display !== 'none');
    this.setupItemsAria();
  }

  highlightIndex(index) {
    if (this.visibleItems.length === 0) {
      this.highlightedIndex = -1;
      return;
    }

    this.highlightedIndex = Math.max(0, Math.min(index, this.visibleItems.length - 1));
    this.updateHighlight();
  }

  highlightNext() {
    this.highlightIndex(this.highlightedIndex + 1);
  }

  highlightPrev() {
    this.highlightIndex(this.highlightedIndex - 1);
  }

  highlightItem(item) {
    const index = this.visibleItems.indexOf(item);
    if (index !== -1) {
      this.highlightIndex(index);
    }
  }

  updateHighlight() {
    // Update visual highlight
    this.allItems.forEach((item) => {
      item.classList.remove('is-highlighted');
      item.setAttribute('aria-selected', 'false');
    });

    const highlighted = this.visibleItems[this.highlightedIndex];
    if (highlighted) {
      highlighted.classList.add('is-highlighted');
      highlighted.setAttribute('aria-selected', 'true');

      // Update aria-activedescendant
      this.input.setAttribute('aria-activedescendant', highlighted.id);

      // Scroll into view
      highlighted.scrollIntoView({ block: 'nearest' });
    } else {
      this.input.removeAttribute('aria-activedescendant');
    }
  }

  selectHighlighted() {
    const item = this.visibleItems[this.highlightedIndex];
    if (item) {
      this.selectItem(item);
    }
  }

  selectItem(item) {
    const data = {
      id: item.dataset.id,
      value: item.dataset.value,
      action: item.dataset.action,
      title: item.querySelector('.command-palette__item-title')?.textContent || '',
      element: item
    };

    this.emit('commandpalette:select', data);

    if (this.options.onSelect) {
      this.options.onSelect(item, data);
    }

    if (this.options.closeOnSelect) {
      this.close();
    }
  }

  search(query) {
    const normalizedQuery = query.toLowerCase().trim();

    this.allItems.forEach((item) => {
      if (!normalizedQuery) {
        item.style.display = '';
        return;
      }

      const title = item.querySelector('.command-palette__item-title')?.textContent || '';
      const description = item.querySelector('.command-palette__item-description')?.textContent || '';
      const keywords = item.dataset.keywords || '';

      const matches =
        title.toLowerCase().includes(normalizedQuery) ||
        description.toLowerCase().includes(normalizedQuery) ||
        keywords.toLowerCase().includes(normalizedQuery);

      item.style.display = matches ? '' : 'none';
    });

    // Update visible items and reset highlight
    this.updateItems();
    this.highlightIndex(0);

    this.emit('commandpalette:search', { query: normalizedQuery, results: this.visibleItems.length });
  }

  resetSearch() {
    this.allItems.forEach((item) => {
      item.style.display = '';
    });
    this.updateItems();
    this.highlightIndex(0);
  }

  onDestroy() {
    // Ensure palette is closed
    if (this.isOpen) {
      this.overlay.classList.remove('is-open');
    }

    if (this.focusTrap) {
      this.focusTrap.deactivate();
      this.focusTrap = null;
    }
  }
}

/**
 * Initialize command palette functionality for a container
 * @param {HTMLElement} container
 * @returns {CommandPalette[]} Array of CommandPalette instances
 */
function initCommandpalette(container) {
  const instances = [];

  const palettes = container.querySelectorAll('.command-palette');
  palettes.forEach((palette) => {
    const instance = new CommandPalette(palette);
    instances.push(instance);
  });

  return instances;
}

// Export for use
if (typeof window !== 'undefined') {
  window.CommandPalette = CommandPalette;
}
