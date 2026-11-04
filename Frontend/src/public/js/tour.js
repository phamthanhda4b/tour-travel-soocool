let tours = []; // Mảng lưu trữ dữ liệu tour sau khi tải về từ API
let page = 0;    // Trang hiện tại, bắt đầu từ 0 (để phù hợp với API yêu cầu)
let size = 5;    // Kích thước mỗi trang (số lượng tour trên một trang)
let totalPages = 1;  // Tổng số trang, mặc định là 1

// Các nút điều hướng phân trang
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
const numberPage = document.querySelector(".numberPage");

// Xử lý sự kiện phân trang
next.addEventListener("click", nextPage);
prev.addEventListener("click", prePage);

// Hàm lấy tổng số tour và cập nhật giao diện
async function totalTour() {
    try {
        const response = await axios.get("http://localhost:8080/api/v1/tours/total");
        if (response.status === 200) {
            document.querySelector(".total-tour").innerHTML = response.data;
        }

        const response2 = await axios.get("http://localhost:8080/api/v1/tours/totalType");
        if (response2.status === 200) {
            document.querySelector(".total-tk").innerHTML = response2.data[0];
            document.querySelector(".total-tc").innerHTML = response2.data[1];
            document.querySelector(".total-gt").innerHTML = response2.data[2];
            document.querySelector(".total-cc").innerHTML = response2.data[3];
        }
    } catch (error) {
        console.error("Lỗi khi tải tổng số tour:", error);
    }
}

// Hàm tải danh sách tour từ API
async function getTours() {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/tours/admin/page?page=${page}&size=${size}`);
        if (response.status === 200) {
            tours = response.data.content;
            totalPages = response.data.totalPages;  // Cập nhật tổng số trang
            renderTours(tours);
        }
    } catch (error) {
        console.error("Lỗi khi tải danh sách tour:", error);
    }
}

// Hàm render tour ra giao diện
function renderTours(data) {
    const htmlContainer = document.querySelector('.voucher__admin--table--body');
    const html = data.map((tour) => {
        return `
            <div class="voucher__admin--table--rows" key=${tour.tourId}>
                <div class="voucher__admin--table--data">
                    <input type="radio" name='select__voucher' id="voucher-id" value="${tour.tourId}" />
                </div>
                <div class="voucher__admin--table--data">${tour.tourId}</div>
                <div class="voucher__admin--table--data">${tour.name}</div>
                <div class="voucher__admin--table--data"><img src="${tour.tourImageLink}" alt="${tour.name}"></div>
                <div class="voucher__admin--table--data">${tour.tourPrice}</div>
                <div class="voucher__admin--table--data">${tour.tourDeparturePoint}</div>
                <div class="voucher__admin--table--data">${tour.tourDestination}</div>
                <div class="voucher__admin--table--data">${tour.nameTransport}</div>
                <div class="voucher__admin--table--data">${tour.nameType}</div>
            </div>
        `;
    }).join('');
    htmlContainer.innerHTML = html;

    // Cập nhật số trang
    numberPage.innerHTML = `Trang ${page + 1} / ${totalPages}`;
}

// Hàm chuyển sang trang sau
function nextPage() {
    if (page < totalPages - 1) { // Chỉ chuyển trang nếu chưa tới trang cuối
        page++;
        getTours();
    }
}

// Hàm chuyển sang trang trước
function prePage() {
    if (page > 0) { // Chỉ chuyển trang nếu chưa ở trang đầu
        page--;
        getTours();
    }
}

// Hàm xử lý tìm kiếm tour
function searchTours(keyword) {
    const filteredTours = tours.filter(tour =>
        tour.tourId.toString().includes(keyword) || // Tìm theo mã
        tour.name.toLowerCase().includes(keyword.toLowerCase()) // Tìm theo tên
    );
    renderTours(filteredTours); // Render kết quả tìm kiếm
}
// Gán sự kiện tìm kiếm cho ô nhập liệu
const searchInput = document.querySelector('.action__search--text');
searchInput.addEventListener('input', (event) => {
    const keyword = event.target.value.trim();
    searchTours(keyword);
});
// Xử lý sự kiện khi nhấn nút "Thêm mới"
function handleAddNewVoucher() {
    const btnAddNew = document.querySelector(".action__add");
    btnAddNew.addEventListener('click', redirectPage);
}
function redirectPage(event) {
    event.stopPropagation();
    const link = event.target.closest('.action__add').dataset.link;
    if (link) {
        window.location.href = `${link}`;
    }
}


// Xử lý khi nhấn nút "Sửa"
const btnModify = document.querySelector(".action__lock");
btnModify.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="select__voucher"]:checked');
    if (selectedRadio) {
        const selectedTourId = selectedRadio.value;
        window.location.href = `/tour/modify/${selectedTourId}`;
    } else {
        alert("Bạn chưa chọn tour để sửa");
    }
});
const btnCalendar = document.querySelector(".action__delete")
btnCalendar.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="select__voucher"]:checked');
    if (selectedRadio) {
        const selectedTourId = selectedRadio.value;
        window.location.href = `/tour/calendar/${selectedTourId}`;
    } else {
        alert("Bạn chưa chọn tour");
    }
});
const btnDetail = document.querySelector(".action__adddetail")
btnDetail.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="select__voucher"]:checked');
    if (selectedRadio) {
        const selectedTourId = selectedRadio.value;
        window.location.href = `/tour/detail/${selectedTourId}`;
    } else {
        alert("Bạn chưa chọn tour");
    }
});
// Hàm xóa tour
async function deleteTour(tourId) {
    try {
        const response = await axios.delete(`http://localhost:8080/api/v1/tours/${tourId}`);
        if (response.status === 204) {
            alert('Xóa tour thành công!');
            getTours(); // Tải lại danh sách tour sau khi xóa
        } else {
            alert('Có lỗi xảy ra khi xóa tour!');
        }
    } catch (error) {
        console.error('Lỗi khi xóa tour:', error);
        alert('Lỗi khi xóa tour! Vui lòng thử lại.');
    }
}

// Xử lý sự kiện xóa tour
const btnDelete = document.querySelector(".action__remove");
btnDelete.addEventListener('click', () => {
    const selectedRadio = document.querySelector('input[name="select__voucher"]:checked');
    if (selectedRadio) {
        const selectedTourId = selectedRadio.value;
        const confirmDelete = confirm('Bạn có chắc chắn muốn xóa tour này?');
        if (confirmDelete) {
            deleteTour(selectedTourId); // Gọi hàm xóa tour
        }
    } else {
        alert('Bạn chưa chọn tour để xóa!');
    }
});


// Hàm gọi khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    page = 0;  // Bắt đầu từ trang 1 (chỉ số là 0 trong API)
    getTours(); // Tải danh sách tour
    totalTour(); // Cập nhật tổng số tour
    handleAddNewVoucher(); // Gán sự kiện cho nút "Thêm mới"
});