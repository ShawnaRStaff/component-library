/**
 * Keyboard Navigation Utilities
 *
 * Reusable patterns for keyboard navigation in lists, menus, and other
 * components. Implements WAI-ARIA best practices.
 *
 * Usage:
 * // Arrow key navigation for a list
 * const nav = createArrowNavigation({
 *   container: listElement,
 *   itemSelector: '.list-item',
 *   onSelect: (item) => item.click(),
 *   orientation: 'vertical'
 * });
 *
 * // Type-ahead search in a list
 * const typeahead = createTypeahead({
 *   items: listItems,
 *   textSelector: '.item-label',
 *   onMatch: (item) => item.focus()
 * });
 */

/**
 * Create arrow key navigation handler for a list of items
 * @param {Object} options
 * @param {HTMLElement} options.container - Container element
 * @param {string} options.itemSelector - Selector for navigable items
 * @param {Function} options.onSelect - Callback when Enter/Space is pressed on item
 * @param {string} options.orientation - 'vertical' (Up/Down) or 'horizontal' (Left/Right) or 'both'
 * @param {boolean} options.wrap - Wrap around at ends (default: true)
 * @param {boolean} options.focusOnHover - Focus items on mouse hover (default: false)
 * @param {Function} options.isItemDisabled - Function to check if item is disabled
 * @returns {Object} Navigation controller with handleKeydown method
 */
function createArrowNavigation(options = {}) {
  const {
    container,
    itemSelector,
    onSelect = null,
    orientation = 'vertical',
    wrap = true,
    focusOnHover = false,
    isItemDisabled = (item) => item.hasAttribute('disabled') || item.getAttribute('aria-disabled') === 'true'
  } = options;

  function getItems() {
    return Array.from(container.querySelectorAll(itemSelector)).filter(
      (item) => !isItemDisabled(item) && item.offsetParent !== null
    );
  }

  function getCurrentIndex(items) {
    const focused = document.activeElement;
    return items.indexOf(focused);
  }

  function focusItem(items, index) {
    if (index >= 0 && index < items.length) {
      items[index].focus();
    }
  }

  function handleKeydown(e) {
    const items = getItems();
    if (items.length === 0) return;

    const currentIndex = getCurrentIndex(items);
    let newIndex = currentIndex;
    let handled = false;

    // Determine which keys to handle based on orientation
    const prevKeys = orientation === 'horizontal' ? ['ArrowLeft'] :
                     orientation === 'vertical' ? ['ArrowUp'] :
                     ['ArrowUp', 'ArrowLeft'];

    const nextKeys = orientation === 'horizontal' ? ['ArrowRight'] :
                     orientation === 'vertical' ? ['ArrowDown'] :
                     ['ArrowDown', 'ArrowRight'];

    if (prevKeys.includes(e.key)) {
      handled = true;
      if (currentIndex > 0) {
        newIndex = currentIndex - 1;
      } else if (wrap) {
        newIndex = items.length - 1;
      }
    } else if (nextKeys.includes(e.key)) {
      handled = true;
      if (currentIndex < items.length - 1) {
        newIndex = currentIndex + 1;
      } else if (wrap) {
        newIndex = 0;
      }
    } else if (e.key === 'Home') {
      handled = true;
      newIndex = 0;
    } else if (e.key === 'End') {
      handled = true;
      newIndex = items.length - 1;
    } else if ((e.key === 'Enter' || e.key === ' ') && onSelect) {
      if (currentIndex >= 0) {
        e.preventDefault();
        onSelect(items[currentIndex], currentIndex);
      }
      return;
    }

    if (handled) {
      e.preventDefault();
      focusItem(items, newIndex);
    }
  }

  function handleMouseEnter(e) {
    if (!focusOnHover) return;

    const item = e.target.closest(itemSelector);
    if (item && !isItemDisabled(item)) {
      item.focus();
    }
  }

  // Return controller object
  return {
    handleKeydown,
    handleMouseEnter,
    getItems,
    focusFirst() {
      const items = getItems();
      if (items.length > 0) items[0].focus();
    },
    focusLast() {
      const items = getItems();
      if (items.length > 0) items[items.length - 1].focus();
    },
    focusItem(index) {
      const items = getItems();
      focusItem(items, index);
    }
  };
}

/**
 * Create type-ahead search for a list
 * @param {Object} options
 * @param {Function} options.getItems - Function that returns current items
 * @param {Function} options.getItemText - Function to get searchable text from item
 * @param {Function} options.onMatch - Callback when a match is found
 * @param {number} options.timeout - Time to reset search buffer (default: 500ms)
 * @returns {Object} Typeahead controller with handleKeypress method
 */
function createTypeahead(options = {}) {
  const {
    getItems,
    getItemText = (item) => item.textContent.trim(),
    onMatch,
    timeout = 500
  } = options;

  let searchBuffer = '';
  let searchTimeout = null;

  function handleKeypress(e) {
    // Only handle printable characters
    if (e.key.length !== 1 || e.ctrlKey || e.metaKey || e.altKey) {
      return;
    }

    // Clear previous timeout
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Add to search buffer
    searchBuffer += e.key.toLowerCase();

    // Search for match
    const items = getItems();
    const match = items.find((item) => {
      const text = getItemText(item).toLowerCase();
      return text.startsWith(searchBuffer);
    });

    if (match && onMatch) {
      onMatch(match);
    }

    // Reset buffer after timeout
    searchTimeout = setTimeout(() => {
      searchBuffer = '';
    }, timeout);
  }

  function reset() {
    searchBuffer = '';
    if (searchTimeout) {
      clearTimeout(searchTimeout);
      searchTimeout = null;
    }
  }

  return {
    handleKeypress,
    reset,
    get buffer() { return searchBuffer; }
  };
}

/**
 * Create a roving tabindex manager for a group of items
 * Only one item in the group should be tabbable at a time
 * @param {Object} options
 * @param {HTMLElement} options.container
 * @param {string} options.itemSelector
 * @param {number} options.initialIndex - Initial active index (default: 0)
 * @returns {Object} Controller
 */
function createRovingTabindex(options = {}) {
  const {
    container,
    itemSelector,
    initialIndex = 0
  } = options;

  let activeIndex = initialIndex;

  function getItems() {
    return Array.from(container.querySelectorAll(itemSelector));
  }

  function update(newIndex) {
    const items = getItems();
    items.forEach((item, index) => {
      if (index === newIndex) {
        item.setAttribute('tabindex', '0');
      } else {
        item.setAttribute('tabindex', '-1');
      }
    });
    activeIndex = newIndex;
  }

  // Initialize
  update(initialIndex);

  return {
    update,
    getActiveIndex() { return activeIndex; },
    getItems
  };
}

// Export for ES modules and browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    createArrowNavigation,
    createTypeahead,
    createRovingTabindex
  };
}
if (typeof window !== 'undefined') {
  window.KeyboardNav = {
    createArrowNavigation,
    createTypeahead,
    createRovingTabindex
  };
}
