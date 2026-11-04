(function () {
  function getStoredUser() {
    let username = sessionStorage.getItem('username') || localStorage.getItem('username');
    let userId = sessionStorage.getItem('userID') || localStorage.getItem('userID');
    if (username === 'undefined' || username === 'null' || !username) {
      username = null;
    }
    if (userId === 'undefined' || userId === 'null' || !userId) {
      userId = '';
    }
    return { username: username, userId: userId };
  }

  function updateHeaderAuth() {
    const user = getStoredUser();
    const myOrdersNav = document.getElementById('header-nav-my-orders');
    const headerRight = document.querySelector('.header__right') || document.querySelector('.header__content');
    const headerButtonBox = document.querySelector('.header__button');

    // 1. Quản lý hiển thị mục "Tour đã đặt"
    if (myOrdersNav) {
      if (user.username) {
        myOrdersNav.style.setProperty('display', 'inline-block', 'important');
        myOrdersNav.classList.remove('is-hidden');
      } else {
        myOrdersNav.style.setProperty('display', 'none', 'important');
        myOrdersNav.classList.add('is-hidden');
      }
    }

    // 2. Quản lý nút Đăng nhập / Khối Avatar
    if (user.username && headerRight) {
      // Ẩn triệt để nút Đăng nhập / Đăng ký
      if (headerButtonBox) {
        headerButtonBox.classList.add('hide');
        headerButtonBox.style.setProperty('display', 'none', 'important');
      }

      // Kiểm tra xem đã chèn khối thông tin người dùng chưa (tránh chèn trùng)
      let customerBox = headerRight.querySelector('.header__infor-customer');
      if (!customerBox) {
        headerRight.insertAdjacentHTML(
          'beforeend',
          `<div class="header__infor-customer" id="header-user-profile-box">
              <span class="icon">
                <i class="fa-solid fa-user"></i>
              </span>
              <span class="header__infor-customer-name">${user.username}</span>
              <span class="header__infor-customer-icon">
                <i class="fa-solid fa-caret-down"></i>
              </span>
              <ul class="header__infor-block">
                <li class="header__infor-item">
                  <a href="/customer/edit/${user.userId}" class="header__infor-link">
                    <i class="fa-solid fa-user-pen" style="margin-right: 6px;"></i> Chỉnh sửa thông tin
                  </a>
                </li>
                <li class="header__infor-item">
                  <a href="/my-orders" class="header__infor-link">
                    <i class="fa-solid fa-suitcase-rolling" style="margin-right: 6px;"></i> Tour đã đặt
                  </a>
                </li>
                <li class="header__infor-item logout" id="customer-logout-btn">
                  <span>Đăng xuất</span>
                  <span class="icon__logout" title="Đăng xuất">
                    <i class="fa-solid fa-right-from-bracket"></i>
                  </span>
                </li>
              </ul>
            </div>`
        );

        customerBox = headerRight.querySelector('.header__infor-customer');
      }

      // Gắn sự kiện đăng xuất
      const logoutBtn = headerRight.querySelector('#customer-logout-btn');
      if (logoutBtn && !logoutBtn.__logoutBound) {
        logoutBtn.__logoutBound = true;
        logoutBtn.addEventListener('click', async (e) => {
          e.preventDefault();
          sessionStorage.clear();
          localStorage.clear();
          try {
            if (typeof axios !== 'undefined') {
              await axios.post('/api/v1/auth/logout');
            } else {
              await fetch('/api/v1/auth/logout', { method: 'POST' });
            }
          } catch (err) {
            console.error('Lỗi khi đăng xuất:', err);
          }
          window.location.href = '/';
        });
      }
    } else {
      // Chưa đăng nhập: Hiện nút Đăng nhập / Đăng ký
      if (headerButtonBox) {
        headerButtonBox.classList.remove('hide');
        headerButtonBox.style.removeProperty('display');
      }
      const customerBox = document.getElementById('header-user-profile-box');
      if (customerBox) {
        customerBox.remove();
      }
    }
  }

  // Chạy ngay và chạy lại khi DOM sẵn sàng
  updateHeaderAuth();
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', updateHeaderAuth);
  }
})();
