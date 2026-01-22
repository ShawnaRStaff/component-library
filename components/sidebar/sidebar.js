/**
 * Sidebar Component
 *
 * Handles sidebar interactions like expandable menus and mobile toggle.
 */

function initSidebar(container) {
  // Handle expandable menu items
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

  // Handle mobile sidebar toggle
  const toggleButtons = container.querySelectorAll('[data-sidebar-toggle]');
  toggleButtons.forEach(button => {
    button.addEventListener('click', () => {
      const targetId = button.dataset.sidebarToggle;
      const sidebar = document.getElementById(targetId) || container.querySelector('.sidebar--mobile');
      const overlay = document.querySelector('.sidebar-overlay');

      if (sidebar) {
        sidebar.classList.toggle('is-open');
        if (overlay) {
          overlay.classList.toggle('is-visible');
        }
      }
    });
  });

  // Handle overlay click to close sidebar
  const overlay = container.querySelector('.sidebar-overlay');
  if (overlay) {
    overlay.addEventListener('click', () => {
      const sidebar = container.querySelector('.sidebar--mobile.is-open');
      if (sidebar) {
        sidebar.classList.remove('is-open');
        overlay.classList.remove('is-visible');
      }
    });
  }
}
