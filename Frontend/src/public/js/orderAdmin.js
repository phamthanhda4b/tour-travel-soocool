// Biến toàn cục
let pageCurrent = 1; // Trang hiện tại
let pageSize = 10; // Số mục mỗi trang
let totalPages = 0; // Tổng số trang
let currentStatus = 0; // Trạng thái hiện tại: 0 - Chờ xử lý
let utos = []
// DOM Elements
const quantityPending = document.querySelector(".pending-value");
const quantityReceived = document.querySelector(".received-value");
const quantityCompleted = document.querySelector(".completed-value");
const quantityCanceled = document.querySelector(".canceled-value");
const btnPending = document.querySelector(".action__pendding");
const btnReceived = document.querySelector(".action__received");
const btnCompleted = document.querySelector(".action__completed");
const btnCanceled = document.querySelector(".action__canceled");
const tableData = document.querySelector(".table-row-data");
const paginationContainer = document.querySelector(".pagination");

// Định dạng ngày
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
    });
}

// Định dạng số
function formatScientificNumber(number) {
    return Number(number).toLocaleString('en-US', {
        maximumFractionDigits: 0,
    });
}

// Lấy tổng số lượng đơn theo trạng thái
async function getUserTourOrdersQuantity(status) {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/orders?pageNumber=1&size=1&status=${status}`);
        if (response.status === 200) {
            const totalElements = response.data.totalElements || 0;
            if (status === 0) quantityPending.textContent = totalElements;
            if (status === 1) quantityReceived.textContent = totalElements;
            if (status === 2) quantityCompleted.textContent = totalElements;
            if (status === -1) quantityCanceled.textContent = totalElements;
        }
    } catch (error) {
        console.error("Lỗi khi lấy tổng số lượng:", error.response || error.message);
        alert("Không thể lấy tổng số lượng đơn hàng. Vui lòng thử lại!");
    }
}

// Lấy dữ liệu đơn hàng theo trạng thái và trang
async function getUserTourOrders(pageNumber, status) {
    try {
        const response = await axios.get(`http://localhost:8080/api/v1/orders?pageNumber=${pageNumber}&size=${pageSize}&status=${status}`);
        if (response.status === 200) {
            const data = response.data.content || [];
            totalPages = response.data.totalPages || 0;
            utos = data
            renderData(data);
            renderPagination(pageNumber, totalPages);
        }
    } catch (error) {
        console.error("Lỗi khi lấy đơn hàng:", error.response || error.message);
        alert("Không thể lấy dữ liệu đơn hàng. Vui lòng thử lại!");
    }
}

// Hiển thị dữ liệu trong bảng
function renderData(orders) {
    const html = orders.length > 0
        ? orders.map((item) => `
            <div class="table-row">
                <div class="table-data" id="user_id">${item.id.userId}</div>
                <div class="table-data" id="order_id">${item.id.tourOrderId}</div>
                <div class="table-data" >${item.tourOrder.tour.tourId}</div>
                <div class="table-data">${formatDate(item.tourOrder.orderDate)}</div>
                <div class="table-data">${formatScientificNumber(item.tourOrder.totalPrice)}</div>
                <div class="table-data">
                    <button class="table-data-view" value='{"userId": "${item.id.userId}", "tourOrderId": "${item.id.tourOrderId}"}'
>
                        <i class="fa-solid fa-eye"></i> Xem
                    </button>
                </div>
            </div>`).join("")
        : `
            <div class="table-row">
                <div class="table-data">Không có dữ liệu</div>
                <div class="table-data">Không có dữ liệu</div>
                <div class="table-data">Không có dữ liệu</div>
                <div class="table-data">Không có dữ liệu</div>
                <div class="table-data">Không có dữ liệu</div>
                <div class="table-data">Không có dữ liệu</div>
            </div>`;
    tableData.innerHTML = html;
    attachViewEvents()
}

// Hiển thị phân trang
function renderPagination(currentPage, totalPages) {
    const paginationItems = [];

    if (totalPages <= 7) {
        for (let i = 1; i <= totalPages; i++) paginationItems.push(i);
    } else if (currentPage <= 4) {
        paginationItems.push(1, 2, 3, 4, 5, "...", totalPages);
    } else if (currentPage > totalPages - 4) {
        paginationItems.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
    } else {
        paginationItems.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
    }

    // Tạo HTML cho phân trang
    let pageHtml = `
        <div class="page-item">
            <button class="prev-page ${currentPage === 1 ? "disabled" : ""}">Trước</button>`;
    paginationItems.forEach((item) => {
        if (item === "...") {
            pageHtml += `<span class="dots">${item}</span>`;
        } else {
            pageHtml += `
                <button class="page-numbers ${item === currentPage ? "page-number-active" : ""}" data-page="${item}">
                    ${item}
                </button>`;
        }
    });
    pageHtml += `
            <button class="next-page ${currentPage === totalPages ? "disabled" : ""}">Tiếp</button>
        </div>`;

    paginationContainer.innerHTML = pageHtml;

    // Gắn sự kiện cho phân trang
    document.querySelector(".prev-page").addEventListener("click", () => {
        if (currentPage > 1){ 
            pageCurrent = currentPage - 1; 
            currentPage -= 1
            getUserTourOrders(currentPage, currentStatus)
        };
    });
    document.querySelector(".next-page").addEventListener("click", () => {
        if (currentPage < totalPages) {
            pageCurrent = currentPage + 1; 
            currentPage += 1
            getUserTourOrders(++currentPage, currentStatus)
        };
    });
    document.querySelectorAll(".page-numbers").forEach((button) => {
        button.addEventListener("click", (e) => {
            const selectedPage = parseInt(e.target.getAttribute("data-page"));
            currentPage = selectedPage; // Cập nhật currentPage
            pageCurrent = currentPage
            getUserTourOrders(selectedPage, currentStatus);
        });
    });
}

// Xử lý sự kiện nút trạng thái
btnPending.addEventListener("click", () => {
    currentStatus = 0;
    getUserTourOrders(1, currentStatus);
});
btnReceived.addEventListener("click", () => {
    currentStatus = 1;
    getUserTourOrders(1, currentStatus);
});
btnCompleted.addEventListener("click", () => {
    currentStatus = 2;
    getUserTourOrders(1, currentStatus);
});
btnCanceled.addEventListener("click", () => {
    currentStatus = -1;
    getUserTourOrders(1, currentStatus);
});

function attachViewEvents() {
    document.querySelectorAll(".table-data-view").forEach((item) => {
        item.addEventListener("click", () => {
            const { userId, tourOrderId } = JSON.parse(item.value);
            console.log("User ID:", userId, "Order ID:", tourOrderId);
            if(userId && tourOrderId){
                window.location.href = `/admin-order/user/${userId}/order/${tourOrderId}`
            } else {
                alert("Lỗi")
            }
        });
    });
}


// Khởi tạo
document.addEventListener("DOMContentLoaded", () => {
    getUserTourOrdersQuantity(0);
    getUserTourOrdersQuantity(1);
    getUserTourOrdersQuantity(2);
    getUserTourOrdersQuantity(-1);
    getUserTourOrders(1, currentStatus);
});
// Hàm xử lý tìm kiếm voucher
function searchOrders(keyword) {
    if (!keyword) {
        // alert("Không có dữ liệu để tìm kiếm!");
        getUserTourOrders(pageCurrent,currentStatus)
    } else {
        const filteredOrder = utos.filter(u => u.id.tourOrderId == keyword);
        renderData(filteredOrder);

    }
}


// Gán sự kiện tìm kiếm cho ô nhập liệu
const searchInput = document.querySelector('.action__search--text');
searchInput.addEventListener('input', (event) => {
    const keyword = event.target.value.trim();
    searchOrders(keyword);
});