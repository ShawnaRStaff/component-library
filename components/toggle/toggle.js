/**
 * Toggle/Switch Component JavaScript
 *
 * Toggles work natively - no JS required.
 * This file exists for consistency and potential future enhancements.
 */

function initToggle(container) {
  // Optional: Add keyboard support for spacebar if needed
  // Native checkboxes already support this

  // Demo: Sync toggle with text display
  const togglesWithStatus = container.querySelectorAll('[data-toggle-status]');
  togglesWithStatus.forEach(toggle => {
    const statusId = toggle.dataset.toggleStatus;
    const statusEl = container.querySelector(`#${statusId}`);

    if (statusEl) {
      const updateStatus = () => {
        statusEl.textContent = toggle.checked ? 'On' : 'Off';
      };

      toggle.addEventListener('change', updateStatus);
      updateStatus();
    }
  });
}
