// Slide Modify JS
document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'link';
  let selectedFile = null;

  const form = document.getElementById('modifySlideForm');
  const slideId = form.dataset.id;
  const originalImageUrl = document.getElementById('originalImageUrl').value;
  const tabs = document.querySelectorAll('.upload-tab');
  const paneLink = document.getElementById('paneLink');
  const paneFile = document.getElementById('paneFile');
  const slideImageUrl = document.getElementById('slideImageUrl');
  const slideImageFile = document.getElementById('slideImageFile');
  const dropzone = document.getElementById('dropzone');
  const previewBox = document.getElementById('previewBox');
  const previewImg = document.getElementById('previewImg');
  const removePreviewBtn = document.getElementById('removePreviewBtn');
  const submitBtn = document.getElementById('submitBtn');

  // Initial active tab based on active class
  const initialActive = document.querySelector('.upload-tab.active');
  if (initialActive) {
    activeTab = initialActive.dataset.type;
  }

  // Tab switching
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      activeTab = tab.dataset.type;
      if (activeTab === 'link') {
        paneLink.classList.add('active');
        paneFile.classList.remove('active');
        if (slideImageUrl.value.trim()) {
          showPreview(slideImageUrl.value.trim());
        } else {
          showPreview(originalImageUrl);
        }
      } else {
        paneFile.classList.add('active');
        paneLink.classList.remove('active');
        if (selectedFile) {
          showPreviewFromFile(selectedFile);
        } else {
          showPreview(originalImageUrl);
        }
      }
    });
  });

  // Preview from Link URL
  slideImageUrl.addEventListener('input', () => {
    const url = slideImageUrl.value.trim();
    if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
      showPreview(url);
    } else {
      showPreview(originalImageUrl);
    }
  });

  // Dropzone click & drag
  dropzone.addEventListener('click', () => {
    slideImageFile.click();
  });

  ['dragenter', 'dragover'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.style.background = '#e3f2fd';
    });
  });

  ['dragleave', 'drop'].forEach((eventName) => {
    dropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      dropzone.style.background = '#fdfefe';
    });
  });

  dropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  });

  slideImageFile.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  });

  function handleFileSelected(file) {
    if (!file.type.startsWith('image/')) {
      Swal.fire('Lỗi', 'Vui lòng chọn file hình ảnh!', 'error');
      return;
    }
    selectedFile = file;
    showPreviewFromFile(file);
  }

  function showPreviewFromFile(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImg.src = e.target.result;
      previewBox.classList.add('show');
    };
    reader.readAsDataURL(file);
  }

  function showPreview(url) {
    previewImg.src = url;
    previewBox.classList.add('show');
  }

  removePreviewBtn.addEventListener('click', () => {
    selectedFile = null;
    slideImageFile.value = '';
    slideImageUrl.value = '';
    showPreview(originalImageUrl);
  });

  // Submit form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const title = document.getElementById('slideTitle').value.trim();
    const description = document.getElementById('slideDesc').value.trim();
    const link_url = document.getElementById('slideLink').value.trim();
    const order_index = document.getElementById('slideOrder').value;
    const status = document.getElementById('slideStatus').value;

    if (!title) {
      Swal.fire('Thông báo', 'Vui lòng nhập tiêu đề slide!', 'warning');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('link_url', link_url || '/');
    formData.append('order_index', order_index);
    formData.append('status', status);

    if (activeTab === 'file' && selectedFile) {
      formData.append('image_file', selectedFile);
    } else if (activeTab === 'link' && slideImageUrl.value.trim()) {
      formData.append('image_url', slideImageUrl.value.trim());
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';

      const response = await fetch(`/api/v1/admin/slides/${slideId}`, {
        method: 'PUT',
        body: formData,
      });

      const result = await response.json();

      if (result.errCode === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Cập nhật slide thành công.',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/admin/slides';
        });
      } else {
        Swal.fire('Lỗi', result.message || 'Không thể cập nhật slide', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Cập Nhật Slide';
      }
    } catch (err) {
      console.error('Error modifying slide:', err);
      Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Cập Nhật Slide';
    }
  });
});
