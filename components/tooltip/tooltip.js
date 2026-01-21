/**
 * Tooltip Component JavaScript
 *
 * Most tooltips work with CSS-only.
 * This JS adds dynamic positioning for edge cases.
 */

function initTooltip(container) {
  // For programmatic tooltips, use data-tooltip-dynamic
  const dynamicTooltips = container.querySelectorAll('[data-tooltip-dynamic]');

  dynamicTooltips.forEach(trigger => {
    const tooltipText = trigger.dataset.tooltipDynamic;
    let tooltipEl = null;

    const showTooltip = () => {
      if (tooltipEl) return;

      tooltipEl = document.createElement('div');
      tooltipEl.className = 'tooltip__content';
      tooltipEl.textContent = tooltipText;
      tooltipEl.style.position = 'fixed';
      tooltipEl.style.visibility = 'visible';
      tooltipEl.style.opacity = '1';
      document.body.appendChild(tooltipEl);

      positionTooltip();
    };

    const hideTooltip = () => {
      if (tooltipEl) {
        tooltipEl.remove();
        tooltipEl = null;
      }
    };

    const positionTooltip = () => {
      if (!tooltipEl) return;

      const triggerRect = trigger.getBoundingClientRect();
      const tooltipRect = tooltipEl.getBoundingClientRect();

      let top = triggerRect.top - tooltipRect.height - 8;
      let left = triggerRect.left + (triggerRect.width / 2) - (tooltipRect.width / 2);

      // Keep within viewport
      if (top < 8) {
        top = triggerRect.bottom + 8;
      }
      if (left < 8) {
        left = 8;
      }
      if (left + tooltipRect.width > window.innerWidth - 8) {
        left = window.innerWidth - tooltipRect.width - 8;
      }

      tooltipEl.style.top = `${top}px`;
      tooltipEl.style.left = `${left}px`;
    };

    trigger.addEventListener('mouseenter', showTooltip);
    trigger.addEventListener('mouseleave', hideTooltip);
    trigger.addEventListener('focus', showTooltip);
    trigger.addEventListener('blur', hideTooltip);
  });

  // Keyboard dismissal for wrapper-based tooltips
  container.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const focused = document.activeElement;
      if (focused) {
        focused.blur();
      }
    }
  });
}
