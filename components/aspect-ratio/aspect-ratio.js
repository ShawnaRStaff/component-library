/**
 * Aspect Ratio Component JavaScript
 *
 * The aspect ratio component is primarily CSS-based.
 * This file provides optional lazy loading and loading states.
 */

function initAspectRatio(container) {
  // Handle lazy loading images
  const lazyImages = container.querySelectorAll('.aspect-ratio[data-lazy] img');

  if (!lazyImages.length) return;

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        const wrapper = img.closest('.aspect-ratio');

        // Get the actual image source
        const src = img.dataset.src;
        const srcset = img.dataset.srcset;

        if (src) {
          img.src = src;
        }

        if (srcset) {
          img.srcset = srcset;
        }

        // Remove loading state when image loads
        img.addEventListener('load', () => {
          wrapper.classList.remove('aspect-ratio--loading');
          wrapper.classList.remove('aspect-ratio--placeholder');
        });

        // Handle error
        img.addEventListener('error', () => {
          wrapper.classList.remove('aspect-ratio--loading');
          wrapper.classList.add('aspect-ratio--placeholder');
        });

        imageObserver.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px 0px',
    threshold: 0.01
  });

  lazyImages.forEach(img => {
    const wrapper = img.closest('.aspect-ratio');
    wrapper.classList.add('aspect-ratio--loading');
    imageObserver.observe(img);
  });

  // Handle video play buttons
  const playButtons = container.querySelectorAll('.aspect-ratio__play');

  playButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const wrapper = btn.closest('.aspect-ratio');
      const video = wrapper.querySelector('video');
      const iframe = wrapper.querySelector('iframe');

      if (video) {
        video.play();
        btn.style.display = 'none';

        video.addEventListener('pause', () => {
          btn.style.display = 'flex';
        });
      }

      if (iframe) {
        // For YouTube/Vimeo embeds, we can auto-play by modifying src
        const src = iframe.src;
        if (src.includes('youtube') || src.includes('vimeo')) {
          const separator = src.includes('?') ? '&' : '?';
          iframe.src = src + separator + 'autoplay=1';
          btn.style.display = 'none';
        }
      }
    });
  });
}
