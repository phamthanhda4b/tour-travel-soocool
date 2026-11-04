// Lấy tất cả các nút điều hướng
let btnNavLink = document.querySelectorAll('.nav__link');

// Gán sự kiện click cho các nút điều hướng
btnNavLink.forEach((item) => {
  item.addEventListener('click', (event) => {
    event.stopPropagation();
    
    // Lấy đường dẫn từ thuộc tính data-link
    const link = event.currentTarget.dataset.link;

    // Điều hướng tới đường dẫn tương ứng
    window.location.href = `${link}`;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  const currentPath = window.location.pathname;

  // Tìm nút có data-link trùng khớp với đường dẫn hiện tại
  const activeButton = document.querySelector(`.nav-button[data-link="${currentPath}"]`);
  if (activeButton) {
    // Thêm class checked cho nút đó
    activeButton.classList.add('checked');
  }
});
