/**
 * Playground - Live Theme Customization
 *
 * Allows real-time editing of CSS custom properties (design tokens)
 * and exporting custom themes.
 */

class Playground {
  constructor() {
    // Default values (matching tokens.css)
    this.defaults = {
      colorPrimary: '#14b8a6',
      colorSecondary: '#06b6d4',
      colorAccent: '#f97316',
      colorDanger: '#f43f5e',
      spacingBase: 4,
      radiusSm: 4,
      radiusMd: 6,
      radiusLg: 8,
      fontFamily: 'system'
    };

    // Current values
    this.values = { ...this.defaults };

    // Font family options
    this.fontFamilies = {
      'system': '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, sans-serif',
      'inter': '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
      'roboto': '"Roboto", -apple-system, BlinkMacSystemFont, sans-serif',
      'open-sans': '"Open Sans", -apple-system, BlinkMacSystemFont, sans-serif',
      'poppins': '"Poppins", -apple-system, BlinkMacSystemFont, sans-serif'
    };

    this.init();
  }

  init() {
    this.bindColorPickers();
    this.bindSliders();
    this.bindFontSelector();
    this.bindActions();
  }

  // Bind color picker inputs
  bindColorPickers() {
    const colorInputs = [
      { picker: 'color-primary', hex: 'color-primary-hex', prop: 'colorPrimary', cssVar: '--color-primary-500' },
      { picker: 'color-secondary', hex: 'color-secondary-hex', prop: 'colorSecondary', cssVar: '--color-secondary-500' },
      { picker: 'color-accent', hex: 'color-accent-hex', prop: 'colorAccent', cssVar: '--color-accent-500' },
      { picker: 'color-danger', hex: 'color-danger-hex', prop: 'colorDanger', cssVar: '--color-danger-500' }
    ];

    colorInputs.forEach(({ picker, hex, prop, cssVar }) => {
      const pickerEl = document.getElementById(picker);
      const hexEl = document.getElementById(hex);

      if (!pickerEl || !hexEl) return;

      // Color picker change
      pickerEl.addEventListener('input', (e) => {
        const value = e.target.value;
        hexEl.value = value;
        this.values[prop] = value;
        this.updateColorScale(cssVar, value);
      });

      // Hex input change
      hexEl.addEventListener('input', (e) => {
        let value = e.target.value;
        if (!value.startsWith('#')) value = '#' + value;
        if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
          pickerEl.value = value;
          this.values[prop] = value;
          this.updateColorScale(cssVar, value);
        }
      });

      hexEl.addEventListener('blur', (e) => {
        let value = e.target.value;
        if (!value.startsWith('#')) value = '#' + value;
        if (!/^#[0-9A-Fa-f]{6}$/.test(value)) {
          e.target.value = this.values[prop];
        }
      });
    });
  }

  // Update color scale (generates lighter/darker variants)
  updateColorScale(baseVar, color) {
    const root = document.documentElement;
    const hsl = this.hexToHSL(color);

    // Generate scale (50-900)
    const baseName = baseVar.replace('-500', '');
    const scales = [
      { suffix: '50', l: 97 },
      { suffix: '100', l: 94 },
      { suffix: '200', l: 86 },
      { suffix: '300', l: 74 },
      { suffix: '400', l: 62 },
      { suffix: '500', l: hsl.l },
      { suffix: '600', l: hsl.l - 10 },
      { suffix: '700', l: hsl.l - 20 },
      { suffix: '800', l: hsl.l - 30 },
      { suffix: '900', l: hsl.l - 40 }
    ];

    scales.forEach(({ suffix, l }) => {
      const adjustedL = Math.max(5, Math.min(97, l));
      root.style.setProperty(`${baseName}-${suffix}`, `hsl(${hsl.h}, ${hsl.s}%, ${adjustedL}%)`);
    });

    // Update interactive primary if this is the primary color
    if (baseVar.includes('primary')) {
      root.style.setProperty('--interactive-primary', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      root.style.setProperty('--interactive-primary-hover', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l - 10}%)`);
      root.style.setProperty('--interactive-primary-active', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l - 20}%)`);
      root.style.setProperty('--focus-color', `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`);
      root.style.setProperty('--focus-ring-color', `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, 0.35)`);
    }
  }

  // Bind slider inputs
  bindSliders() {
    // Spacing base
    const spacingSlider = document.getElementById('spacing-base');
    const spacingValue = document.getElementById('spacing-value');

    if (spacingSlider && spacingValue) {
      spacingSlider.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        spacingValue.textContent = `${value}px`;
        this.values.spacingBase = value;
        this.updateSpacing(value);
      });
    }

    // Border radius
    const radiusInputs = [
      { slider: 'radius-sm', display: 'radius-sm-value', prop: 'radiusSm', cssVar: '--radius-sm' },
      { slider: 'radius-md', display: 'radius-md-value', prop: 'radiusMd', cssVar: '--radius-md' },
      { slider: 'radius-lg', display: 'radius-lg-value', prop: 'radiusLg', cssVar: '--radius-lg' }
    ];

    radiusInputs.forEach(({ slider, display, prop, cssVar }) => {
      const sliderEl = document.getElementById(slider);
      const displayEl = document.getElementById(display);

      if (!sliderEl || !displayEl) return;

      sliderEl.addEventListener('input', (e) => {
        const value = parseInt(e.target.value);
        displayEl.textContent = `${value}px`;
        this.values[prop] = value;
        document.documentElement.style.setProperty(cssVar, `${value}px`);
      });
    });
  }

  // Update spacing scale
  updateSpacing(base) {
    const root = document.documentElement;
    const scales = [
      { name: '--space-1', mult: 1 },
      { name: '--space-2', mult: 2 },
      { name: '--space-3', mult: 3 },
      { name: '--space-4', mult: 4 },
      { name: '--space-5', mult: 5 },
      { name: '--space-6', mult: 6 },
      { name: '--space-8', mult: 8 },
      { name: '--space-10', mult: 10 },
      { name: '--space-12', mult: 12 },
      { name: '--space-16', mult: 16 },
      { name: '--space-20', mult: 20 }
    ];

    scales.forEach(({ name, mult }) => {
      root.style.setProperty(name, `${(base * mult) / 4}rem`);
    });
  }

  // Bind font selector
  bindFontSelector() {
    const fontSelect = document.getElementById('font-family');

    if (!fontSelect) return;

    fontSelect.addEventListener('change', (e) => {
      const value = e.target.value;
      this.values.fontFamily = value;
      document.documentElement.style.setProperty('--font-family-sans', this.fontFamilies[value]);

      // Load Google Font if needed
      if (value !== 'system') {
        this.loadGoogleFont(value);
      }
    });
  }

  // Load Google Font
  loadGoogleFont(font) {
    const fontNames = {
      'inter': 'Inter:wght@400;500;600;700',
      'roboto': 'Roboto:wght@400;500;700',
      'open-sans': 'Open+Sans:wght@400;600;700',
      'poppins': 'Poppins:wght@400;500;600;700'
    };

    const fontName = fontNames[font];
    if (!fontName) return;

    // Check if already loaded
    const existingLink = document.querySelector(`link[href*="${font}"]`);
    if (existingLink) return;

    const link = document.createElement('link');
    link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }

  // Bind action buttons
  bindActions() {
    // Reset button
    const resetBtn = document.getElementById('reset-theme');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.reset());
    }

    // Export button
    const exportBtn = document.getElementById('export-theme');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportTheme());
    }

    // Copy CSS button
    const copyBtn = document.getElementById('copy-theme');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyCss());
    }
  }

  // Reset to defaults
  reset() {
    this.values = { ...this.defaults };

    // Reset inputs
    const inputs = {
      'color-primary': this.defaults.colorPrimary,
      'color-primary-hex': this.defaults.colorPrimary,
      'color-secondary': this.defaults.colorSecondary,
      'color-secondary-hex': this.defaults.colorSecondary,
      'color-accent': this.defaults.colorAccent,
      'color-accent-hex': this.defaults.colorAccent,
      'color-danger': this.defaults.colorDanger,
      'color-danger-hex': this.defaults.colorDanger,
      'spacing-base': this.defaults.spacingBase,
      'radius-sm': this.defaults.radiusSm,
      'radius-md': this.defaults.radiusMd,
      'radius-lg': this.defaults.radiusLg,
      'font-family': this.defaults.fontFamily
    };

    Object.entries(inputs).forEach(([id, value]) => {
      const el = document.getElementById(id);
      if (el) el.value = value;
    });

    // Reset displays
    document.getElementById('spacing-value').textContent = `${this.defaults.spacingBase}px`;
    document.getElementById('radius-sm-value').textContent = `${this.defaults.radiusSm}px`;
    document.getElementById('radius-md-value').textContent = `${this.defaults.radiusMd}px`;
    document.getElementById('radius-lg-value').textContent = `${this.defaults.radiusLg}px`;

    // Clear custom properties
    const root = document.documentElement;
    const props = root.style;
    for (let i = props.length - 1; i >= 0; i--) {
      root.style.removeProperty(props[i]);
    }

    this.showToast('Theme reset to defaults');
  }

  // Generate CSS for export
  generateCss() {
    const lines = [
      '/* Custom Theme - Generated by Component Library Playground */',
      '',
      ':root {'
    ];

    // Colors
    const colors = [
      { name: 'primary', value: this.values.colorPrimary },
      { name: 'secondary', value: this.values.colorSecondary },
      { name: 'accent', value: this.values.colorAccent },
      { name: 'danger', value: this.values.colorDanger }
    ];

    colors.forEach(({ name, value }) => {
      const hsl = this.hexToHSL(value);
      const scales = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
      const lightnesses = [97, 94, 86, 74, 62, hsl.l, hsl.l - 10, hsl.l - 20, hsl.l - 30, hsl.l - 40];

      scales.forEach((scale, i) => {
        const l = Math.max(5, Math.min(97, lightnesses[i]));
        lines.push(`  --color-${name}-${scale}: hsl(${hsl.h}, ${hsl.s}%, ${l}%);`);
      });
      lines.push('');
    });

    // Spacing
    const base = this.values.spacingBase;
    const spacingScales = [1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20];
    spacingScales.forEach(mult => {
      lines.push(`  --space-${mult}: ${(base * mult) / 4}rem;`);
    });
    lines.push('');

    // Border radius
    lines.push(`  --radius-sm: ${this.values.radiusSm}px;`);
    lines.push(`  --radius-md: ${this.values.radiusMd}px;`);
    lines.push(`  --radius-lg: ${this.values.radiusLg}px;`);
    lines.push('');

    // Font family
    if (this.values.fontFamily !== 'system') {
      lines.push(`  --font-family-sans: ${this.fontFamilies[this.values.fontFamily]};`);
    }

    lines.push('}');

    return lines.join('\n');
  }

  // Export theme as file download
  exportTheme() {
    const css = this.generateCss();
    const blob = new Blob([css], { type: 'text/css' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'custom-theme.css';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.showToast('Theme exported!');
  }

  // Copy CSS to clipboard
  async copyCss() {
    const css = this.generateCss();

    try {
      await navigator.clipboard.writeText(css);
      this.showToast('CSS copied to clipboard!');
    } catch (err) {
      // Fallback
      const textarea = document.createElement('textarea');
      textarea.value = css;
      textarea.style.position = 'fixed';
      textarea.style.opacity = '0';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      this.showToast('CSS copied to clipboard!');
    }
  }

  // Show toast notification
  showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('is-visible');

    setTimeout(() => {
      toast.classList.remove('is-visible');
    }, 2000);
  }

  // Utility: Hex to HSL
  hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }

    return {
      h: Math.round(h * 360),
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    };
  }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.playground = new Playground();
});
