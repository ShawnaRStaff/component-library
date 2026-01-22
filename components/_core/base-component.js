/**
 * Base Component
 *
 * Foundation class for all interactive components. Provides:
 * - Automatic event listener tracking and cleanup
 * - WeakMap-based instance management
 * - Consistent init/destroy lifecycle
 *
 * Usage:
 * class MyComponent extends BaseComponent {
 *   static get selector() { return '.my-component'; }
 *
 *   init() {
 *     // Use this.on() instead of addEventListener
 *     this.on(this.el, 'click', this.handleClick);
 *     this.on(document, 'keydown', this.handleKeydown);
 *   }
 *
 *   onDestroy() {
 *     // Optional: additional cleanup logic
 *   }
 * }
 *
 * // Initialize
 * const instance = new MyComponent(element, options);
 *
 * // Later, clean up
 * instance.destroy();
 */

class BaseComponent {
  /**
   * CSS selector for auto-initialization (override in subclass)
   * @returns {string|null}
   */
  static get selector() {
    return null;
  }

  /**
   * Get the instances WeakMap for this class (creates if needed)
   * Each subclass gets its own WeakMap to avoid conflicts
   * @private
   */
  static _getInstances() {
    // Create a WeakMap for this specific class if it doesn't have one
    if (!this.hasOwnProperty('_instances')) {
      this._instances = new WeakMap();
    }
    return this._instances;
  }

  /**
   * Get existing instance for an element
   * @param {HTMLElement} element
   * @returns {BaseComponent|null}
   */
  static getInstance(element) {
    return this._getInstances().get(element) || null;
  }

  /**
   * Get or create instance for an element
   * @param {HTMLElement} element
   * @param {Object} options
   * @returns {BaseComponent}
   */
  static getOrCreateInstance(element, options = {}) {
    return this.getInstance(element) || new this(element, options);
  }

  /**
   * Initialize all components matching the selector within a container
   * @param {HTMLElement} container
   * @param {Object} options - Default options for all instances
   * @returns {BaseComponent[]} Array of created instances
   */
  static initAll(container = document, options = {}) {
    if (!this.selector) return [];

    const elements = container.querySelectorAll(this.selector);
    const instances = [];

    elements.forEach((element) => {
      // Skip if already initialized
      if (!this.getInstance(element)) {
        instances.push(new this(element, options));
      }
    });

    return instances;
  }

  /**
   * Destroy all instances within a container
   * @param {HTMLElement} container
   */
  static destroyAll(container = document) {
    if (!this.selector) return;

    const elements = container.querySelectorAll(this.selector);
    elements.forEach((element) => {
      const instance = this.getInstance(element);
      if (instance) {
        instance.destroy();
      }
    });
  }

  /**
   * Create a new component instance
   * @param {HTMLElement} element - The root element for this component
   * @param {Object} options - Configuration options
   */
  constructor(element, options = {}) {
    if (!element) {
      throw new Error(`${this.constructor.name}: Element is required`);
    }

    // Check for existing instance
    const existing = this.constructor.getInstance(element);
    if (existing) {
      console.warn(`${this.constructor.name}: Instance already exists for element`);
      return existing;
    }

    this.el = element;
    this.options = { ...this.constructor.defaults, ...options };
    this._events = new EventManager();
    this._isDestroyed = false;

    // Store instance reference (using the class-specific WeakMap)
    this.constructor._getInstances().set(element, this);

    // Initialize the component
    this.init();
  }

  /**
   * Default options (override in subclass)
   */
  static get defaults() {
    return {};
  }

  /**
   * Initialize the component (override in subclass)
   * Called automatically after construction
   */
  init() {
    // Override in subclass
  }

  /**
   * Add an event listener with automatic tracking
   * The handler is automatically bound to this instance
   * @param {EventTarget} target
   * @param {string} event
   * @param {Function} handler
   * @param {Object|boolean} options
   * @returns {Function} Cleanup function
   */
  on(target, event, handler, options) {
    return this._events.on(target, event, handler.bind(this), options);
  }

  /**
   * Add a one-time event listener
   * @param {EventTarget} target
   * @param {string} event
   * @param {Function} handler
   * @param {Object} options
   * @returns {Function} Cleanup function
   */
  once(target, event, handler, options) {
    return this._events.once(target, event, handler.bind(this), options);
  }

  /**
   * Emit a custom event from this component's element
   * @param {string} eventName
   * @param {Object} detail - Event detail data
   * @returns {boolean} False if event was cancelled
   */
  emit(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      bubbles: true,
      cancelable: true,
      detail: { ...detail, instance: this }
    });
    return this.el.dispatchEvent(event);
  }

  /**
   * Query within this component's element
   * @param {string} selector
   * @returns {HTMLElement|null}
   */
  find(selector) {
    return this.el.querySelector(selector);
  }

  /**
   * Query all within this component's element
   * @param {string} selector
   * @returns {NodeList}
   */
  findAll(selector) {
    return this.el.querySelectorAll(selector);
  }

  /**
   * Cleanup hook (override in subclass)
   * Called before event listeners are removed
   */
  onDestroy() {
    // Override in subclass for custom cleanup
  }

  /**
   * Destroy the component and clean up all resources
   */
  destroy() {
    if (this._isDestroyed) return;

    // Call cleanup hook
    this.onDestroy();

    // Remove all event listeners
    this._events.destroy();

    // Remove instance reference
    this.constructor._getInstances().delete(this.el);

    this._isDestroyed = true;
  }

  /**
   * Check if the component has been destroyed
   * @returns {boolean}
   */
  get isDestroyed() {
    return this._isDestroyed;
  }
}

// Export for ES modules and browser globals
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BaseComponent;
}
if (typeof window !== 'undefined') {
  window.BaseComponent = BaseComponent;
}
