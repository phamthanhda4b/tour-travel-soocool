document.addEventListener('DOMContentLoaded', () => {
  // Toggle xem danh sách hành khách
  document.querySelectorAll('.order-card__members-title').forEach((titleElem) => {
    titleElem.addEventListener('click', () => {
      const container = titleElem.closest('.order-card__members');
      const listElem = container.querySelector('.order-card__members-list');
      titleElem.classList.toggle('collapsed');
      if (listElem) {
        listElem.style.display = titleElem.classList.contains('collapsed')
          ? 'none'
          : 'flex';
      }
    });
  });

  // Hủy đơn đặt tour khi còn ở trạng thái Đang chờ xử lý (status = 0)
  document.querySelectorAll('.btn-order--cancel').forEach((btnCancel) => {
    btnCancel.addEventListener('click', async (e) => {
      e.preventDefault();
      const orderId = btnCancel.dataset.orderId;
      if (!orderId) return;

      const confirmResult = await swal({
        title: 'Xác nhận hủy đơn?',
        text: `Bạn có chắc chắn muốn hủy đơn đặt tour mã #${orderId} không?`,
        icon: 'warning',
        buttons: ['Không', 'Đồng ý hủy'],
        dangerMode: true,
      });

      if (!confirmResult) return;

      try {
        btnCancel.disabled = true;
        btnCancel.innerText = 'Đang hủy...';

        const response = await axios.put(
          `/api/v1/customer/orders/${orderId}/cancel`
        );

        if (response.data && response.data.errCode === 0) {
          await swal('Thành công', 'Đã hủy đơn đặt tour thành công!', 'success');
          window.location.reload();
        } else {
          swal(
            'Lỗi',
            response.data.message || 'Không thể hủy đơn đặt tour lúc này!',
            'error'
          );
          btnCancel.disabled = false;
          btnCancel.innerText = 'Hủy đơn';
        }
      } catch (error) {
        console.error('Cancel order error:', error);
        swal(
          'Lỗi',
          'Có lỗi xảy ra khi hủy đơn đặt tour. Vui lòng thử lại sau!',
          'error'
        );
        btnCancel.disabled = false;
        btnCancel.innerText = 'Hủy đơn';
      }
    });
  });
});
