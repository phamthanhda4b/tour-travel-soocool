// Lấy ID tour từ URL
const urlPath = window.location.pathname;
const CalendarId = urlPath.split('/').pop(); // Lấy ID từ URL
document.getElementById("calendarId").value= CalendarId;
// Hàm lấy thông tin tour từ API
async function getCalendarById(id) {
    try {
        const response = await axios.get(`http://localhost:8080/api/Calendar/Calendars/id/${id}`);
        if (response.status === 200) {
            const calendar = response.data;
            const dateStart = calendar.calendarStartDate.split('T')[0];
            // Cập nhật các trường thông tin
            document.getElementById('dateStart').value = dateStart;
            document.getElementById('slot').value = calendar.calendarSlot;

        } else {
            console.error('Lỗi khi lấy thông tin calendar');
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin calendar:', error);
    }
}
document.addEventListener('DOMContentLoaded', getCalendarById(CalendarId));

document.querySelector('.crudFrom').addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn chặn tải lại trang

    // Thu thập dữ liệu từ form và xử lý startDate
    const rawStartDate = document.getElementById('dateStart').value; // Giá trị từ input (YYYY-MM-DD)
    const now = new Date(); // Lấy thời gian hiện tại

    // Lấy giờ, phút và giây hiện tại
    const hours = now.getHours().toString().padStart(2, '0'); // Đảm bảo luôn có 2 chữ số
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');

    // Ghép ngày và thời gian
    const formattedStartDate = `${rawStartDate}T${hours}:${minutes}:${seconds}`;

    const calendarData = {
        id: parseInt(CalendarId),
        startDate: formattedStartDate,
        slot: parseInt(document.getElementById('slot').value,10),
    };
    console.log(calendarData);
    console.log(JSON.stringify(calendarData)); // Kiểm tra dữ liệu trước khi gửi

        try {
        const response = await fetch(`http://localhost:8080/api/Calendar/Calendars/${CalendarId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(calendarData),
        });
        if (response.status=200) {
            alert('Thêm tour thành công!');
            // Reset form
            document.querySelector('.crudFrom').reset();
        } else {
            const error = await response.json();
            alert('Thêm tour thất bại: ' + (error.message || 'Lỗi không xác định'));
            console.error('Lỗi:', error);
        }
    } catch (err) {
        alert('Không thể kết nối đến API. Vui lòng thử lại sau.');
        console.error('Lỗi kết nối:', err);
    }
});
const cancelAddTourBtn = document.getElementById('cancelAddTour');
cancelAddTourBtn.addEventListener('click', () => {
    window.location.href = `/tour`; // Quay lại trang danh sách tour
});
document.addEventListener('DOMContentLoaded', fetchVoucher);