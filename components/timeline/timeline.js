/**
 * Timeline Component JavaScript
 *
 * The timeline is primarily CSS-based.
 * This file provides optional animation on scroll.
 */

function initTimeline(container) {
  // Animate timeline items as they come into view
  const timelineItems = container.querySelectorAll('.timeline__item');

  if (!timelineItems.length) return;

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    // Show all items immediately
    timelineItems.forEach(item => {
      item.style.opacity = '1';
      item.style.transform = 'none';
    });
    return;
  }

  // Set initial state for animation
  timelineItems.forEach(item => {
    if (!item.dataset.animated) {
      item.style.opacity = '0';
      item.style.transform = 'translateY(20px)';
      item.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    }
  });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        const item = entry.target;

        // Stagger animation based on index
        setTimeout(() => {
          item.style.opacity = '1';
          item.style.transform = 'translateY(0)';
          item.dataset.animated = 'true';
        }, index * 100);

        observer.unobserve(item);
      }
    });
  }, {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  });

  timelineItems.forEach(item => observer.observe(item));
}
