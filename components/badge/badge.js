/**
 * Badge Component JavaScript
 *
 * Handles removable badge functionality.
 */

function initBadge(container) {
  // Removable badges
  const removeButtons = container.querySelectorAll('.badge__remove');
  removeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const badge = btn.closest('.badge');
      if (badge) {
        badge.style.opacity = '0';
        badge.style.transform = 'scale(0.8)';
        badge.style.transition = 'all 0.15s ease';
        setTimeout(() => {
          badge.remove();
        }, 150);
      }
    });
  });
}
