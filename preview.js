/**
 * Component Library Preview System
 */

const components = [
  // Atoms - Basic building blocks
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
  // Layout - Structure and positioning
  { name: 'aspect-ratio', label: 'Aspect Ratio', category: 'layout' },
  { name: 'container', label: 'Container', category: 'layout' },
  { name: 'grid', label: 'Grid', category: 'layout' },
  { name: 'stack', label: 'Stack', category: 'layout' },
  // Molecules - Combinations of atoms
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
  // Organisms - Complex UI patterns
  { name: 'drawer', label: 'Drawer', category: 'organisms' },
  { name: 'footer', label: 'Footer', category: 'organisms' },
  { name: 'navbar', label: 'Navbar', category: 'organisms' },
  { name: 'sidebar', label: 'Sidebar', category: 'organisms' },
];

class ComponentPreview {
  constructor() {
    this.currentComponent = null;
    this.currentDemoHtml = '';
    this.currentCss = '';
    this.currentJs = '';
    this.currentTab = 'html';
    this.componentList = document.getElementById('component-list');
    this.componentTitle = document.getElementById('component-title');
    this.previewFrame = document.getElementById('component-preview');
    this.themeToggle = document.getElementById('theme-toggle');
    this.searchInput = document.getElementById('component-search');
    this.codePanel = document.getElementById('code-panel');
    this.codeContent = document.getElementById('code-content');
    this.mobileToggle = document.getElementById('mobile-nav-toggle');
    this.sidebar = document.querySelector('.preview-sidebar');

    // Track active component instances for cleanup
    this.activeInstances = [];

    this.init();
  }

  init() {
    this.renderNav();
    this.bindEvents();
    this.loadFromHash();
  }

  renderNav(filter = '') {
    const filterLower = filter.toLowerCase();
    const filteredComponents = filter
      ? components.filter(c =>
          c.label.toLowerCase().includes(filterLower) ||
          c.name.toLowerCase().includes(filterLower)
        )
      : components;

    // Group by category
    const grouped = {
      atoms: filteredComponents.filter(c => c.category === 'atoms'),
      layout: filteredComponents.filter(c => c.category === 'layout'),
      molecules: filteredComponents.filter(c => c.category === 'molecules'),
      organisms: filteredComponents.filter(c => c.category === 'organisms'),
    };

    let html = '';

    if (grouped.atoms.length > 0) {
      html += `<li class="nav-category">Atoms</li>`;
      html += grouped.atoms.map(comp => `
        <li>
          <a href="#${comp.name}" data-component="${comp.name}">
            ${comp.label}
          </a>
        </li>
      `).join('');
    }

    if (grouped.layout.length > 0) {
      html += `<li class="nav-category">Layout</li>`;
      html += grouped.layout.map(comp => `
        <li>
          <a href="#${comp.name}" data-component="${comp.name}">
            ${comp.label}
          </a>
        </li>
      `).join('');
    }

    if (grouped.molecules.length > 0) {
      html += `<li class="nav-category">Molecules</li>`;
      html += grouped.molecules.map(comp => `
        <li>
          <a href="#${comp.name}" data-component="${comp.name}">
            ${comp.label}
          </a>
        </li>
      `).join('');
    }

    if (grouped.organisms.length > 0) {
      html += `<li class="nav-category">Organisms</li>`;
      html += grouped.organisms.map(comp => `
        <li>
          <a href="#${comp.name}" data-component="${comp.name}">
            ${comp.label}
          </a>
        </li>
      `).join('');
    }

    if (filteredComponents.length === 0) {
      html = `<li class="nav-empty">No components found</li>`;
    }

    this.componentList.innerHTML = html;

    // Re-apply active state
    if (this.currentComponent) {
      this.updateActiveNav(this.currentComponent);
    }
  }

  bindEvents() {
    // Hash change navigation
    window.addEventListener('hashchange', () => this.loadFromHash());

    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());

    // Search
    if (this.searchInput) {
      this.searchInput.addEventListener('input', (e) => {
        this.renderNav(e.target.value);
      });

      // Clear search on Escape
      this.searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
          this.searchInput.value = '';
          this.renderNav();
        }
      });
    }

    // Code panel toggle
    const codeToggle = document.getElementById('code-toggle');
    if (codeToggle) {
      codeToggle.addEventListener('click', () => this.toggleCodePanel());
    }

    // Copy HTML buttons (legacy)
    const copyBtn = document.getElementById('copy-html');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCurrentCode());
    }

    const copyBtnInline = document.getElementById('copy-html-inline');
    if (copyBtnInline) {
      copyBtnInline.addEventListener('click', () => this.copyCurrentCode());
    }

    // Code panel tabs
    const codeTabs = document.querySelectorAll('.code-panel-tab');
    codeTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        if (tabName) {
          this.switchCodeTab(tabName);
        }
      });
    });

    // Copy code button in panel
    const copyCodeBtn = document.getElementById('copy-code');
    if (copyCodeBtn) {
      copyCodeBtn.addEventListener('click', () => this.copyCurrentCode());
    }

    // Mobile nav toggle
    if (this.mobileToggle) {
      this.mobileToggle.addEventListener('click', () => this.toggleMobileNav());
    }

    // Close mobile nav when clicking a link
    this.componentList.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        this.closeMobileNav();
      }
    });

    // Close mobile nav on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth > 768) {
        this.closeMobileNav();
      }
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('preview-theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
  }

  loadFromHash() {
    const hash = window.location.hash.slice(1);
    if (hash) {
      this.loadComponent(hash);
    }
  }

  /**
   * Destroy all active component instances to prevent memory leaks.
   * Called when switching between components in the preview.
   */
  destroyActiveInstances() {
    // Destroy tracked instances
    for (const instance of this.activeInstances) {
      if (instance && typeof instance.destroy === 'function') {
        try {
          instance.destroy();
        } catch (e) {
          console.warn('Error destroying component instance:', e);
        }
      }
    }
    this.activeInstances = [];

    // Also destroy any BaseComponent subclass instances within the preview frame
    // Check each known component class for instances
    const componentClasses = [
      'Modal', 'Drawer', 'Select', 'Menu', 'Tabs', 'Accordion',
      'CommandPalette', 'Toast', 'Popover', 'Carousel', 'DatePicker'
    ];

    if (this.previewFrame) {
      const allElements = this.previewFrame.querySelectorAll('*');
      allElements.forEach((el) => {
        // Try each component class to find an instance
        for (const className of componentClasses) {
          const ComponentClass = window[className];
          if (ComponentClass && typeof ComponentClass.getInstance === 'function') {
            const instance = ComponentClass.getInstance(el);
            if (instance && typeof instance.destroy === 'function') {
              try {
                instance.destroy();
              } catch (e) {
                console.warn(`Error destroying ${className} instance:`, e);
              }
              break; // Element can only have one component instance
            }
          }
        }
      });
    }

    // Call global destroy helper if available
    if (typeof window.destroyAllComponents === 'function') {
      window.destroyAllComponents();
    }
  }

  /**
   * Register a component instance for cleanup when switching components
   * @param {Object} instance - Component instance with destroy() method
   */
  registerInstance(instance) {
    if (instance && typeof instance.destroy === 'function') {
      this.activeInstances.push(instance);
    }
  }

  async loadComponent(name) {
    const component = components.find(c => c.name === name);
    if (!component) {
      this.showError(`Component "${name}" not found`);
      return;
    }

    // Clean up previous component instances before loading new one
    this.destroyActiveInstances();

    this.currentComponent = name;
    this.componentTitle.textContent = component.label;
    this.updateActiveNav(name);

    try {
      // Load component CSS
      await this.loadComponentCSS(name);

      // Load component JS
      await this.loadComponentJS(name);

      // Load demo HTML, CSS source, and JS source in parallel
      const [demoHtml, cssSource, jsSource] = await Promise.all([
        this.fetchFile(`components/${name}/demo.html`),
        this.fetchFile(`components/${name}/${name}.css`).catch(() => '/* No CSS file */'),
        this.fetchFile(`components/${name}/${name}.js`).catch(() => '// No JS file')
      ]);

      this.currentDemoHtml = demoHtml;
      this.currentCss = cssSource;
      this.currentJs = jsSource;
      this.previewFrame.innerHTML = demoHtml;

      // Update code panel if open
      if (this.codePanel && !this.codePanel.classList.contains('is-hidden')) {
        this.updateCodePanel();
      }

      // Initialize component JS if it has an init function
      const initFnName = `init${this.capitalize(name.replace(/-/g, ''))}`;
      if (window[initFnName]) {
        const result = window[initFnName](this.previewFrame);
        // Register returned instances for cleanup
        if (result) {
          if (Array.isArray(result)) {
            result.forEach((inst) => this.registerInstance(inst));
          } else {
            this.registerInstance(result);
          }
        }
      }
    } catch (error) {
      this.showError(`Failed to load component: ${error.message}`);
    }
  }

  async loadComponentCSS(name) {
    // All component CSS is now loaded via components.css in index.html
    // This method is kept for backwards compatibility and potential
    // hot-reloading of individual component styles during development
    return Promise.resolve();
  }

  async loadComponentJS(name) {
    // Remove previous component script
    const existingScript = document.getElementById('component-js');
    if (existingScript) {
      existingScript.remove();
    }

    const script = document.createElement('script');
    script.id = 'component-js';
    script.src = `components/${name}/${name}.js`;
    document.body.appendChild(script);

    return new Promise((resolve, reject) => {
      script.onload = resolve;
      script.onerror = () => reject(new Error('JS failed to load'));
    });
  }

  async fetchFile(path) {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return response.text();
  }

  updateActiveNav(name) {
    this.componentList.querySelectorAll('a').forEach(link => {
      link.classList.toggle('active', link.dataset.component === name);
    });
  }

  toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('preview-theme', next);
  }

  toggleCodePanel() {
    if (!this.codePanel) return;

    const isHidden = this.codePanel.classList.toggle('is-hidden');

    if (!isHidden) {
      this.updateCodePanel();
    }
  }

  updateCodePanel() {
    if (!this.codeContent) return;

    // Update HTML tab
    const htmlTab = this.codeContent.querySelector('[data-content="html"]');
    if (htmlTab && this.currentDemoHtml) {
      const formattedHtml = this.formatHtml(this.currentDemoHtml);
      htmlTab.innerHTML = `<pre><code>${this.escapeHtml(formattedHtml)}</code></pre>`;
    }

    // Update CSS tab
    const cssTab = this.codeContent.querySelector('[data-content="css"]');
    if (cssTab && this.currentCss) {
      cssTab.innerHTML = `<pre><code>${this.escapeHtml(this.currentCss)}</code></pre>`;
    }

    // Update JS tab
    const jsTab = this.codeContent.querySelector('[data-content="js"]');
    if (jsTab && this.currentJs) {
      jsTab.innerHTML = `<pre><code>${this.escapeHtml(this.currentJs)}</code></pre>`;
    }
  }

  switchCodeTab(tabName) {
    this.currentTab = tabName;

    // Update tab buttons
    document.querySelectorAll('.code-panel-tab').forEach(tab => {
      tab.classList.toggle('is-active', tab.dataset.tab === tabName);
    });

    // Update tab content
    document.querySelectorAll('.code-tab-content').forEach(content => {
      content.classList.toggle('is-active', content.dataset.content === tabName);
    });
  }

  formatHtml(html) {
    // Simple HTML formatting
    let formatted = html.trim();
    let indent = 0;
    const indentStr = '  ';

    // Split by tags
    formatted = formatted.replace(/></g, '>\n<');

    const lines = formatted.split('\n');
    const result = [];

    for (let line of lines) {
      line = line.trim();
      if (!line) continue;

      // Decrease indent for closing tags
      if (line.startsWith('</')) {
        indent = Math.max(0, indent - 1);
      }

      result.push(indentStr.repeat(indent) + line);

      // Increase indent for opening tags (not self-closing)
      if (line.startsWith('<') && !line.startsWith('</') &&
          !line.startsWith('<!') && !line.endsWith('/>') &&
          !line.includes('</')) {
        indent++;
      }
    }

    return result.join('\n');
  }

  escapeHtml(html) {
    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  async copyCurrentCode() {
    let content = '';
    let label = '';

    switch (this.currentTab) {
      case 'html':
        content = this.currentDemoHtml;
        label = 'HTML';
        break;
      case 'css':
        content = this.currentCss;
        label = 'CSS';
        break;
      case 'js':
        content = this.currentJs;
        label = 'JS';
        break;
    }

    if (!content) {
      this.showToast(`No ${label} to copy`);
      return;
    }

    try {
      await navigator.clipboard.writeText(content);
      this.showToast(`${label} copied to clipboard!`);
    } catch (err) {
      // Fallback for browsers that don't support clipboard API
      const textarea = document.createElement('textarea');
      textarea.value = content;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast(`${label} copied to clipboard!`);
    }
  }

  // Legacy method name for backwards compatibility
  async copyHtml() {
    this.currentTab = 'html';
    await this.copyCurrentCode();
  }

  showToast(message) {
    // Remove existing toast
    const existing = document.querySelector('.preview-toast');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'preview-toast';
    toast.textContent = message;
    document.body.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => {
      toast.classList.add('is-visible');
    });

    // Remove after delay
    setTimeout(() => {
      toast.classList.remove('is-visible');
      setTimeout(() => toast.remove(), 300);
    }, 2000);
  }

  toggleMobileNav() {
    this.sidebar.classList.toggle('is-open');
    document.body.classList.toggle('nav-open');
  }

  closeMobileNav() {
    this.sidebar.classList.remove('is-open');
    document.body.classList.remove('nav-open');
  }

  showError(message) {
    this.previewFrame.innerHTML = `
      <div style="color: #e94560; text-align: center; padding: 48px;">
        <p>${message}</p>
      </div>
    `;
  }

  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  new ComponentPreview();
});
