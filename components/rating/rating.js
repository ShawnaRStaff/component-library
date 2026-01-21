/**
 * Rating Component
 *
 * Handles interactive rating functionality.
 */

function initRating(container) {
  // Interactive ratings are handled via CSS with radio inputs
  // This JS adds optional enhancements like keyboard navigation

  const ratings = container.querySelectorAll('.rating--interactive');

  ratings.forEach(rating => {
    const inputs = rating.querySelectorAll('input[type="radio"]');
    const labels = rating.querySelectorAll('label');

    // Add keyboard navigation
    labels.forEach((label, index) => {
      label.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
          e.preventDefault();
          const nextIndex = Math.min(index + 1, labels.length - 1);
          inputs[nextIndex].checked = true;
          inputs[nextIndex].focus();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
          e.preventDefault();
          const prevIndex = Math.max(index - 1, 0);
          inputs[prevIndex].checked = true;
          inputs[prevIndex].focus();
        }
      });
    });
  });

  // Emoji ratings
  const emojiRatings = container.querySelectorAll('.rating--emoji');
  emojiRatings.forEach(rating => {
    const labels = rating.querySelectorAll('label');
    labels.forEach(label => {
      label.addEventListener('mouseenter', () => {
        label.style.transform = 'scale(1.2)';
      });
      label.addEventListener('mouseleave', () => {
        const input = document.getElementById(label.getAttribute('for'));
        if (!input.checked) {
          label.style.transform = '';
        }
      });
    });
  });
}
