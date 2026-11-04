const urlPath = window.location.pathname;
const tourId = urlPath.split('/').pop();
async function fetchVoucher(){
    fetch('http://localhost:8080/api/v1/vouchers')  // Thay bằng URL API thực tế của bạn
        .then(response => response.json())
        .then(data => {
            // Kiểm tra dữ liệu trả về có hợp lệ không
            if (true) {
                const vouchers = document.getElementById('calendarVoucher');
                // Xóa các option cũ
                vouchers.innerHTML = '<option value="">Chọn voucher</option>';
                // Thêm các option mới từ dữ liệu API
                data.forEach(province => {
                    const optionStart = document.createElement('option');
                    optionStart.value = province.id; // Dùng _id làm giá trị
                    optionStart.textContent = province.voucherName; // Tên tỉnh thành
                    vouchers.appendChild(optionStart);
                });
            } else {
                console.error('Dữ liệu không hợp lệ:', data);
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu:', error);
        });
}


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
        startDate: formattedStartDate,
        slot: parseInt(document.getElementById('slot').value,10),
        voucher: {
            id: parseInt(document.getElementById('calendarVoucher').value,10)
        },
        tour: {
            id: tourId
        }
    };
    console.log(calendarData);
    console.log(JSON.stringify(calendarData)); // Kiểm tra dữ liệu trước khi gửi

        try {
        const response = await fetch('http://localhost:8080/api/Calendar/Calendars', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(calendarData),
        });
        if (response.status=200) {
            alert('Thêm lịch trình thành công!');
            // Reset form
            document.querySelector('.crudFrom').reset();
        } else {
            const error = await response.json();
            alert('Thêm lịch trình thất bại: ' + (error.message || 'Lỗi không xác định'));
            console.error('Lỗi:', error);
        }
    } catch (err) {
        alert('Không thể kết nối đến API. Vui lòng thử lại sau.');
        console.error('Lỗi kết nối:', err);
    }
});
document.addEventListener('DOMContentLoaded', fetchVoucher);
// Khi nhấn nút Hủy
const cancelAddVoucherBtn = document.getElementById("cancelAddCalendar")
cancelAddVoucherBtn.addEventListener('click', () => {
    window.location.href = `/tour/calendar/${tourId}`; // Quay lại trang danh sách voucher
});