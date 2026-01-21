/**
 * Tabs Component
 *
 * Accessible tab interface with keyboard navigation.
 * Uses BaseComponent for proper event cleanup.
 *
 * Usage:
 * const tabs = new Tabs(element, {
 *   onChange: (index, tab, panel) => console.log(index)
 * });
 *
 * tabs.switchTo(1);
 * tabs.destroy();
 */

class Tabs extends BaseComponent {
  static get selector() {
    return '.tabs';
  }

  static get defaults() {
    return {
      onChange: null,
      activateOnFocus: true // Activate tab when it receives focus
    };
  }

  init() {
    // Cache elements
    this.tabList = this.find('.tabs__list');
    this.tabButtons = Array.from(this.findAll('.tabs__tab'));
    this.tabPanels = Array.from(this.findAll('.tabs__panel'));

    if (!this.tabList || this.tabButtons.length === 0) {
      console.warn('Tabs: Missing tab list or tabs');
      return;
    }

    // State
    this.currentIndex = 0;
    this.isVertical = this.el.classList.contains('tabs--vertical');

    // Find initially active tab
    this.tabButtons.forEach((tab, index) => {
      if (tab.classList.contains('is-active')) {
        this.currentIndex = index;
      }
    });

    // Set up ARIA attributes
    this.setupAria();

    // Bind events
    this.bindEvents();
  }

  setupAria() {
    // Tab list
    this.tabList.setAttribute('role', 'tablist');
    if (this.isVertical) {
      this.tabList.setAttribute('aria-orientation', 'vertical');
    }

    // Generate unique ID base
    const idBase = this.el.id || `tabs-${Date.now()}`;

    // Tabs and panels
    this.tabButtons.forEach((tab, index) => {
      const isActive = index === this.currentIndex;
      const tabId = tab.id || `${idBase}-tab-${index}`;
      const panelId = this.tabPanels[index]?.id || `${idBase}-panel-${index}`;

      tab.id = tabId;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
      tab.setAttribute('aria-controls', panelId);

      if (this.tabPanels[index]) {
        this.tabPanels[index].id = panelId;
        this.tabPanels[index].setAttribute('role', 'tabpanel');
        this.tabPanels[index].setAttribute('aria-labelledby', tabId);
        this.tabPanels[index].setAttribute('tabindex', '0');
      }
    });
  }

  bindEvents() {
    // Tab click
    this.tabButtons.forEach((tab, index) => {
      this.on(tab, 'click', () => this.switchTo(index));
    });

    // Keyboard navigation
    this.on(this.tabList, 'keydown', this.handleKeydown);
  }

  handleKeydown(e) {
    const prevKey = this.isVertical ? 'ArrowUp' : 'ArrowLeft';
    const nextKey = this.isVertical ? 'ArrowDown' : 'ArrowRight';

    let newIndex = this.currentIndex;
    let handled = false;

    switch (e.key) {
      case prevKey:
        handled = true;
        newIndex = this.findPrevEnabled(this.currentIndex);
        break;

      case nextKey:
        handled = true;
        newIndex = this.findNextEnabled(this.currentIndex);
        break;

      case 'Home':
        handled = true;
        newIndex = this.findNextEnabled(-1);
        break;

      case 'End':
        handled = true;
        newIndex = this.findPrevEnabled(this.tabButtons.length);
        break;
    }

    if (handled) {
      e.preventDefault();
      if (newIndex !== this.currentIndex) {
        if (this.options.activateOnFocus) {
          this.switchTo(newIndex);
        }
        this.tabButtons[newIndex].focus();
      }
    }
  }

  findPrevEnabled(startIndex) {
    let index = startIndex - 1;
    while (index >= 0 && this.tabButtons[index].disabled) {
      index--;
    }
    return index >= 0 ? index : startIndex;
  }

  findNextEnabled(startIndex) {
    let index = startIndex + 1;
    while (index < this.tabButtons.length && this.tabButtons[index].disabled) {
      index++;
    }
    return index < this.tabButtons.length ? index : startIndex;
  }

  switchTo(index) {
    if (index < 0 || index >= this.tabButtons.length) return;
    if (this.tabButtons[index].disabled) return;
    if (index === this.currentIndex) return;

    // Update tabs
    this.tabButtons.forEach((tab, i) => {
      const isActive = i === index;
      tab.classList.toggle('is-active', isActive);
      tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
      tab.setAttribute('tabindex', isActive ? '0' : '-1');
    });

    // Update panels
    this.tabPanels.forEach((panel, i) => {
      panel.classList.toggle('is-active', i === index);
    });

    this.currentIndex = index;

    // Emit event
    this.emit('tabs:change', {
      index,
      tab: this.tabButtons[index],
      panel: this.tabPanels[index]
    });

    // Callback
    if (this.options.onChange) {
      this.options.onChange(index, this.tabButtons[index], this.tabPanels[index]);
    }
  }

  getCurrentIndex() {
    return this.currentIndex;
  }

  getCurrentTab() {
    return this.tabButtons[this.currentIndex];
  }

  getCurrentPanel() {
    return this.tabPanels[this.currentIndex];
  }
}

/**
 * Initialize tabs functionality for a container
 * @param {HTMLElement} container
 * @returns {Tabs[]} Array of Tabs instances
 */
function initTabs(container) {
  const instances = [];

  const tabGroups = container.querySelectorAll('.tabs');
  tabGroups.forEach((tabs) => {
    const instance = new Tabs(tabs);
    instances.push(instance);
  });

  return instances;
}

// Export for use
if (typeof window !== 'undefined') {
  window.Tabs = Tabs;
}
