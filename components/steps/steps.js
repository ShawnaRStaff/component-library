/**
 * Steps Component JavaScript
 */

function initSteps(container) {
  const clickableSteps = container.querySelectorAll('.steps--clickable');

  clickableSteps.forEach(steps => {
    const items = steps.querySelectorAll('.steps__item');

    items.forEach((item, index) => {
      item.addEventListener('click', () => {
        // Only allow clicking on completed or current step
        if (item.classList.contains('is-complete') || item.classList.contains('is-active')) {
          // In a real app, this would trigger navigation
          console.log(`Clicked step ${index + 1}`);
        }
      });
    });
  });

  // Demo: Progress bar animation
  const progressBars = container.querySelectorAll('.steps-progress__fill');
  progressBars.forEach(bar => {
    const width = bar.style.width;
    bar.style.width = '0';
    setTimeout(() => {
      bar.style.width = width;
    }, 100);
  });
}
