/**
 * Card Component JavaScript
 *
 * Handles selectable card behavior.
 */

function initCard(container) {
  // Selectable cards
  const selectableCards = container.querySelectorAll('.card--selectable');

  selectableCards.forEach(card => {
    card.addEventListener('click', () => {
      // If part of a group, handle single selection
      const group = card.closest('.card-group--single-select');
      if (group) {
        group.querySelectorAll('.card--selectable').forEach(c => {
          c.classList.remove('is-selected');
        });
      }

      card.classList.toggle('is-selected');

      // Dispatch event
      card.dispatchEvent(new CustomEvent('card:select', {
        bubbles: true,
        detail: { selected: card.classList.contains('is-selected') }
      }));
    });

    // Keyboard support
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  // Clickable cards - make whole card clickable if it has a link
  const clickableCards = container.querySelectorAll('.card--clickable');

  clickableCards.forEach(card => {
    const link = card.querySelector('a');
    if (link) {
      card.addEventListener('click', (e) => {
        // Don't trigger if clicking on an interactive element
        if (e.target.closest('a, button, input, select, textarea')) {
          return;
        }
        link.click();
      });
    }
  });
}
