// Hàm ẩn tabs ngay khi tải trang
function hideTabsOnLoad(tabs) {
  window.onload = () => {
    tabs.style.opacity = '0';
    tabs.style.visibility = 'hidden';
  };
}
// Hàm xử lý hiển thị hoặc ẩn tabs khi cuộn trang
function handleScroll(tabs, scrollThreshold) {
  let lastScrollTop = 0; // Lưu vị trí cuộn trước đó

  window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;

    if (currentScroll > scrollThreshold) {
      // Khi cuộn xuống vượt ngưỡng => Hiển thị tabs
      tabs.style.opacity = '1';
      tabs.style.visibility = 'visible';
    } else {
      // Khi ở đầu trang hoặc chưa vượt ngưỡng => Ẩn tabs
      tabs.style.opacity = '0';
      tabs.style.visibility = 'hidden';
    }

    lastScrollTop = currentScroll;
  });
}
// Hàm xử lý cuộn mượt khi click vào tab
function enableSmoothScroll(tabsLinks, tabs) {
  tabsLinks.forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault(); // Ngăn chặn hành vi mặc định (cuộn ngay lập tức)

      // Lấy giá trị href (VD: #tour-info)
      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      // Cuộn đến vị trí nội dung
      if (targetElement) {
        const headerHeight = tabs.offsetHeight; // Chiều cao header cố định
        const offsetTop = targetElement.offsetTop - headerHeight;

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth', // Cuộn mượt
        });
      }
    });
  });
}
// Hàm khởi tạo tất cả chức năng
function initStickyTabs(scrollThreshold = 150) {
  const tabs = document.querySelector('.tabs-detail');
  const tabsLinks = document.querySelectorAll('.tabs-detail_container a');

  if (!tabs || tabsLinks.length === 0) return; // Kiểm tra nếu không có phần tử thì thoát

  hideTabsOnLoad(tabs); // Ẩn tabs ngay khi tải trang
  handleScroll(tabs, scrollThreshold); // Hiển thị/ẩn tabs khi cuộn
  enableSmoothScroll(tabsLinks, tabs); // Kích hoạt cuộn mượt khi click
}
// Gọi hàm khởi tạo
initStickyTabs(150); // Tham số: Ngưỡng cuộn tối thiểu để tabs hiện

function extractVoucherIdFromUrl(url) {
  const splitId = url.split('/').pop();
  return splitId;
}
let tourId = extractVoucherIdFromUrl(window.location.pathname);
async function fetchTourDetail(tourID) {
  try {
    const response = await axios.get(
      `http://localhost:3124/api/v1/tours/${tourID}`
    );
    if (response.status == 200) {
      const tour = response.data.data;
      const priceFormatted = new Intl.NumberFormat('vi-VN').format(tour.price);

      document.querySelector('.tour-header h2').textContent = tour.name;
      document.querySelector('.img-main img').src = tour.image;
      document.querySelector(
        '.overview-content .overview-i1 .overview-item .dtq'
      ).textContent = tour.tourDetail.sight_seeing;
      document.querySelector(
        '.overview-content .overview-i1 .overview-item .at'
      ).textContent = tour.tourDetail.cuisine;
      document.querySelector(
        '.overview-content .overview-i1 .overview-item .dt'
      ).textContent = tour.tourDetail.suitable_people;

      document.querySelector(
        '.overview-content .overview-i2 .overview-item .tg'
      ).textContent = tour.tourDetail.time_suiable;
      document.querySelector(
        '.overview-content .overview-i2 .overview-item .pt'
      ).textContent = tour.tourDetail.transport;
      document.querySelector(
        '.overview-content .overview-i2 .overview-item .km'
      ).textContent = tour.tourDetail.sale_description;

      const priceElement = document.querySelector('.pice p');

      // Thêm giá vào p và phần "/Khách" vào một thẻ span
      priceElement.innerHTML = `${priceFormatted} đ <span>/Khách</span>`;
      document.querySelector('.tour-pice-pagecode span').innerText = tour.id;

      // document.querySelector('.idtour').textContent = tour.id;
      document.querySelector('.departure').textContent = tour.departure_point;
      // document.querySelector('.tmGo').textContent = new Date(tour.tourCalendars[0].start_date).toLocaleDateString();
      // document.querySelector('.slot').textContent = tour.tourCalendars[0].slot;

      // Lấy các thẻ select cho ngày và thẻ span cho số lượng ghế
      const tourDateSelect = document.getElementById('tourDate');
      const tourSlotSpan = document.getElementById('tourSlot');

      // Lưu thông tin các lịch trình để truy cập sau
      const calendars = tour.tourCalendars;

      // Lấy thông tin lịch trình đầu tiên
      const firstCalendar = calendars[0];

      // Hiển thị số ghế ngồi từ lịch trình đầu tiên
      tourSlotSpan.textContent = `${firstCalendar.slot} ghế`;

      // Xóa các option cũ
      tourDateSelect.innerHTML = '';

      // Duyệt qua tất cả các lịch trình tour có trong tourCalendars
      calendars.forEach((calendar) => {
        // Định dạng ngày từ ISO string
        const formattedDate = new Date(
          calendar.start_date
        ).toLocaleDateString();

        // Tạo option cho ngày khởi hành
        const dateOption = document.createElement('option');
        dateOption.value = calendar.id; // Giá trị là ID lịch trình, không phải ngày
        dateOption.textContent = formattedDate; // Văn bản hiển thị là ngày đã định dạng
        tourDateSelect.appendChild(dateOption);
      });

      // Lắng nghe sự kiện thay đổi ngày khởi hành
      tourDateSelect.addEventListener('change', (event) => {
        const selectedDateId = event.target.value;

        // Lọc lịch trình tương ứng với ngày được chọn
        const selectedCalendar = calendars.find(
          (calendar) => calendar.id == selectedDateId
        );

        // Cập nhật số ghế ngồi khi thay đổi ngày
        if (selectedCalendar) {
          // Hiển thị số ghế vào thẻ span
          tourSlotSpan.textContent = `${selectedCalendar.slot} ghế`;
        }
      });
    }
  } catch (error) {}
}

const monthNames = [
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
];

let currentMonth = new Date().getMonth(); // Tháng hiện tại (0-11)
let currentYear = new Date().getFullYear(); // Năm hiện tại

// Khởi tạo lịch và danh sách tháng
function initCalendar() {
  createMonthList();
  renderCalendar(currentMonth, currentYear);

  document.getElementById('prevMonth').addEventListener('click', () => {
    navigateMonth(-1);
  });

  document.getElementById('nextMonth').addEventListener('click', () => {
    navigateMonth(1);
  });
}

// Tạo danh sách tháng
function createMonthList() {
  const monthList = document.getElementById('monthList');
  monthList.innerHTML = ''; // Xóa nội dung cũ

  for (let i = 0; i < 5; i++) {
    // Hiển thị 5 tháng
    const monthIndex = (currentMonth + i) % 12;
    const yearOffset = Math.floor((currentMonth + i) / 12);
    const year = currentYear + yearOffset;

    const li = document.createElement('li');
    li.textContent = `${monthNames[monthIndex]}/${year}`;
    li.dataset.month = monthIndex;
    li.dataset.year = year;

    li.addEventListener('click', () => {
      currentMonth = monthIndex;
      currentYear = year;
      renderCalendar(currentMonth, currentYear);
      updateActiveMonth();
    });

    monthList.appendChild(li);
  }

  updateActiveMonth(); // Đánh dấu tháng hiện tại khi khởi tạo
}

// Hiển thị lịch
function renderCalendar(month, year) {
  document.getElementById(
    'monthName'
  ).textContent = `Tháng ${monthNames[month]}/${year}`;

  const calendarDays = document.getElementById('calendarDays');
  calendarDays.innerHTML = ''; // Xóa nội dung cũ

  const firstDay = new Date(year, month, 1).getDay(); // Ngày đầu tiên trong tháng
  const daysInMonth = new Date(year, month + 1, 0).getDate(); // Số ngày trong tháng

  // Tạo các ô trống trước ngày đầu tiên
  for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
    const emptyDiv = document.createElement('div');
    emptyDiv.classList.add('empty');
    calendarDays.appendChild(emptyDiv);
  }

  // Tạo các ngày trong tháng
  for (let day = 1; day <= daysInMonth; day++) {
    const dayDiv = document.createElement('div');
    dayDiv.textContent = day;
    dayDiv.classList.add('day');
    if (
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      dayDiv.classList.add('current-day'); // Đánh dấu ngày hiện tại
    }
    calendarDays.appendChild(dayDiv);
  }
}

// Cập nhật lớp active cho tháng được chọn
function updateActiveMonth() {
  const monthListItems = document.querySelectorAll('#monthList li');
  monthListItems.forEach((item) => {
    const month = parseInt(item.dataset.month);
    const year = parseInt(item.dataset.year);
    if (month === currentMonth && year === currentYear) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// Xử lý sự kiện nút điều hướng tháng
function navigateMonth(offset) {
  currentMonth += offset;
  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }
  createMonthList(); // Cập nhật danh sách tháng
  renderCalendar(currentMonth, currentYear);
}

// Hàm xử lí chuyển trang đặt tour
let buttonOrderTour = document.querySelector('button.order-tour');
buttonOrderTour.addEventListener('click', () => {
  let tourId = document.querySelector('.tour-pice-pagecode span').innerText;
  let dateId = document.querySelector('#tourDate').value;
  window.location.href = `/order-tour?tourId=${tourId}&dateId=${dateId}`;
});

// Gọi hàm khởi tạo
initCalendar();

// document.querySelector('.btn-pick').addEventListener('click', function () {
//     const target = document.getElementById('tour-info');
//     if (target) {
//         const offset = target.getBoundingClientRect().top + window.scrollY - 50; // Cuộn cách phần tử 50px phía trên
//         window.scrollTo({ top: offset, behavior: 'smooth' });
//     }
// });

document.addEventListener('DOMContentLoaded', () => {
  fetchTourDetail(tourId);
});
