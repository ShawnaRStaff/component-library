/**
 * Code Block Component
 *
 * Copy functionality and collapsible behavior.
 */

function initCodeBlock(container) {
  // Handle copy buttons
  const copyButtons = container.querySelectorAll('.code-block__copy');

  copyButtons.forEach(button => {
    button.addEventListener('click', async () => {
      const codeBlock = button.closest('.code-block');
      const code = codeBlock.querySelector('code');

      if (code) {
        const text = code.textContent;

        try {
          await navigator.clipboard.writeText(text);
          button.classList.add('is-copied');

          // Change icon to checkmark temporarily
          const originalIcon = button.innerHTML;
          button.innerHTML = `
            <svg viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
            </svg>
          `;

          setTimeout(() => {
            button.classList.remove('is-copied');
            button.innerHTML = originalIcon;
          }, 2000);
        } catch (err) {
          // Fallback for older browsers
          const textarea = document.createElement('textarea');
          textarea.value = text;
          textarea.style.position = 'fixed';
          textarea.style.opacity = '0';
          document.body.appendChild(textarea);
          textarea.select();
          document.execCommand('copy');
          document.body.removeChild(textarea);

          button.classList.add('is-copied');
          setTimeout(() => button.classList.remove('is-copied'), 2000);
        }
      }
    });
  });

  // Handle collapsible code blocks
  const expandButtons = container.querySelectorAll('.code-block__expand');

  expandButtons.forEach(button => {
    button.addEventListener('click', () => {
      const codeBlock = button.closest('.code-block');
      const isExpanded = codeBlock.classList.toggle('is-expanded');
      button.textContent = isExpanded ? 'Show less' : 'Show more';
    });
  });
}

// Simple syntax highlighter (basic tokens only)
function highlightCode(code, language) {
  const patterns = {
    keyword: /\b(const|let|var|function|return|if|else|for|while|class|import|export|from|async|await|try|catch|throw|new|this)\b/g,
    string: /(["'`])(?:(?!\1)[^\\]|\\.)*\1/g,
    number: /\b\d+\.?\d*\b/g,
    comment: /\/\/.*$|\/\*[\s\S]*?\*\//gm,
    function: /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*(?=\()/g,
    punctuation: /[{}[\];(),.:]/g,
    operator: /[+\-*/%=<>!&|^~?:]+/g
  };

  let highlighted = code;

  // Escape HTML
  highlighted = highlighted
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');

  // Apply highlighting
  Object.entries(patterns).forEach(([token, pattern]) => {
    highlighted = highlighted.replace(pattern, (match) => {
      return `<span class="token-${token}">${match}</span>`;
    });
  });

  return highlighted;
}

// Export for use
if (typeof window !== 'undefined') {
  window.highlightCode = highlightCode;
}
