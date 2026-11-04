function fetchProvinces() {
    // URL API trả về dữ liệu tỉnh thành
    fetch('http://localhost:3124/api/v1/provinces')  // Thay bằng URL API thực tế của bạn
        .then(response => response.json())
        .then(data => {
            // Kiểm tra dữ liệu trả về có hợp lệ không
            if (data.errCode === 200 && Array.isArray(data.data.data)) {
                const startPointSelect = document.getElementById('tourStartPoint');
                const endPointSelect = document.getElementById('tourEndPoint');

                // Xóa các option cũ
                startPointSelect.innerHTML = '<option value="">Chọn điểm khởi hành</option>';
                endPointSelect.innerHTML = '<option value="">Chọn điểm đến</option>';

                // Thêm các option mới từ dữ liệu API
                data.data.data.forEach(province => {
                    const optionStart = document.createElement('option');
                    optionStart.value = province.name; // Dùng _id làm giá trị
                    optionStart.textContent = province.name; // Tên tỉnh thành
                    startPointSelect.appendChild(optionStart);

                    const optionEnd = document.createElement('option');
                    optionEnd.value = province.name;
                    optionEnd.textContent = province.name;
                    endPointSelect.appendChild(optionEnd);
                });
            } else {
                console.error('Dữ liệu không hợp lệ:', data);
            }
        })
        .catch(error => {
            console.error('Lỗi khi lấy dữ liệu tỉnh thành:', error);
        });
}
function generateTourId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'TOUR-';
    for (let i = 0; i < 7; i++) { // Tạo chuỗi 10 ký tự ngẫu nhiên
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Tự động gán ID Tour khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    const tourIdInput = document.getElementById('tourId');
    tourIdInput.value = generateTourId();
});

// Gọi hàm fetchProvinces khi trang web tải
document.addEventListener('DOMContentLoaded', fetchProvinces);
document.querySelector('.crudFrom').addEventListener('submit', async (event) => {
    event.preventDefault(); // Ngăn chặn tải lại trang

    // Thu thập dữ liệu từ form
    const tourData = {
        id: document.getElementById('tourId').value,
        name: document.getElementById('tourName').value,
        price: parseFloat(document.getElementById('tourPrice').value),
        imageLink: document.getElementById('tourIamge').value,
        destination: document.getElementById('tourEndPoint').value,
        departurePoint: document.getElementById('tourStartPoint').value,
        transport: {
            id: document.querySelector('.tour-input-transport').value // Lấy ID phương tiện
        },
        tourType: {
            id: document.querySelector('.tour-input-type').value // Lấy ID loại tour
        },
        calendar: [
        ]
    };
    console.log(tourData)

    try {
        const response = await fetch('http://localhost:8080/api/v1/tours', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(tourData),
        });

        if (response.ok) {
            const result = await response.json();
            alert('Thêm tour thành công!');
            console.log('Kết quả:', result);

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
    window.location.href = '/tour'; // Quay lại trang danh sách tour
});