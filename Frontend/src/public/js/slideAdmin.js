// Slide Admin JS
document.addEventListener('DOMContentLoaded', () => {
  // Live search
  const searchInput = document.getElementById('slideSearchInput');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const keyword = e.target.value.trim().toLowerCase();
      const rows = document.querySelectorAll('.slide-row');
      rows.forEach((row) => {
        const title = row.getAttribute('data-title') || '';
        if (title.includes(keyword)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }
});

// Toggle status
async function toggleSlide(slideId) {
  try {
    const response = await fetch(`/api/v1/admin/slides/${slideId}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const result = await response.json();
    if (result.errCode === 0) {
      Swal.fire({
        icon: 'success',
        title: 'Thành công',
        text: 'Đã cập nhật trạng thái slide!',
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Thất bại',
        text: result.message || 'Không thể đổi trạng thái',
      });
    }
  } catch (err) {
    console.error('Error toggling slide:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể kết nối đến máy chủ',
    });
  }
}

// Delete slide
async function deleteSlide(slideId) {
  const confirmResult = await Swal.fire({
    title: 'Xác nhận xóa?',
    text: 'Bạn có chắc chắn muốn xóa slide này không? Hành động này không thể hoàn tác.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#e02424',
    cancelButtonColor: '#6c757d',
    confirmButtonText: 'Đồng ý xóa',
    cancelButtonText: 'Hủy bỏ',
  });

  if (!confirmResult.isConfirmed) return;

  try {
    const response = await fetch(`/api/v1/admin/slides/${slideId}`, {
      method: 'DELETE',
    });
    const result = await response.json();

    if (result.errCode === 0) {
      Swal.fire({
        icon: 'success',
        title: 'Đã xóa',
        text: 'Slide đã được xóa thành công!',
        timer: 1200,
        showConfirmButton: false,
      }).then(() => {
        window.location.reload();
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Lỗi',
        text: result.message || 'Không thể xóa slide',
      });
    }
  } catch (err) {
    console.error('Error deleting slide:', err);
    Swal.fire({
      icon: 'error',
      title: 'Lỗi',
      text: 'Không thể kết nối đến máy chủ',
    });
  }
}
