/**
 * Tag/Chip Component
 *
 * Interactive tag functionality for removable and selectable tags.
 */

function initTag(container) {
  // Handle removable tags
  const removeButtons = container.querySelectorAll('.tag__remove');
  removeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const tag = button.closest('.tag');
      if (tag) {
        tag.style.opacity = '0';
        tag.style.transform = 'scale(0.8)';
        setTimeout(() => tag.remove(), 150);
      }
    });
  });

  // Handle selectable tags
  const clickableTags = container.querySelectorAll('.tag--clickable');
  clickableTags.forEach(tag => {
    if (tag.tagName === 'BUTTON') {
      tag.addEventListener('click', () => {
        tag.classList.toggle('is-selected');
      });
    }
  });

  // Handle expandable menu items in sidebar submenu toggle
  const expandableLinks = container.querySelectorAll('.sidebar__link--expandable');
  expandableLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const menuItem = link.closest('.sidebar__menu-item');
      if (menuItem) {
        menuItem.classList.toggle('is-expanded');
      }
    });
  });
}
