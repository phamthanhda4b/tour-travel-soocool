// Slide Add JS
document.addEventListener('DOMContentLoaded', () => {
  let activeTab = 'link'; // 'link' or 'file'
  let selectedFile = null;

  const tabs = document.querySelectorAll('.upload-tab');
  const paneLink = document.getElementById('paneLink');
  const paneFile = document.getElementById('paneFile');
  const slideImageUrl = document.getElementById('slideImageUrl');
  const slideImageFile = document.getElementById('slideImageFile');
  const dropzone = document.getElementById('dropzone');
  const previewBox = document.getElementById('previewBox');
  const previewImg = document.getElementById('previewImg');
  const removePreviewBtn = document.getElementById('removePreviewBtn');
  const form = document.getElementById('addSlideForm');
  const submitBtn = document.getElementById('submitBtn');

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
        } else if (!selectedFile) {
          hidePreview();
        }
      } else {
        paneFile.classList.add('active');
        paneLink.classList.remove('active');
        if (selectedFile) {
          showPreviewFromFile(selectedFile);
        } else if (!slideImageUrl.value.trim()) {
          hidePreview();
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
      if (activeTab === 'link') hidePreview();
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

  function hidePreview() {
    previewImg.src = '';
    previewBox.classList.remove('show');
  }

  removePreviewBtn.addEventListener('click', () => {
    hidePreview();
    selectedFile = null;
    slideImageFile.value = '';
    slideImageUrl.value = '';
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

    if (activeTab === 'file') {
      if (!selectedFile) {
        Swal.fire('Thông báo', 'Vui lòng chọn file ảnh từ máy tính!', 'warning');
        return;
      }
      formData.append('image_file', selectedFile);
    } else {
      const url = slideImageUrl.value.trim();
      if (!url) {
        Swal.fire('Thông báo', 'Vui lòng dán đường link ảnh!', 'warning');
        return;
      }
      formData.append('image_url', url);
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Đang lưu...';

      const response = await fetch('/api/v1/admin/slides', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.errCode === 0) {
        Swal.fire({
          icon: 'success',
          title: 'Thành công!',
          text: 'Slide đã được tạo mới thành công.',
          timer: 1500,
          showConfirmButton: false,
        }).then(() => {
          window.location.href = '/admin/slides';
        });
      } else {
        Swal.fire('Lỗi', result.message || 'Không thể tạo slide', 'error');
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu Slide';
      }
    } catch (err) {
      console.error('Error submitting slide:', err);
      Swal.fire('Lỗi', 'Không thể kết nối đến máy chủ', 'error');
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> Lưu Slide';
    }
  });
});
