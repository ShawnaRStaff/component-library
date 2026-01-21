/**
 * File Upload Component JavaScript
 */

function initFileUpload(container) {
  const fileUploads = container.querySelectorAll('.file-upload');

  fileUploads.forEach(uploadArea => {
    const input = uploadArea.querySelector('.file-upload__input');
    const fileList = uploadArea.parentElement.querySelector('.file-upload__list');

    if (!input) return;

    // Drag and drop events
    ['dragenter', 'dragover'].forEach(eventName => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.add('is-dragover');
      });
    });

    ['dragleave', 'drop'].forEach(eventName => {
      uploadArea.addEventListener(eventName, (e) => {
        e.preventDefault();
        e.stopPropagation();
        uploadArea.classList.remove('is-dragover');
      });
    });

    uploadArea.addEventListener('drop', (e) => {
      const files = e.dataTransfer.files;
      handleFiles(files, input, fileList, uploadArea);
    });

    // Regular file input change
    input.addEventListener('change', () => {
      handleFiles(input.files, input, fileList, uploadArea);
    });
  });

  function handleFiles(files, input, fileList, uploadArea) {
    if (!files.length) return;

    // Avatar upload special handling
    if (uploadArea.classList.contains('file-upload--avatar')) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          let preview = uploadArea.querySelector('.file-upload__preview');
          if (!preview) {
            preview = document.createElement('img');
            preview.className = 'file-upload__preview';
            uploadArea.appendChild(preview);
          }
          preview.src = e.target.result;
        };
        reader.readAsDataURL(file);
      }
      return;
    }

    // Standard file list handling
    if (fileList) {
      Array.from(files).forEach(file => {
        const item = createFileItem(file);
        fileList.appendChild(item);

        // Simulate upload progress (demo only)
        simulateUpload(item);
      });
    }
  }

  function createFileItem(file) {
    const item = document.createElement('div');
    item.className = 'file-upload__item file-upload__item--uploading';

    const isImage = file.type.startsWith('image/');
    const iconHtml = isImage
      ? `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
           <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"/>
         </svg>`
      : `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
           <path fill-rule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"/>
         </svg>`;

    item.innerHTML = `
      <div class="file-upload__item-icon">${iconHtml}</div>
      <div class="file-upload__item-info">
        <p class="file-upload__item-name">${file.name}</p>
        <p class="file-upload__item-size">${formatFileSize(file.size)}</p>
        <div class="file-upload__progress">
          <div class="file-upload__progress-bar" style="width: 0%"></div>
        </div>
      </div>
      <button type="button" class="file-upload__item-remove" aria-label="Remove file">
        <svg width="16" height="16" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"/>
        </svg>
      </button>
    `;

    // Remove button handler
    const removeBtn = item.querySelector('.file-upload__item-remove');
    removeBtn.addEventListener('click', () => {
      item.remove();
    });

    return item;
  }

  function simulateUpload(item) {
    const progressBar = item.querySelector('.file-upload__progress-bar');
    const progress = item.querySelector('.file-upload__progress');
    let width = 0;

    const interval = setInterval(() => {
      width += Math.random() * 15;
      if (width >= 100) {
        width = 100;
        clearInterval(interval);
        item.classList.remove('file-upload__item--uploading');
        setTimeout(() => {
          progress.style.display = 'none';
        }, 500);
      }
      progressBar.style.width = `${width}%`;
    }, 200);
  }

  function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
