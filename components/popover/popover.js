/**
 * Popover Component JavaScript
 *
 * Handles click-triggered popovers with positioning and keyboard support.
 */

function initPopover(container) {
  const triggers = container.querySelectorAll('[data-popover-trigger]');

  triggers.forEach(trigger => {
    const popoverId = trigger.dataset.popoverTrigger;
    const popover = container.querySelector(`[data-popover="${popoverId}"]`);

    if (!popover) return;

    const closeBtn = popover.querySelector('.popover__close');

    // Toggle popover on trigger click
    trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      togglePopover(popover);
    });

    // Close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        closePopover(popover);
      });
    }

    // Close on click outside
    document.addEventListener('click', (e) => {
      if (!trigger.contains(e.target) && !popover.contains(e.target)) {
        closePopover(popover);
      }
    });

    // Keyboard support
    trigger.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        togglePopover(popover);
      }
      if (e.key === 'Escape') {
        closePopover(popover);
        trigger.focus();
      }
    });

    popover.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closePopover(popover);
        trigger.focus();
      }
    });
  });

  function togglePopover(popover) {
    const isOpen = popover.classList.contains('is-open');

    // Close all other popovers first
    container.querySelectorAll('.popover.is-open').forEach(p => {
      if (p !== popover) {
        closePopover(p);
      }
    });

    if (isOpen) {
      closePopover(popover);
    } else {
      openPopover(popover);
    }
  }

  function openPopover(popover) {
    popover.classList.add('is-open');
    popover.setAttribute('aria-hidden', 'false');

    // Focus first focusable element
    const focusable = popover.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (focusable) {
      setTimeout(() => focusable.focus(), 100);
    }

    // Dispatch custom event
    popover.dispatchEvent(new CustomEvent('popover:open', { bubbles: true }));
  }

  function closePopover(popover) {
    popover.classList.remove('is-open');
    popover.setAttribute('aria-hidden', 'true');

    // Dispatch custom event
    popover.dispatchEvent(new CustomEvent('popover:close', { bubbles: true }));
  }

  // Expose functions globally for manual control
  window.openPopover = (id) => {
    const popover = container.querySelector(`[data-popover="${id}"]`);
    if (popover) openPopover(popover);
  };

  window.closePopover = (id) => {
    const popover = container.querySelector(`[data-popover="${id}"]`);
    if (popover) closePopover(popover);
  };
}
