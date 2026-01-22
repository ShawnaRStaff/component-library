/**
 * Stat Component JavaScript
 *
 * The stat component is primarily CSS-based.
 * This file can be used for number animations.
 */

function initStat(container) {
  // Animate numbers on scroll into view
  const animatedStats = container.querySelectorAll('[data-stat-animate]');

  if (!animatedStats.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const element = entry.target;
        const endValue = parseFloat(element.dataset.statAnimate);
        const duration = parseInt(element.dataset.statDuration, 10) || 1000;
        const prefix = element.dataset.statPrefix || '';
        const suffix = element.dataset.statSuffix || '';

        animateValue(element, 0, endValue, duration, prefix, suffix);
        observer.unobserve(element);
      }
    });
  }, { threshold: 0.5 });

  animatedStats.forEach(stat => observer.observe(stat));

  function animateValue(element, start, end, duration, prefix, suffix) {
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easeProgress;

      if (isDecimal) {
        element.textContent = prefix + current.toFixed(2) + suffix;
      } else {
        element.textContent = prefix + Math.floor(current).toLocaleString() + suffix;
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      }
    }

    requestAnimationFrame(update);
  }
}
