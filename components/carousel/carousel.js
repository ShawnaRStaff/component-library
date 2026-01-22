/**
 * Carousel Component JavaScript
 *
 * Full-featured carousel with navigation, indicators, autoplay, and touch support.
 */

function initCarousel(container) {
  const carousels = container.querySelectorAll('[data-carousel]');

  carousels.forEach(carousel => {
    const track = carousel.querySelector('.carousel__track');
    const slides = carousel.querySelectorAll('.carousel__slide');
    const prevBtn = carousel.querySelector('.carousel__nav--prev');
    const nextBtn = carousel.querySelector('.carousel__nav--next');
    const indicators = carousel.querySelectorAll('.carousel__indicator');
    const thumbnails = carousel.querySelectorAll('.carousel__thumbnail');
    const counter = carousel.querySelector('.carousel__counter');
    const progressBar = carousel.querySelector('.carousel__progress-bar');

    if (!slides.length) return;

    // Configuration
    const config = {
      autoplay: carousel.dataset.autoplay !== undefined,
      interval: parseInt(carousel.dataset.interval, 10) || 5000,
      loop: carousel.dataset.loop !== undefined,
      draggable: carousel.dataset.draggable !== undefined,
      fade: carousel.classList.contains('carousel--fade'),
      perView: getPerView(carousel)
    };

    // State
    let currentIndex = 0;
    let autoplayTimer = null;
    let isDragging = false;
    let startX = 0;
    let scrollLeft = 0;

    // Initialize
    updateCarousel();
    if (config.autoplay) startAutoplay();
    if (config.draggable) initDraggable();

    // Navigation buttons
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToPrev();
        resetAutoplay();
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToNext();
        resetAutoplay();
      });
    }

    // Indicators
    indicators.forEach((indicator, index) => {
      indicator.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
    });

    // Thumbnails
    thumbnails.forEach((thumb, index) => {
      thumb.addEventListener('click', () => {
        goToSlide(index);
        resetAutoplay();
      });
    });

    // Keyboard navigation
    carousel.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') {
        goToPrev();
        resetAutoplay();
      } else if (e.key === 'ArrowRight') {
        goToNext();
        resetAutoplay();
      }
    });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    carousel.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleSwipe();
    }, { passive: true });

    function handleSwipe() {
      const diff = touchStartX - touchEndX;
      const threshold = 50;

      if (Math.abs(diff) > threshold) {
        if (diff > 0) {
          goToNext();
        } else {
          goToPrev();
        }
        resetAutoplay();
      }
    }

    // Pause autoplay on hover
    if (config.autoplay) {
      carousel.addEventListener('mouseenter', stopAutoplay);
      carousel.addEventListener('mouseleave', startAutoplay);
    }

    // Functions
    function goToSlide(index) {
      const maxIndex = slides.length - config.perView;

      if (config.loop) {
        if (index < 0) {
          currentIndex = slides.length - 1;
        } else if (index >= slides.length) {
          currentIndex = 0;
        } else {
          currentIndex = index;
        }
      } else {
        currentIndex = Math.max(0, Math.min(index, maxIndex));
      }

      updateCarousel();
    }

    function goToNext() {
      goToSlide(currentIndex + 1);
    }

    function goToPrev() {
      goToSlide(currentIndex - 1);
    }

    function updateCarousel() {
      // Update track position
      if (!config.fade) {
        const slideWidth = 100 / config.perView;
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
      }

      // Update slides for fade mode
      if (config.fade) {
        slides.forEach((slide, index) => {
          slide.classList.toggle('is-active', index === currentIndex);
        });
      }

      // Update center mode slides
      if (carousel.classList.contains('carousel--center')) {
        slides.forEach((slide, index) => {
          slide.classList.toggle('is-active', index === currentIndex);
        });
      }

      // Update indicators
      indicators.forEach((indicator, index) => {
        indicator.classList.toggle('is-active', index === currentIndex);
      });

      // Update thumbnails
      thumbnails.forEach((thumb, index) => {
        thumb.classList.toggle('is-active', index === currentIndex);
      });

      // Update counter
      if (counter) {
        counter.textContent = `${currentIndex + 1} / ${slides.length}`;
      }

      // Update navigation buttons
      if (!config.loop) {
        if (prevBtn) {
          prevBtn.disabled = currentIndex === 0;
        }
        if (nextBtn) {
          nextBtn.disabled = currentIndex >= slides.length - config.perView;
        }
      }

      // Dispatch custom event
      carousel.dispatchEvent(new CustomEvent('carousel:change', {
        detail: { index: currentIndex, slide: slides[currentIndex] }
      }));
    }

    function startAutoplay() {
      if (!config.autoplay) return;
      stopAutoplay();
      autoplayTimer = setInterval(goToNext, config.interval);

      // Reset progress animation
      if (progressBar) {
        progressBar.style.animation = 'none';
        progressBar.offsetHeight; // Trigger reflow
        progressBar.style.animation = `carousel-progress ${config.interval}ms linear infinite`;
      }
    }

    function stopAutoplay() {
      if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    function resetAutoplay() {
      if (config.autoplay) {
        stopAutoplay();
        startAutoplay();
      }
    }

    function getPerView(el) {
      if (el.classList.contains('carousel--4-slides')) return 4;
      if (el.classList.contains('carousel--3-slides')) return 3;
      if (el.classList.contains('carousel--2-slides')) return 2;
      return 1;
    }

    function initDraggable() {
      carousel.classList.add('carousel--draggable');

      carousel.addEventListener('mousedown', (e) => {
        isDragging = true;
        carousel.classList.add('is-dragging');
        startX = e.pageX - track.offsetLeft;
        scrollLeft = currentIndex * carousel.offsetWidth / config.perView;
      });

      carousel.addEventListener('mouseleave', () => {
        if (isDragging) endDrag();
      });

      carousel.addEventListener('mouseup', endDrag);

      carousel.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        e.preventDefault();
        const x = e.pageX - track.offsetLeft;
        const walk = (startX - x) * 1.5;
        const newPosition = scrollLeft + walk;
        track.style.transform = `translateX(-${newPosition}px)`;
      });

      function endDrag() {
        if (!isDragging) return;
        isDragging = false;
        carousel.classList.remove('is-dragging');

        // Snap to nearest slide
        const slideWidth = carousel.offsetWidth / config.perView;
        const transform = track.style.transform;
        const match = transform.match(/translateX\(-?(\d+(?:\.\d+)?)/);

        if (match) {
          const currentPosition = parseFloat(match[1]);
          const nearestIndex = Math.round(currentPosition / slideWidth);
          goToSlide(nearestIndex);
        }

        resetAutoplay();
      }
    }

    // Expose API
    carousel.carousel = {
      goToSlide,
      goToNext,
      goToPrev,
      startAutoplay,
      stopAutoplay,
      getCurrentIndex: () => currentIndex
    };
  });
}
