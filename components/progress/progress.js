/**
 * Progress Component JavaScript
 */

function initProgress(container) {
  // Circular progress
  const circles = container.querySelectorAll('.progress-circle');

  circles.forEach(circle => {
    const fill = circle.querySelector('.progress-circle__fill');
    const valueEl = circle.querySelector('.progress-circle__value');

    if (!fill) return;

    const value = parseInt(circle.dataset.value || '0', 10);
    const radius = fill.getAttribute('r');
    const circumference = 2 * Math.PI * radius;

    fill.style.strokeDasharray = circumference;
    fill.style.strokeDashoffset = circumference - (value / 100) * circumference;

    if (valueEl && !valueEl.textContent) {
      valueEl.textContent = `${value}%`;
    }
  });

  // Animated progress bars (for demo)
  const animatedBars = container.querySelectorAll('[data-progress-animate]');

  animatedBars.forEach(bar => {
    const targetWidth = bar.dataset.progressAnimate;
    bar.style.width = '0%';

    // Trigger animation after a short delay
    setTimeout(() => {
      bar.style.width = targetWidth;
    }, 100);
  });

  // Steps progress
  const stepGroups = container.querySelectorAll('.progress-steps[data-interactive]');

  stepGroups.forEach(group => {
    const steps = group.querySelectorAll('.progress-step');

    steps.forEach((step, index) => {
      step.addEventListener('click', () => {
        steps.forEach((s, i) => {
          s.classList.remove('is-active');
          s.classList.toggle('is-complete', i < index);
        });
        step.classList.add('is-active');
      });
    });
  });
}
