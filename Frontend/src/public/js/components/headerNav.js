/**
 * Header Navigation & Quick Search Interaction
 * 3TV Travel
 */
(function () {
  function initHeaderSearch() {
    const searchInput = document.getElementById('header-search-input');
    const searchBtn = document.getElementById('header-search-btn');

    function performSearch(keyword) {
      if (!keyword || !keyword.trim()) return;
      keyword = keyword.trim();

      const isHomePage = window.location.pathname === '/' || window.location.pathname === '';
      if (!isHomePage) {
        window.location.href = `/?search=${encodeURIComponent(keyword)}#tours-section`;
        return;
      }

      // Đang ở trang chủ: cuộn xuống danh sách tour và lọc kết quả
      const toursSection = document.getElementById('tours-section');
      if (toursSection) {
        toursSection.scrollIntoView({ behavior: 'smooth' });
      }

      // Tìm kiếm trong danh sách tour đã render
      const tourItems = document.querySelectorAll('.tour-list__item');
      let matchCount = 0;
      const lowerKeyword = keyword.toLowerCase();

      tourItems.forEach((item) => {
        const text = item.textContent.toLowerCase();
        if (text.includes(lowerKeyword)) {
          item.style.display = '';
          matchCount++;
        } else {
          item.style.display = 'none';
        }
      });

      // Nếu không tìm thấy hoặc muốn tìm bằng bộ lọc
      const emptyMsgId = 'header-search-no-results';
      let emptyMsg = document.getElementById(emptyMsgId);
      const container = document.querySelector('.tour-list__item-container');

      if (matchCount === 0 && container) {
        if (!emptyMsg) {
          emptyMsg = document.createElement('div');
          emptyMsg.id = emptyMsgId;
          emptyMsg.style.cssText =
            'text-align: center; padding: 40px 20px; font-size: 1.5rem; color: #64748b; width: 100%;';
          emptyMsg.innerHTML = `<i class="fa-solid fa-magnifying-glass" style="font-size: 3rem; color: #94a3b8; display: block; margin-bottom: 12px;"></i>Không tìm thấy tour phù hợp với từ khóa "<strong>${keyword}</strong>". <br><a href="/" style="color: #0b5da7; text-decoration: underline; display: inline-block; margin-top: 10px; font-weight: bold;">Xem tất cả tour</a>`;
          container.appendChild(emptyMsg);
        } else {
          emptyMsg.style.display = 'block';
        }
      } else if (emptyMsg) {
        emptyMsg.style.display = 'none';
      }
    }

    if (searchInput) {
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
          performSearch(searchInput.value);
        }
      });
    }

    if (searchBtn) {
      searchBtn.addEventListener('click', (e) => {
        e.preventDefault();
        performSearch(searchInput ? searchInput.value : '');
      });
    }

    // Kiểm tra query parameter ?search= hoặc ?destination= trên URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get('search') || urlParams.get('destination');
    if (searchParam && searchInput) {
      searchInput.value = searchParam;
      setTimeout(() => {
        performSearch(searchParam);
      }, 600);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderSearch);
  } else {
    initHeaderSearch();
  }
})();
