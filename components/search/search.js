/**
 * Search Component
 *
 * Handles search input interactions, dropdown, and keyboard navigation.
 */

function initSearch(container) {
  const searchInputs = container.querySelectorAll('.search__input');

  searchInputs.forEach(input => {
    const search = input.closest('.search');
    const dropdown = search?.querySelector('.search__dropdown');
    const clearBtn = search?.querySelector('.search__clear');

    // Handle input focus to show dropdown
    if (dropdown) {
      input.addEventListener('focus', () => {
        search.classList.add('is-open');
      });

      // Close on click outside
      document.addEventListener('click', (e) => {
        if (!search.contains(e.target)) {
          search.classList.remove('is-open');
        }
      });
    }

    // Handle clear button
    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        input.value = '';
        input.focus();
      });
    }

    // Keyboard navigation for results
    if (dropdown) {
      let highlightedIndex = -1;
      const results = dropdown.querySelectorAll('.search__result');

      input.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          highlightedIndex = Math.min(highlightedIndex + 1, results.length - 1);
          updateHighlight();
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          highlightedIndex = Math.max(highlightedIndex - 1, 0);
          updateHighlight();
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
          e.preventDefault();
          results[highlightedIndex].click();
        } else if (e.key === 'Escape') {
          search.classList.remove('is-open');
          input.blur();
        }
      });

      function updateHighlight() {
        results.forEach((result, index) => {
          result.classList.toggle('is-highlighted', index === highlightedIndex);
        });
      }
    }
  });

  // Handle filter buttons
  const filters = container.querySelectorAll('.search__filter');
  filters.forEach(filter => {
    filter.addEventListener('click', () => {
      const siblings = filter.parentElement.querySelectorAll('.search__filter');
      siblings.forEach(f => f.classList.remove('is-active'));
      filter.classList.add('is-active');
    });
  });
}
