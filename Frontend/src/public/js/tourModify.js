// Lấy ID tour từ URL
const urlPath = window.location.pathname;
const tourId = urlPath.split('/').pop(); // Lấy ID từ URL

// Hàm lấy tỉnh thành
async function fetchProvinces() {
    try {
        const response = await fetch('http://localhost:3124/api/v1/provinces'); // URL API trả về dữ liệu tỉnh thành
        const data = await response.json();

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
    } catch (error) {
        console.error('Lỗi khi lấy dữ liệu tỉnh thành:', error);
    }
}

// Hàm lấy thông tin tour từ API
async function getTourById(id) {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/tours/tour/${id}`);
        if (response.status === 200) {
            const tour = response.data;

            // Cập nhật các trường thông tin
            document.getElementById('tourId').value = tour.tourId;
            document.getElementById('tourName').value = tour.name;
            document.getElementById('tourPrice').value = tour.tourPrice;
            document.getElementById('tourIamge').value = tour.tourImageLink;

            // Xử lý phương tiện di chuyển
            document.querySelector('.tour-input-transport').value = tour.nameTransport === "Xe" ? 1 : 2;

            // Xử lý loại tour
            const typeMap = {
                "Tiết Kiệm": 1,
                "Giá tốt": 2,
                "Tiêu chuẩn": 3,
                "Cao cấp": 4
            };
            document.querySelector('.tour-input-type').value = typeMap[tour.nameType] || "";

            // Đặt giá trị cho Điểm Khởi Hành và Điểm Đến sau khi fetchProvinces hoàn tất
            const startPointSelect = document.getElementById('tourStartPoint');
            const endPointSelect = document.getElementById('tourEndPoint');

            // Chờ cho fetchProvinces hoàn tất và cập nhật các lựa chọn cho startPointSelect và endPointSelect
            await fetchProvinces();

            // Lọc và gán giá trị nếu tồn tại
            const startPointOption = Array.from(startPointSelect.options).find(
                option => option.textContent.trim() === tour.tourDeparturePoint.trim()
            );
            if (startPointOption) startPointSelect.value = startPointOption.value;

            const endPointOption = Array.from(endPointSelect.options).find(
                option => option.textContent.trim() === tour.tourDestination.trim()
            );
            if (endPointOption) endPointSelect.value = endPointOption.value;

        } else {
            console.error('Lỗi khi lấy thông tin tour');
        }
    } catch (error) {
        console.error('Lỗi khi lấy thông tin tour:', error);
    }
}

// Cập nhật tour thông qua API
async function updateTour(id) {
    // Lấy các giá trị từ form
    const tourId= document.getElementById('tourId').value;
    const tourName=document.getElementById('tourName').value;
    const tourPrice = document.getElementById('tourPrice').value;
    const des = document.getElementById('tourEndPoint').value;
    const depart = document.getElementById('tourStartPoint').value;
    const image = document.getElementById('tourIamge').value;

    const updatedTour = {
        id: tourId,
        name: tourName,
        price: tourPrice,
        imageLink: image,
        fileName: "",
        destination: des,
        departurePoint: depart,
        transport: {
            id: document.querySelector('.tour-input-transport').value
        },
        tourType: {
            id: document.querySelector('.tour-input-type').value
        },
        calendar: []
    };

    try {
        const response = await axios.put(`http://localhost:8080/api/v1/tours/tour/${id}`, updatedTour);
        if (response.status === 200) {
            alert("Tour đã được cập nhật thành công!");
            window.location.href = '/tour';  // Chuyển hướng về danh sách tour
        } else {
            console.error('Cập nhật tour thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi cập nhật tour:', error);
    }
}

// Khi trang tải xong
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await fetchProvinces(); // Đảm bảo danh sách tỉnh thành đã tải
        getTourById(tourId); // Lấy thông tin tour sau khi danh sách tỉnh đã có
    } catch (error) {
        console.error('Lỗi khi tải dữ liệu trang:', error);
    }
});

// Lắng nghe sự kiện submit của form
const form = document.querySelector('.crudFrom'); 
if (form) {
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        updateTour(tourId); // Gọi hàm updateTour với ID của tour
    });
}
const cancelAddTourBtn = document.getElementById('cancelAddTour');
cancelAddTourBtn.addEventListener('click', () => {
    window.location.href = '/tour'; // Quay lại trang danh sách tour
});
