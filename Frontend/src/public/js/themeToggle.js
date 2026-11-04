/**
 * TourDL - Theme Toggle Script (Light / Dark Mode)
 * - Mặc định: Chế độ sáng (Light Mode).
 * - Lưu trạng thái lựa chọn trong localStorage ('tourdl_theme').
 * - Tự động cập nhật giao diện, icon và tooltip khi người dùng bấm nút chuyển đổi.
 */
(function () {
  'use strict';

  var THEME_KEY = 'tourdl_theme';
  var THEME_DARK = 'dark';
  var THEME_LIGHT = 'light';

  // Lấy theme đã lưu hoặc mặc định là sáng
  function getPreferredTheme() {
    try {
      var saved = localStorage.getItem(THEME_KEY);
      if (saved === THEME_DARK || saved === THEME_LIGHT) {
        return saved;
      }
    } catch (e) {
      console.warn('Không thể truy cập localStorage:', e);
    }
    // Mặc định là chế độ sáng theo yêu cầu
    return THEME_LIGHT;
  }

  // Cập nhật giao diện theo theme
  function applyTheme(theme) {
    var isDark = theme === THEME_DARK;
    document.documentElement.setAttribute('data-theme', theme);

    try {
      localStorage.setItem(THEME_KEY, theme);
    } catch (e) {}

    // Cập nhật tất cả các nút theme toggle trên trang
    var buttons = document.querySelectorAll(
      '.theme-toggle-btn, #theme-toggle-btn, #theme-toggle-btn-admin'
    );
    buttons.forEach(function (btn) {
      var nextThemeLabel = isDark
        ? 'Chuyển sang chế độ sáng'
        : 'Chuyển sang chế độ tối';
      btn.setAttribute('title', nextThemeLabel);
      btn.setAttribute('aria-label', nextThemeLabel);

      var label = btn.querySelector('.theme-label');
      if (label) {
        label.textContent = isDark ? 'Chế độ sáng' : 'Chế độ tối';
      }
    });

    // Phát custom event để các component khác có thể lắng nghe
    window.dispatchEvent(
      new CustomEvent('tourdl:themechange', { detail: { theme: theme } })
    );
  }

  // Đổi giữa light và dark
  function toggleTheme() {
    var current =
      document.documentElement.getAttribute('data-theme') || THEME_LIGHT;
    var next = current === THEME_DARK ? THEME_LIGHT : THEME_DARK;
    applyTheme(next);
  }

  // Khởi chạy ngay
  var currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  // Đăng ký event delegation trên document để không bị mất sự kiện khi DOM thay đổi
  document.addEventListener('click', function (e) {
    var targetBtn = e.target.closest(
      '.theme-toggle-btn, #theme-toggle-btn, #theme-toggle-btn-admin'
    );
    if (targetBtn) {
      e.preventDefault();
      toggleTheme();
    }
  });

  // Đồng bộ giữa các tab trình duyệt
  window.addEventListener('storage', function (e) {
    if (e.key === THEME_KEY && e.newValue) {
      applyTheme(e.newValue);
    }
  });

  // Expose API toàn cục
  window.TourDLTheme = {
    get: getPreferredTheme,
    set: applyTheme,
    toggle: toggleTheme,
  };
})();
