/**
 * Focus Utilities
 *
 * Helpers for focus management including focus trapping for modals,
 * querying focusable elements, and saving/restoring focus.
 *
 * Usage:
 * // Get all focusable elements in a container
 * const focusable = getFocusableElements(modal);
 *
 * // Create a focus trap for a modal
 * const trap = createFocusTrap(modal, {
 *   onEscape: () => closeModal(),
 *   initialFocus: modal.querySelector('.modal__close')
 * });
 * trap.activate();
 * // Later:
 * trap.deactivate();
 */

// Selector for all focusable elements
const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
  '[contenteditable="true"]',
  'audio[controls]',
  'video[controls]',
  'details > summary'
].join(', ');

/**
 * Get all focusable elements within a container
 * @param {HTMLElement} container
 * @returns {HTMLElement[]}
 */
function getFocusableElements(container) {
  const elements = Array.from(container.querySelectorAll(FOCUSABLE_SELECTOR));

  // Filter out elements that are not visible or are in a closed details
  return elements.filter((el) => {
    // Check if element is visible
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') {
      return false;
    }

    // Check if element is not hidden
    if (el.hidden || el.getAttribute('aria-hidden') === 'true') {
      return false;
    }

    return true;
  });
}

/**
 * Get the first focusable element in a container
 * @param {HTMLElement} container
 * @returns {HTMLElement|null}
 */
function getFirstFocusable(container) {
  const focusable = getFocusableElements(container);
  return focusable[0] || null;
}

/**
 * Get the last focusable element in a container
 * @param {HTMLElement} container
 * @returns {HTMLElement|null}
 */
function getLastFocusable(container) {
  const focusable = getFocusableElements(container);
  return focusable[focusable.length - 1] || null;
}

/**
 * Create a focus trap that keeps focus within a container
 * @param {HTMLElement} container - The element to trap focus within
 * @param {Object} options
 * @param {HTMLElement} options.initialFocus - Element to focus when activated
 * @param {HTMLElement} options.fallbackFocus - Fallback if initialFocus not found
 * @param {Function} options.onEscape - Callback when Escape is pressed
 * @param {boolean} options.returnFocus - Return focus to trigger element on deactivate (default: true)
 * @returns {Object} Focus trap controller
 */
function createFocusTrap(container, options = {}) {
  const {
    initialFocus = null,
    fallbackFocus = null,
    onEscape = null,
    returnFocus = true
  } = options;

  let active = false;
  let previouslyFocused = null;

  function handleKeydown(e) {
    if (!active) return;

    if (e.key === 'Escape' && onEscape) {
      e.preventDefault();
      onEscape();
      return;
    }

    if (e.key !== 'Tab') return;

    const focusable = getFocusableElements(container);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    // Shift + Tab on first element -> go to last
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
      return;
    }

    // Tab on last element -> go to first
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
      return;
    }

    // If focus is outside container, bring it back
    if (!container.contains(document.activeElement)) {
      e.preventDefault();
      first.focus();
    }
  }

  function handleFocusIn(e) {
    if (!active) return;

    // If focus moved outside the container, bring it back
    if (!container.contains(e.target)) {
      const first = getFirstFocusable(container);
      if (first) first.focus();
    }
  }

  function activate() {
    if (active) return;

    active = true;
    previouslyFocused = document.activeElement;

    // Add event listeners
    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('focusin', handleFocusIn);

    // Set initial focus
    requestAnimationFrame(() => {
      const target = initialFocus || getFirstFocusable(container) || fallbackFocus || container;
      if (target && target.focus) {
        target.focus();
      }
    });
  }

  function deactivate() {
    if (!active) return;

    active = false;

    // Remove event listeners
    document.removeEventListener('keydown', handleKeydown);
    document.removeEventListener('focusin', handleFocusIn);

    // Return focus to previous element
    if (returnFocus && previouslyFocused && previouslyFocused.focus) {
      previouslyFocused.focus();
    }

    previouslyFocused = null;
  }

  return {
    activate,
    deactivate,
    get isActive() { return active; }
  };
}

/**
 * Save the currently focused element
 * @returns {Function} Function to restore focus
 */
function saveFocus() {
  const focused = document.activeElement;

  return function restoreFocus() {
    if (focused && focused.focus && document.body.contains(focused)) {
      focused.focus();
    }
  };
}

/**
 * Move focus to an element, optionally scrolling it into view
 * @param {HTMLElement} element
 * @param {Object} options
 * @param {boolean} options.preventScroll - Don't scroll element into view
 */
function focusElement(element, options = {}) {
  if (!element || !element.focus) return;

  element.focus({ preventScroll: options.preventScroll });
}

/**
 * Check if an element is focusable
 * @param {HTMLElement} element
 * @returns {boolean}
 */
function isFocusable(element) {
  if (!element) return false;
  return element.matches(FOCUSABLE_SELECTOR) && element.offsetParent !== null;
}

// Export for ES modules and browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    FOCUSABLE_SELECTOR,
    getFocusableElements,
    getFirstFocusable,
    getLastFocusable,
    createFocusTrap,
    saveFocus,
    focusElement,
    isFocusable
  };
}
if (typeof window !== 'undefined') {
  window.FocusUtils = {
    FOCUSABLE_SELECTOR,
    getFocusableElements,
    getFirstFocusable,
    getLastFocusable,
    createFocusTrap,
    saveFocus,
    focusElement,
    isFocusable
  };
}
