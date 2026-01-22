/**
 * Core Component Utilities
 *
 * This file exports all core utilities for use in component JavaScript.
 * In a browser environment, these are available as window globals:
 * - window.EventManager
 * - window.BaseComponent
 * - window.FocusUtils
 * - window.KeyboardNav
 *
 * Usage in HTML:
 * <script src="components/_core/event-manager.js"></script>
 * <script src="components/_core/base-component.js"></script>
 * <script src="components/_core/focus-utils.js"></script>
 * <script src="components/_core/keyboard-nav.js"></script>
 *
 * Or load this index which loads all:
 * <script src="components/_core/index.js" type="module"></script>
 */

// For ES module environments, re-export everything
// Note: In browser without bundler, each file self-registers on window

// Track component instances globally for debugging
if (typeof window !== 'undefined') {
  window.__componentInstances = window.__componentInstances || new Map();

  // Helper to get all active component instances (for debugging)
  window.getComponentInstances = function(componentName) {
    if (componentName) {
      return window.__componentInstances.get(componentName) || [];
    }
    return window.__componentInstances;
  };

  // Helper to destroy all component instances
  window.destroyAllComponents = function() {
    for (const [name, instances] of window.__componentInstances) {
      instances.forEach((instance) => {
        if (instance && typeof instance.destroy === 'function') {
          instance.destroy();
        }
      });
    }
    window.__componentInstances.clear();
  };
}

// Version info
const VERSION = '1.0.0';

if (typeof window !== 'undefined') {
  window.ComponentLibrary = {
    version: VERSION,
    EventManager: window.EventManager,
    BaseComponent: window.BaseComponent,
    FocusUtils: window.FocusUtils,
    KeyboardNav: window.KeyboardNav
  };
}
