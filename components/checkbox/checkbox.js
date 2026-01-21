/**
 * Checkbox Component JavaScript
 *
 * Handles indeterminate state and group functionality.
 */

function initCheckbox(container) {
  // Demo: Set indeterminate state
  const indeterminateCheckboxes = container.querySelectorAll('[data-indeterminate]');
  indeterminateCheckboxes.forEach(checkbox => {
    checkbox.indeterminate = true;
  });

  // Demo: Select all functionality
  const selectAllCheckbox = container.querySelector('[data-select-all]');
  if (selectAllCheckbox) {
    const groupName = selectAllCheckbox.dataset.selectAll;
    const groupCheckboxes = container.querySelectorAll(`[data-group="${groupName}"]`);

    selectAllCheckbox.addEventListener('change', () => {
      groupCheckboxes.forEach(cb => {
        cb.checked = selectAllCheckbox.checked;
      });
    });

    groupCheckboxes.forEach(cb => {
      cb.addEventListener('change', () => {
        const allChecked = Array.from(groupCheckboxes).every(c => c.checked);
        const someChecked = Array.from(groupCheckboxes).some(c => c.checked);

        selectAllCheckbox.checked = allChecked;
        selectAllCheckbox.indeterminate = someChecked && !allChecked;
      });
    });
  }
}
