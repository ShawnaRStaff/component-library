/**
 * Table Component JavaScript
 */

function initTable(container) {
  // Sortable columns
  const sortableHeaders = container.querySelectorAll('.table__sortable');

  sortableHeaders.forEach(header => {
    header.addEventListener('click', () => {
      const table = header.closest('table');
      const columnIndex = Array.from(header.parentNode.children).indexOf(header);
      const tbody = table.querySelector('tbody');
      const rows = Array.from(tbody.querySelectorAll('tr'));

      // Determine sort direction
      const isAscending = !header.classList.contains('is-sorted') ||
                          header.classList.contains('is-sorted-desc');

      // Reset all headers
      table.querySelectorAll('.table__sortable').forEach(h => {
        h.classList.remove('is-sorted', 'is-sorted-desc');
      });

      // Set current header state
      header.classList.add('is-sorted');
      if (!isAscending) {
        header.classList.add('is-sorted-desc');
      }

      // Sort rows
      rows.sort((a, b) => {
        const aValue = a.cells[columnIndex].textContent.trim();
        const bValue = b.cells[columnIndex].textContent.trim();

        // Check if values look like dates (YYYY-MM-DD or similar patterns with dashes/slashes)
        const datePattern = /^\d{4}[-/]\d{2}[-/]\d{2}$/;
        const isDate = datePattern.test(aValue) && datePattern.test(bValue);

        if (isDate) {
          // Parse as dates for proper comparison
          const aDate = new Date(aValue);
          const bDate = new Date(bValue);
          return isAscending ? aDate - bDate : bDate - aDate;
        }

        // Try numeric sort - strip everything except digits, decimal, and leading minus
        const aClean = aValue.replace(/[^0-9.-]/g, '').replace(/(?!^)-/g, '');
        const bClean = bValue.replace(/[^0-9.-]/g, '').replace(/(?!^)-/g, '');
        const aNum = parseFloat(aClean);
        const bNum = parseFloat(bClean);

        if (!isNaN(aNum) && !isNaN(bNum) && aClean !== '' && bClean !== '') {
          return isAscending ? aNum - bNum : bNum - aNum;
        }

        // Fall back to string sort
        return isAscending
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      });

      // Re-append sorted rows
      rows.forEach(row => tbody.appendChild(row));
    });
  });

  // Row selection
  const selectAllCheckboxes = container.querySelectorAll('.table__select-all');

  selectAllCheckboxes.forEach(selectAll => {
    const table = selectAll.closest('table');
    const rowCheckboxes = table.querySelectorAll('tbody .table__select-row');

    selectAll.addEventListener('change', () => {
      rowCheckboxes.forEach(checkbox => {
        checkbox.checked = selectAll.checked;
        const row = checkbox.closest('tr');
        row.classList.toggle('table__row--selected', selectAll.checked);
      });
    });

    rowCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        const row = checkbox.closest('tr');
        row.classList.toggle('table__row--selected', checkbox.checked);

        // Update select all state
        const allChecked = Array.from(rowCheckboxes).every(cb => cb.checked);
        const someChecked = Array.from(rowCheckboxes).some(cb => cb.checked);

        selectAll.checked = allChecked;
        selectAll.indeterminate = someChecked && !allChecked;
      });
    });
  });
}
