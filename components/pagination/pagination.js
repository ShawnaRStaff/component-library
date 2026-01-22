/**
 * Pagination Component JavaScript
 */

function initPagination(container) {
  const paginations = container.querySelectorAll('.pagination');

  paginations.forEach(pagination => {
    const pages = pagination.querySelectorAll('.pagination__page');
    const prevBtn = pagination.querySelector('.pagination__btn--prev');
    const nextBtn = pagination.querySelector('.pagination__btn--next');
    const info = pagination.querySelector('.pagination__info');

    let currentPage = 1;
    let totalPages = pages.length || 1;

    // Find initially active page
    pages.forEach((page, index) => {
      if (page.classList.contains('is-active')) {
        currentPage = index + 1;
      }
    });

    const updateState = () => {
      // Update page buttons
      pages.forEach((page, index) => {
        page.classList.toggle('is-active', index + 1 === currentPage);
      });

      // Update prev/next buttons
      if (prevBtn) {
        prevBtn.disabled = currentPage === 1;
      }
      if (nextBtn) {
        nextBtn.disabled = currentPage === totalPages;
      }

      // Update info text
      if (info) {
        info.textContent = `Page ${currentPage} of ${totalPages}`;
      }

      // Dispatch event
      pagination.dispatchEvent(new CustomEvent('pagination:change', {
        detail: { page: currentPage, totalPages }
      }));
    };

    // Page click
    pages.forEach((page, index) => {
      page.addEventListener('click', () => {
        currentPage = index + 1;
        updateState();
      });
    });

    // Previous button
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          currentPage--;
          updateState();
        }
      });
    }

    // Next button
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          currentPage++;
          updateState();
        }
      });
    }

    // Initial state
    updateState();
  });
}
