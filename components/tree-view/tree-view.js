/**
 * Tree View Component
 *
 * Handles tree expansion, selection, and keyboard navigation.
 */

function initTreeView(container) {
  const trees = container.querySelectorAll('.tree');

  trees.forEach(tree => {
    // Handle toggle clicks
    tree.addEventListener('click', (e) => {
      const toggle = e.target.closest('.tree__toggle');
      if (toggle && !toggle.classList.contains('tree__toggle--placeholder')) {
        e.preventDefault();
        const item = toggle.closest('.tree__item');
        if (item) {
          item.classList.toggle('is-expanded');
        }
      }

      // Handle node selection
      const node = e.target.closest('.tree__node');
      if (node && !e.target.closest('.tree__toggle') &&
          !e.target.closest('.tree__checkbox') &&
          !e.target.closest('.tree__action')) {
        // Remove selection from other nodes
        tree.querySelectorAll('.tree__node.is-selected').forEach(n => {
          n.classList.remove('is-selected');
        });
        node.classList.add('is-selected');
      }
    });

    // Handle checkbox changes
    tree.addEventListener('change', (e) => {
      const checkbox = e.target.closest('.tree__checkbox');
      if (checkbox) {
        const item = checkbox.closest('.tree__item');
        const isChecked = checkbox.checked;

        // Update child checkboxes
        const childCheckboxes = item.querySelectorAll('.tree__children .tree__checkbox');
        childCheckboxes.forEach(cb => {
          cb.checked = isChecked;
          cb.indeterminate = false;
        });

        // Update parent checkboxes
        updateParentCheckbox(checkbox);
      }
    });

    // Keyboard navigation
    tree.addEventListener('keydown', (e) => {
      const selected = tree.querySelector('.tree__node.is-selected');
      if (!selected) return;

      const item = selected.closest('.tree__item');
      const allNodes = Array.from(tree.querySelectorAll('.tree__node'));
      const currentIndex = allNodes.indexOf(selected);

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          if (currentIndex < allNodes.length - 1) {
            selectNode(tree, allNodes[currentIndex + 1]);
          }
          break;

        case 'ArrowUp':
          e.preventDefault();
          if (currentIndex > 0) {
            selectNode(tree, allNodes[currentIndex - 1]);
          }
          break;

        case 'ArrowRight':
          e.preventDefault();
          if (!item.classList.contains('is-expanded')) {
            item.classList.add('is-expanded');
          } else {
            const firstChild = item.querySelector('.tree__children .tree__node');
            if (firstChild) {
              selectNode(tree, firstChild);
            }
          }
          break;

        case 'ArrowLeft':
          e.preventDefault();
          if (item.classList.contains('is-expanded')) {
            item.classList.remove('is-expanded');
          } else {
            const parent = item.parentElement.closest('.tree__item');
            if (parent) {
              const parentNode = parent.querySelector(':scope > .tree__node');
              if (parentNode) {
                selectNode(tree, parentNode);
              }
            }
          }
          break;

        case 'Enter':
        case ' ':
          e.preventDefault();
          const toggle = selected.querySelector('.tree__toggle:not(.tree__toggle--placeholder)');
          if (toggle) {
            item.classList.toggle('is-expanded');
          }
          break;
      }
    });
  });

  function selectNode(tree, node) {
    tree.querySelectorAll('.tree__node.is-selected').forEach(n => {
      n.classList.remove('is-selected');
    });
    node.classList.add('is-selected');
    node.focus();

    // Scroll into view if needed
    node.scrollIntoView({ block: 'nearest' });
  }

  function updateParentCheckbox(checkbox) {
    const item = checkbox.closest('.tree__item');
    const parentChildren = item.parentElement;
    if (!parentChildren.classList.contains('tree__children')) return;

    const parentItem = parentChildren.closest('.tree__item');
    if (!parentItem) return;

    const parentCheckbox = parentItem.querySelector(':scope > .tree__node .tree__checkbox');
    if (!parentCheckbox) return;

    const siblings = parentChildren.querySelectorAll(':scope > .tree__item > .tree__node .tree__checkbox');
    const checkedCount = Array.from(siblings).filter(cb => cb.checked).length;
    const indeterminateCount = Array.from(siblings).filter(cb => cb.indeterminate).length;

    if (checkedCount === 0 && indeterminateCount === 0) {
      parentCheckbox.checked = false;
      parentCheckbox.indeterminate = false;
    } else if (checkedCount === siblings.length) {
      parentCheckbox.checked = true;
      parentCheckbox.indeterminate = false;
    } else {
      parentCheckbox.checked = false;
      parentCheckbox.indeterminate = true;
    }

    // Recursively update ancestors
    updateParentCheckbox(parentCheckbox);
  }
}
