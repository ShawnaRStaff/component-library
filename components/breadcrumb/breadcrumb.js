/**
 * Breadcrumb Component JavaScript
 *
 * Handles collapsed breadcrumb expansion.
 */

function initBreadcrumb(container) {
  const collapseTriggers = container.querySelectorAll('.breadcrumb__collapse-trigger');

  collapseTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const breadcrumb = trigger.closest('.breadcrumb');
      const collapsedItems = breadcrumb.querySelectorAll('.breadcrumb__item--collapsed');

      collapsedItems.forEach(item => {
        item.classList.remove('breadcrumb__item--collapsed');
      });

      // Remove the trigger
      trigger.closest('.breadcrumb__item').remove();
    });
  });
}
