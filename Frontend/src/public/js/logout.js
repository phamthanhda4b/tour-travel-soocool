window.handleLogout = async function (e) {
  if (e && e.preventDefault) e.preventDefault();
  try {
    sessionStorage.clear();
    localStorage.clear();
    // Gọi API xóa SessionID cookie
    if (window.axios) {
      await axios.post('/api/v1/auth/logout');
    } else {
      await fetch('/api/v1/auth/logout', { method: 'POST' });
    }
  } catch (error) {
    console.error('Error during logout:', error);
  } finally {
    // Luôn chuyển hướng về trang đăng nhập
    window.location.href = '/login';
  }
};

document.addEventListener('DOMContentLoaded', function () {
  const logoutButtons = document.querySelectorAll('#admin-logout-btn, .header__infor-item.logout, .nav-button-logout');
  logoutButtons.forEach(function (btn) {
    btn.removeEventListener('click', window.handleLogout);
    btn.addEventListener('click', window.handleLogout);
  });
});
