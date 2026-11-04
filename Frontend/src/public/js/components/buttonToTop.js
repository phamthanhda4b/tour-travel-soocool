(function () {
  if (window.__floatingWidgetsInitialized) return;
  window.__floatingWidgetsInitialized = true;

  function initFloatingWidgets() {
    // 1. Xử lý nút cuộn lên đầu trang (Back to top)
    const buttonTop = document.querySelector('.button-top');
    if (buttonTop) {
      buttonTop.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });

      const handleScroll = () => {
        if (window.scrollY > 120) {
          buttonTop.classList.add('active');
        } else {
          buttonTop.classList.remove('active');
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      handleScroll();
    }

    // 2. Xử lý chatbox trên thiết bị di động / click toggle
    const chatboxWidget = document.getElementById('tour-chatbox-widget');
    const chatboxBtn = document.getElementById('chatbox-btn-main');

    if (chatboxWidget && chatboxBtn) {
      chatboxBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        chatboxWidget.classList.toggle('is-open');
      });

      // Đóng khi click bên ngoài màn hình
      document.addEventListener('click', (e) => {
        if (!chatboxWidget.contains(e.target)) {
          chatboxWidget.classList.remove('is-open');
        }
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFloatingWidgets);
  } else {
    initFloatingWidgets();
  }
})();
