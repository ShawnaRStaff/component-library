/**
 * Component Library Preview System
 * Variant-based navigation with expandable tree
 */

// Component registry with categories
const componentRegistry = [
  // Atoms
  { name: 'avatar', label: 'Avatar', category: 'atoms' },
  { name: 'badge', label: 'Badge', category: 'atoms' },
  { name: 'button', label: 'Button', category: 'atoms' },
  { name: 'checkbox', label: 'Checkbox', category: 'atoms' },
  { name: 'divider', label: 'Divider', category: 'atoms' },
  { name: 'input', label: 'Input', category: 'atoms' },
  { name: 'kbd', label: 'Kbd', category: 'atoms' },
  { name: 'logo', label: 'Logo', category: 'atoms' },
  { name: 'radio', label: 'Radio', category: 'atoms' },
  { name: 'slider', label: 'Slider', category: 'atoms' },
  { name: 'spinner', label: 'Spinner', category: 'atoms' },
  { name: 'tag', label: 'Tag', category: 'atoms' },
  { name: 'textarea', label: 'Textarea', category: 'atoms' },
  { name: 'toggle', label: 'Toggle', category: 'atoms' },
  { name: 'tooltip', label: 'Tooltip', category: 'atoms' },
  // Layout
  { name: 'aspect-ratio', label: 'Aspect Ratio', category: 'layout' },
  { name: 'container', label: 'Container', category: 'layout' },
  { name: 'grid', label: 'Grid', category: 'layout' },
  { name: 'stack', label: 'Stack', category: 'layout' },
  // Molecules
  { name: 'accordion', label: 'Accordion', category: 'molecules' },
  { name: 'alert', label: 'Alert', category: 'molecules' },
  { name: 'breadcrumb', label: 'Breadcrumb', category: 'molecules' },
  { name: 'card', label: 'Card', category: 'molecules' },
  { name: 'carousel', label: 'Carousel', category: 'molecules' },
  { name: 'code-block', label: 'Code Block', category: 'molecules' },
  { name: 'command-palette', label: 'Command Palette', category: 'molecules' },
  { name: 'date-picker', label: 'Date Picker', category: 'molecules' },
  { name: 'empty-state', label: 'Empty State', category: 'molecules' },
  { name: 'file-upload', label: 'File Upload', category: 'molecules' },
  { name: 'form-group', label: 'Form Group', category: 'molecules' },
  { name: 'list', label: 'List', category: 'molecules' },
  { name: 'menu', label: 'Menu', category: 'molecules' },
  { name: 'modal', label: 'Modal', category: 'molecules' },
  { name: 'pagination', label: 'Pagination', category: 'molecules' },
  { name: 'popover', label: 'Popover', category: 'molecules' },
  { name: 'progress', label: 'Progress', category: 'molecules' },
  { name: 'rating', label: 'Rating', category: 'molecules' },
  { name: 'search', label: 'Search', category: 'molecules' },
  { name: 'select', label: 'Select', category: 'molecules' },
  { name: 'skeleton', label: 'Skeleton', category: 'molecules' },
  { name: 'stat', label: 'Stat', category: 'molecules' },
  { name: 'steps', label: 'Steps', category: 'molecules' },
  { name: 'table', label: 'Table', category: 'molecules' },
  { name: 'tabs', label: 'Tabs', category: 'molecules' },
  { name: 'timeline', label: 'Timeline', category: 'molecules' },
  { name: 'toast', label: 'Toast', category: 'molecules' },
  { name: 'tree-view', label: 'Tree View', category: 'molecules' },
  // Organisms
  { name: 'drawer', label: 'Drawer', category: 'organisms' },
  { name: 'footer', label: 'Footer', category: 'organisms' },
  { name: 'navbar', label: 'Navbar', category: 'organisms' },
  { name: 'sidebar', label: 'Sidebar', category: 'organisms' },
];

class ComponentPreview {
  constructor() {
    // DOM Elements
    this.treeContainer = document.getElementById('component-tree');
    this.previewFrame = document.getElementById('preview-frame');
    this.titleEl = document.getElementById('component-title');
    this.codePanel = document.getElementById('code-panel');
    this.codeDisplay = document.getElementById('code-display');
    this.searchInput = document.getElementById('component-search');
    this.toast = document.getElementById('toast');

    // State
    this.components = new Map(); // component name -> config
    this.currentComponent = null;
    this.currentVariant = null;
    this.currentCode = { html: '', css: '', js: '' };
    this.currentTab = 'html';
    this.expandedComponents = new Set();

    this.init();
  }

  async init() {
    await this.loadComponentConfigs();
    this.renderTree();
    this.bindEvents();
    this.loadFromHash();
  }

  // Load all component configs
  async loadComponentConfigs() {
    const loadPromises = componentRegistry.map(async (comp) => {
      try {
        const response = await fetch(`components/${comp.name}/config.json`);
        if (response.ok) {
          const config = await response.json();
          this.components.set(comp.name, { ...comp, ...config });
        } else {
          // Fallback: create default config from demo.html
          this.components.set(comp.name, {
            ...comp,
            variants: [{ id: 'default', label: 'Default', file: 'demo.html' }]
          });
        }
      } catch {
        // Fallback for components without config.json
        this.components.set(comp.name, {
          ...comp,
          variants: [{ id: 'default', label: 'Default', file: 'demo.html' }]
        });
      }
    });

    await Promise.all(loadPromises);
  }

  // Render the component tree
  renderTree(filter = '') {
    const filterLower = filter.toLowerCase();

    // Group by category
    const grouped = {
      atoms: [],
      layout: [],
      molecules: [],
      organisms: []
    };

    this.components.forEach((config, name) => {
      if (filter && !config.label.toLowerCase().includes(filterLower) &&
          !name.toLowerCase().includes(filterLower)) {
        return;
      }
      if (grouped[config.category]) {
        grouped[config.category].push({ name, ...config });
      }
    });

    let html = '';

    const categories = [
      { key: 'atoms', label: 'Atoms' },
      { key: 'layout', label: 'Layout' },
      { key: 'molecules', label: 'Molecules' },
      { key: 'organisms', label: 'Organisms' }
    ];

    categories.forEach(({ key, label }) => {
      const items = grouped[key];
      if (items.length === 0) return;

      html += `<li class="tree-category">${label}</li>`;

      items.forEach((comp) => {
        const isExpanded = this.expandedComponents.has(comp.name);
        const isActive = this.currentComponent === comp.name;

        html += `
          <li class="tree-item ${isExpanded ? 'is-expanded' : ''}" data-component="${comp.name}">
            <button class="tree-toggle ${isActive && !this.currentVariant ? 'is-active' : ''}">
              <svg class="tree-toggle-icon" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 4l4 4-4 4V4z"/>
              </svg>
              ${comp.label}
            </button>
            <ul class="tree-variants">
              ${(comp.variants || []).map(v => `
                <li class="tree-variant ${this.currentComponent === comp.name && this.currentVariant === v.id ? 'is-active' : ''}"
                    data-component="${comp.name}"
                    data-variant="${v.id}">
                  ${v.label}
                </li>
              `).join('')}
            </ul>
          </li>
        `;
      });
    });

    if (html === '') {
      html = '<li class="tree-category" style="color: var(--text-tertiary);">No components found</li>';
    }

    this.treeContainer.innerHTML = html;
  }

  // Bind events
  bindEvents() {
    // Tree navigation
    this.treeContainer.addEventListener('click', (e) => {
      const toggle = e.target.closest('.tree-toggle');
      const variant = e.target.closest('.tree-variant');

      if (toggle) {
        const item = toggle.closest('.tree-item');
        const componentName = item.dataset.component;
        this.toggleComponent(componentName);
      } else if (variant) {
        const componentName = variant.dataset.component;
        const variantId = variant.dataset.variant;
        this.loadVariant(componentName, variantId);
      }
    });

    // Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.renderTree(e.target.value);
      });

      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.searchInput.value = '';
          this.renderTree();
        }
      });
    }

    // Hash change
    window.addEventListener('hashchange', () => this.loadFromHash());

    // Theme toggle
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
      themeToggle.addEventListener('click', () => this.toggleTheme());
    }

    // Copy code
    const copyBtn = document.getElementById('copy-code');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCode());
    }

    // View code
    const viewCodeBtn = document.getElementById('view-code');
    if (viewCodeBtn) {
      viewCodeBtn.addEventListener('click', () => this.toggleCodePanel());
    }

    // Close code panel
    const closeCodeBtn = document.getElementById('close-code-panel');
    if (closeCodeBtn) {
      closeCodeBtn.addEventListener('click', () => this.toggleCodePanel());
    }

    // Code tabs
    document.querySelectorAll('.code-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        this.switchCodeTab(tab.dataset.tab);
      });
    });

    // Mobile nav toggle
    const mobileToggle = document.getElementById('mobile-nav-toggle');
    const sidebar = document.querySelector('.app-sidebar');
    if (mobileToggle && sidebar) {
      mobileToggle.addEventListener('click', () => {
        sidebar.classList.toggle('is-open');
      });
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('preview-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  // Toggle component expansion
  toggleComponent(name) {
    if (this.expandedComponents.has(name)) {
      this.expandedComponents.delete(name);
    } else {
      this.expandedComponents.add(name);
    }

    // Update DOM
    const item = this.treeContainer.querySelector(`[data-component="${name}"].tree-item`);
    if (item) {
      item.classList.toggle('is-expanded', this.expandedComponents.has(name));
    }
  }

  // Load from URL hash
  loadFromHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) return;

    const [component, variant] = hash.split('/');
    if (component) {
      this.expandedComponents.add(component);
      this.loadVariant(component, variant || 'default');
    }
  }

  // Load a specific variant
  async loadVariant(componentName, variantId) {
    const config = this.components.get(componentName);
    if (!config) return;

    const variant = config.variants?.find(v => v.id === variantId) || config.variants?.[0];
    if (!variant) return;

    console.log('Loading variant:', componentName, variantId, 'File:', variant.file);

    // Update state
    this.currentComponent = componentName;
    this.currentVariant = variantId;
    this.expandedComponents.add(componentName);

    // Update URL
    window.history.replaceState(null, '', `#${componentName}/${variantId}`);

    // Update title
    this.titleEl.textContent = `${config.label} - ${variant.label}`;

    // Update tree active states
    this.renderTree(this.searchInput?.value || '');

    // Load variant HTML
    try {
      const variantPath = variant.file.startsWith('variants/')
        ? `components/${componentName}/${variant.file}`
        : `components/${componentName}/${variant.file}`;

      const html = await this.fetchFile(variantPath);
      this.currentCode.html = html;
      this.previewFrame.innerHTML = html;

      // Load CSS and JS for code panel
      this.currentCode.css = await this.fetchFile(`components/${componentName}/${componentName}.css`).catch(() => '');
      this.currentCode.js = await this.fetchFile(`components/${componentName}/${componentName}.js`).catch(() => '');

      // Update code display if panel is open
      if (!this.codePanel.classList.contains('is-hidden')) {
        this.updateCodeDisplay();
      }

      // Initialize component JS
      await this.loadComponentJS(componentName);
      this.initializeComponent(componentName);

    } catch (err) {
      this.previewFrame.innerHTML = `<p class="preview-empty">Failed to load variant: ${err.message}</p>`;
    }
  }

  // Fetch file content
  async fetchFile(path) {
    const response = await fetch(path);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.text();
  }

  // Load component JavaScript
  async loadComponentJS(name) {
    const existingScript = document.getElementById('component-js');
    if (existingScript) existingScript.remove();

    const script = document.createElement('script');
    script.id = 'component-js';
    script.src = `components/${name}/${name}.js`;
    document.body.appendChild(script);

    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => resolve(); // Don't fail if no JS
    });
  }

  // Initialize component
  initializeComponent(name) {
    const initName = `init${this.capitalize(name.replace(/-/g, ''))}`;
    if (typeof window[initName] === 'function') {
      try {
        window[initName](this.previewFrame);
      } catch (e) {
        console.warn(`Error initializing ${name}:`, e);
      }
    }
  }

  // Toggle theme
  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('preview-theme', next);
  }

  // Toggle code panel
  toggleCodePanel() {
    this.codePanel.classList.toggle('is-hidden');
    if (!this.codePanel.classList.contains('is-hidden')) {
      this.updateCodeDisplay();
    }
  }

  // Switch code tab
  switchCodeTab(tab) {
    this.currentTab = tab;

    document.querySelectorAll('.code-tab').forEach(t => {
      t.classList.toggle('is-active', t.dataset.tab === tab);
    });

    this.updateCodeDisplay();
  }

  // Update code display
  updateCodeDisplay() {
    const code = this.currentCode[this.currentTab] || '';
    this.codeDisplay.textContent = code;
  }

  // Copy current code
  async copyCode() {
    const code = this.currentCode[this.currentTab] || this.currentCode.html;
    if (!code) {
      this.showToast('No code to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(code);
      this.showToast('Code copied!');
    } catch {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = code;
      textarea.style.cssText = 'position:fixed;opacity:0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('Code copied!');
    }
  }

  // Show toast
  showToast(message) {
    if (!this.toast) return;
    this.toast.textContent = message;
    this.toast.classList.add('is-visible');
    setTimeout(() => this.toast.classList.remove('is-visible'), 2000);
  }

  // Capitalize
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.preview = new ComponentPreview();
});
