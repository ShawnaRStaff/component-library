/**
 * Event Manager
 *
 * Tracks event listeners and provides centralized cleanup to prevent memory leaks.
 * Used by BaseComponent to automatically clean up all listeners on destroy.
 *
 * Usage:
 * const events = new EventManager();
 * events.on(element, 'click', handler);
 * events.on(document, 'keydown', handler);
 * // Later, remove all listeners at once:
 * events.destroy();
 */

class EventManager {
  constructor() {
    this._listeners = [];
  }

  /**
   * Add an event listener and track it for later cleanup
   * @param {EventTarget} target - The element or object to attach the listener to
   * @param {string} event - The event name (e.g., 'click', 'keydown')
   * @param {Function} handler - The event handler function
   * @param {Object|boolean} options - Event listener options (capture, passive, once)
   * @returns {Function} A function to remove this specific listener
   */
  on(target, event, handler, options) {
    target.addEventListener(event, handler, options);

    const entry = { target, event, handler, options };
    this._listeners.push(entry);

    // Return a cleanup function for this specific listener
    return () => this._remove(entry);
  }

  /**
   * Add a one-time event listener
   * @param {EventTarget} target - The element or object to attach the listener to
   * @param {string} event - The event name
   * @param {Function} handler - The event handler function
   * @param {Object} options - Additional event listener options
   * @returns {Function} A function to remove this specific listener
   */
  once(target, event, handler, options = {}) {
    return this.on(target, event, handler, { ...options, once: true });
  }

  /**
   * Remove a specific listener entry
   * @private
   */
  _remove(entry) {
    const { target, event, handler, options } = entry;
    target.removeEventListener(event, handler, options);

    const index = this._listeners.indexOf(entry);
    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }

  /**
   * Remove all tracked event listeners
   * Call this when destroying a component to prevent memory leaks
   */
  destroy() {
    for (const { target, event, handler, options } of this._listeners) {
      target.removeEventListener(event, handler, options);
    }
    this._listeners = [];
  }

  /**
   * Get the number of tracked listeners (useful for debugging)
   * @returns {number}
   */
  get count() {
    return this._listeners.length;
  }
}

// Export for ES modules and browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EventManager;
}
if (typeof window !== 'undefined') {
  window.EventManager = EventManager;
}
