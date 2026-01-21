/**
 * List Component JavaScript
 */

function initList(container) {
  // Selectable lists
  const selectableLists = container.querySelectorAll('.list--selectable');

  selectableLists.forEach(list => {
    const items = list.querySelectorAll('.list__item');

    items.forEach(item => {
      item.addEventListener('click', () => {
        // Single select - remove selection from siblings
        if (!list.classList.contains('list--multi-select')) {
          items.forEach(i => i.classList.remove('list__item--selected'));
        }

        item.classList.toggle('list__item--selected');
      });
    });
  });

  // Sortable lists (demo only - would use a library in production)
  const sortableLists = container.querySelectorAll('.list--sortable');

  sortableLists.forEach(list => {
    const items = list.querySelectorAll('.list__item');

    items.forEach(item => {
      item.setAttribute('draggable', 'true');

      item.addEventListener('dragstart', (e) => {
        e.dataTransfer.effectAllowed = 'move';
        item.classList.add('is-dragging');
      });

      item.addEventListener('dragend', () => {
        item.classList.remove('is-dragging');
      });

      item.addEventListener('dragover', (e) => {
        e.preventDefault();
        const dragging = list.querySelector('.is-dragging');
        if (dragging && dragging !== item) {
          const rect = item.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          if (e.clientY < midY) {
            list.insertBefore(dragging, item);
          } else {
            list.insertBefore(dragging, item.nextSibling);
          }
        }
      });
    });
  });
}
