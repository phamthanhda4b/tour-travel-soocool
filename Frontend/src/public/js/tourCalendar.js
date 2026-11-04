let calendars = [];

// Lấy ID tour từ URL
const urlPath = window.location.pathname;
const tourId = urlPath.split('/').pop();

// Định dạng ngày theo chuẩn 'vi-VN'
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString('vi-VN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

// Lấy danh sách lịch từ API
async function getCalendars(tourId) {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/Calendar/Calendars/${tourId}`
    );
    if (response.status === 200) {
      calendars = response.data;
      renderCalendars(calendars);
    }
  } catch (error) {
    console.error('Lỗi khi tải danh sách lịch tour:', error);
  }
}

// Render danh sách lịch ra giao diện
function renderCalendars(data) {
  const htmlContainer = document.querySelector('.tour__admin--table--body');
  const html = data
    .map(
      (calendar) => `
        <div class="tour__admin--table--rows" key="${calendar.tourId}">
            <div class="tour__admin--table--data">
                <input type="radio" name="select__voucher" id="voucher-id" value="${
                  calendar.calendarId
                }" />
            </div>
            <div class="tour__admin--table--data">${calendar.calendarId}</div>
            <div class="tour__admin--table--data">${formatDate(
              calendar.calendarStartDate
            )}</div>
            <div class="tour__admin--table--data">${calendar.calendarSlot}</div>
            <div class="tour__admin--table--data">${
              calendar.voucher === null ? '' : calendar.voucher.voucherName
            }</div>
        </div>
    `
    )
    .join('');
  htmlContainer.innerHTML = html;
}

// Xử lý sự kiện khi nhấn nút "Thêm mới"
function handleAddNewVoucher() {
  const btnAddNew = document.querySelector('.action__add');
  btnAddNew.addEventListener('click', redirectPage);
}

// Chuyển trang khi thêm mới
function redirectPage(event) {
  event.stopPropagation();
  const link = event.target.closest('.action__add').dataset.link;
  if (link) {
    window.location.href = `${link}/${tourId}`;
  }
}

// Xử lý sự kiện khi nhấn nút "Sửa"
function handleModifyCalendar() {
  const btnModify = document.querySelector('.action__lock');
  btnModify.addEventListener('click', () => {
    const selectedRadio = document.querySelector(
      'input[name="select__voucher"]:checked'
    );
    if (selectedRadio) {
      const selectedCalendarId = selectedRadio.value;
      window.location.href = `/calendar/modify/${selectedCalendarId}`;
    } else {
      alert('Bạn chưa chọn lịch tour để sửa!');
    }
  });
}

// Xóa lịch tour qua API
async function deleteCalendar(calendarId) {
  try {
    const response = await axios.delete(
      `http://localhost:8080/api/Calendar/Calendar/${calendarId}`
    );
    if (response.status === 200) {
      alert('Xóa lịch tour thành công!');
      getCalendars(tourId); // Tải lại danh sách sau khi xóa
    } else {
      alert('Có lỗi xảy ra khi xóa lịch tour!');
    }
  } catch (error) {
    console.error('Lỗi khi xóa lịch tour:', error);
    alert('Lỗi khi xóa lịch tour! Vui lòng thử lại.');
  }
}

// Xử lý sự kiện khi nhấn nút "Xóa"
function handleDeleteCalendar() {
  const btnDelCalendar = document.querySelector('.action__delete');
  btnDelCalendar.addEventListener('click', () => {
    const selectedRadio = document.querySelector(
      'input[name="select__voucher"]:checked'
    );
    if (selectedRadio) {
      const selectedCalendarId = selectedRadio.value;
      const confirmDelete = confirm('Bạn có chắc chắn muốn xóa lịch tour này?');
      if (confirmDelete) {
        deleteCalendar(selectedCalendarId);
      }
    } else {
      alert('Bạn chưa chọn lịch tour để xóa!');
    }
  });
}

// Thực hiện các hành động khi trang đã tải
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await getCalendars(tourId); // Tải danh sách lịch
    handleAddNewVoucher(); // Xử lý thêm mới
    handleModifyCalendar(); // Xử lý sửa
    handleDeleteCalendar(); // Xử lý xóa
  } catch (error) {
    console.error('Lỗi khi tải dữ liệu trang:', error);
  }
});
