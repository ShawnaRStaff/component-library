/**
 * Avatar Component JavaScript
 *
 * Handles image loading failures and fallback to initials.
 */

function initAvatar(container) {
  const avatars = container.querySelectorAll('.avatar__image');

  avatars.forEach(img => {
    img.addEventListener('error', () => {
      const avatar = img.closest('.avatar');
      if (!avatar) return;

      // Hide broken image
      img.style.display = 'none';

      // Check if there's already a fallback
      if (avatar.querySelector('.avatar__initials') || avatar.querySelector('.avatar__icon')) {
        return;
      }

      // Get initials from data attribute or alt text
      const initials = avatar.dataset.initials || getInitials(img.alt);

      if (initials) {
        const initialsEl = document.createElement('span');
        initialsEl.className = 'avatar__initials';
        initialsEl.textContent = initials;
        avatar.appendChild(initialsEl);
      } else {
        // Default user icon
        avatar.innerHTML = `
          <svg class="avatar__icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          </svg>
        `;
      }
    });
  });
}

function getInitials(name) {
  if (!name) return '';

  const words = name.trim().split(/\s+/);
  if (words.length === 1) {
    return words[0].substring(0, 2).toUpperCase();
  }

  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
