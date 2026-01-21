/**
 * Slider Component JavaScript
 */

function initSlider(container) {
  // Single slider value display
  const sliders = container.querySelectorAll('.slider__input');

  sliders.forEach(slider => {
    const valueDisplay = slider.closest('.slider')?.querySelector('.slider__value');

    if (valueDisplay) {
      const updateValue = () => {
        const suffix = slider.dataset.suffix || '';
        const prefix = slider.dataset.prefix || '';
        valueDisplay.textContent = `${prefix}${slider.value}${suffix}`;
      };

      slider.addEventListener('input', updateValue);
      updateValue();
    }

    // Update CSS custom property for filled track (WebKit workaround)
    const updateFill = () => {
      const min = parseFloat(slider.min) || 0;
      const max = parseFloat(slider.max) || 100;
      const value = parseFloat(slider.value);
      const percentage = ((value - min) / (max - min)) * 100;
      slider.style.setProperty('--slider-fill', `${percentage}%`);
    };

    slider.addEventListener('input', updateFill);
    updateFill();
  });

  // Range slider (two handles)
  const rangeSliders = container.querySelectorAll('.slider--range');

  rangeSliders.forEach(rangeSlider => {
    const inputs = rangeSlider.querySelectorAll('.slider__input');
    const trackFill = rangeSlider.querySelector('.slider__track-fill');
    const minDisplay = rangeSlider.querySelector('[data-range-min]');
    const maxDisplay = rangeSlider.querySelector('[data-range-max]');

    if (inputs.length === 2 && trackFill) {
      const [minInput, maxInput] = inputs;

      const updateRange = () => {
        const min = parseFloat(minInput.min) || 0;
        const max = parseFloat(minInput.max) || 100;
        const minVal = parseFloat(minInput.value);
        const maxVal = parseFloat(maxInput.value);

        // Prevent overlap
        if (minVal > maxVal) {
          if (document.activeElement === minInput) {
            minInput.value = maxVal;
          } else {
            maxInput.value = minVal;
          }
        }

        const minPercent = ((parseFloat(minInput.value) - min) / (max - min)) * 100;
        const maxPercent = ((parseFloat(maxInput.value) - min) / (max - min)) * 100;

        trackFill.style.left = `${minPercent}%`;
        trackFill.style.width = `${maxPercent - minPercent}%`;

        // Update displays
        if (minDisplay) {
          const prefix = minInput.dataset.prefix || '';
          const suffix = minInput.dataset.suffix || '';
          minDisplay.textContent = `${prefix}${minInput.value}${suffix}`;
        }
        if (maxDisplay) {
          const prefix = maxInput.dataset.prefix || '';
          const suffix = maxInput.dataset.suffix || '';
          maxDisplay.textContent = `${prefix}${maxInput.value}${suffix}`;
        }
      };

      minInput.addEventListener('input', updateRange);
      maxInput.addEventListener('input', updateRange);
      updateRange();
    }
  });
}
