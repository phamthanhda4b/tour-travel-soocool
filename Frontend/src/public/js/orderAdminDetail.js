let uto = [];
const orderInfor = document.querySelector(".order-detail-infor");

// Hàm trích xuất userId và tourOrderId từ URL
function extractVoucherIdFromUrl(url) {
    const splitId = url.split('/');
    if (splitId.length < 6) {
        console.error("URL không hợp lệ:", url);
        return { userId: null, tourOrderId: null };
    }
    return { userId: splitId[3], tourOrderId: splitId[5] };
}

const { userId, tourOrderId } = extractVoucherIdFromUrl(window.location.pathname);

// Định dạng ngày
function formatDate(dateString) {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    if (isNaN(date)) return "Không xác định";
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

function formatDateNotTime(dateString) {
    if (!dateString) return "Không xác định";
    const date = new Date(dateString);
    if (isNaN(date)) return "Không xác định";
    return date.toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
}

// Định dạng số
function formatScientificNumber(number) {
    return Number(number || 0).toLocaleString('en-US', {
        maximumFractionDigits: 0,
    });
}

// Phân loại khách hàng
function classifyUser(level) {
    switch (level) {
        case 0 :
            return "Em bé"
        case 1:
            return "Trẻ nhỏ";
        case 2:
            return "Trẻ em";
        case 3:
            return "Người lớn";
        default:
            return "Không xác định";
    }
}

// Chuyen doi trang thai
function changeStatusToText(status){
    switch (status) {
        case 0:
            return "Đang chờ xử lý";
        case 1:
            return "Đã tiếp nhận";
        case 2:
            return "Đã hoàn thành";
        case -1:
            return "Đã hủy";
        default:
            return "Không xác định";
    }
}

// Lấy dữ liệu đơn hàng từ API
async function getUTorByID(userId, tourOrderId) {
    if (!userId || !tourOrderId) {
        alert("Dữ liệu không hợp lệ.");
        return;
    }

    try {
        orderInfor.innerHTML = "<p class='loading'>Đang tải dữ liệu...</p>";
        const response = await axios.get(`http://localhost:8080/api/v1/orders/utos-by-order?userId=${userId}&orderId=${tourOrderId}`);

        if (response.status === 200 && response.data) {
            uto = response.data;
            console.log("Dữ liệu nhận được:", uto);
            renderData(uto);
            renderButton(uto.status);
        } else {
            throw new Error("Dữ liệu trả về không hợp lệ");
        }
    } catch (error) {
        console.error("Lỗi khi lấy dữ liệu:", error);
        const errorMessage = error.response?.data?.message || "Không thể lấy dữ liệu đơn hàng. Vui lòng thử lại!";
        orderInfor.innerHTML = `<p class='error'>${errorMessage}</p>`;
        alert(errorMessage);
    }
}

// Render dữ liệu lên giao diện
function renderData(uto) {
    if (!uto) {
        orderInfor.innerHTML = "<p>Không có dữ liệu đơn hàng</p>";
        return;
    }

    const html = `
        <div class="form-infor infor-user-order">
            <div class="item-infor infor-user">
                <div class="item-infor-title">Mã khách hàng:</div>
                <div class="item-infor-value">${uto?.id?.userId || "Không có dữ liệu"}</div>
            </div>
            <div class="item-infor infor-order-date">
                <div class="item-infor-title">Ngày đặt:</div>
                <div class="item-infor-value">${formatDate(uto?.tourOrder?.orderDate)}</div>
            </div>
        </div>
        <div class="item-infor infor-tour-order-id">
            <div class="item-infor-title">Mã đơn:</div>
            <div class="item-infor-value">${uto?.id?.tourOrderId || "Không có dữ liệu"}</div>
        </div>
        <div class="infor-tour">
            <div class="infor-tour-header">
                <div class="infor-tour-header-data">Mã</div>
                <div class="infor-tour-header-data">Tên tour</div>
                <div class="infor-tour-header-data">Hình ảnh</div>
                <div class="infor-tour-header-data">Giá</div>
                <div class="infor-tour-header-data">Điểm đi</div>
                <div class="infor-tour-header-data">Điểm đến</div>
                <div class="infor-tour-header-data">Loại tour</div>
                <div class="infor-tour-header-data">Phương tiện</div>
                <div class="infor-tour-header-data">Ngày đi</div>
            </div>
            <div class="infor-tour-data">
                <div class="infor-tour-ele">${uto?.tourOrder?.tour?.tourId || "Không có dữ liệu"}</div>
                <div class="infor-tour-ele">${uto?.tourOrder?.tour?.name || "Không có dữ liệu"}</div>
                <div class="infor-tour-ele">
                    <img src="${uto?.tourOrder?.tour?.tourImageLink || '/path/to/default-image.jpg'}" alt="Hình ảnh tour" style="width: 50px; height: 50px;">
                </div>
                <div class="infor-tour-ele">${formatScientificNumber(uto?.tourOrder?.tour?.tourPrice)}</div>
                <div class="infor-tour-ele">${uto?.tourOrder?.tour?.tourDeparturePoint || "Không xác định"}</div>
                <div class="infor-tour-ele">${uto?.tourOrder?.tour?.tourDestination || "Không xác định"}</div>
                <div class="infor-tour-ele">${uto?.tourOrder?.tour?.tourType?.tourTypeName || "Không xác định"}</div>
                <div class="infor-tour-ele">${uto?.tourOrder?.tour?.transport?.name || "Không xác định"}</div>
                <div class="infor-tour-ele">${formatDateNotTime(uto?.tourStartDate)}</div>
            </div>
        </div>
        <div class="infor-member">
            <div class="infor-member-header">
                <div class="infor-member-header-data">Mã</div>
                <div class="infor-member-header-data">Tên hành khách</div>
                <div class="infor-member-header-data">Giới tính</div>
                <div class="infor-member-header-data">Ngày sinh</div>
                <div class="infor-member-header-data">Phân loại</div>
            </div>
            ${Array.isArray(uto?.tourOrder?.members) && uto.tourOrder.members.length > 0 
                ? uto.tourOrder.members.map((member) => `
                    <div class="infor-member-data">
                        <div class="infor-member-ele">${member.id || "Không có dữ liệu"}</div>
                        <div class="infor-member-ele">${member.name || "Không có dữ liệu"}</div>
                        <div class="infor-member-ele">${member.gender || "Không xác định"}</div>
                        <div class="infor-member-ele">${formatDateNotTime(member.dob)}</div>
                        <div class="infor-member-ele">${classifyUser(member.role)}</div>
                    </div>
                `).join("")
                : `<p>Không có thông tin hành khách</p>`}
        </div>
        <div class="item-infor infor-price">
            <div class="item-infor-title">Tổng tiền:</div>
            <div class="item-infor-value">${formatScientificNumber(uto?.tourOrder?.totalPrice)}</div>
        </div>
        <div class="item-infor infor-price">
            <div class="item-infor-title">Trạng thái:</div>
            <div class="item-infor-value">${changeStatusToText(uto?.status)}</div>
        </div>
    `;

    orderInfor.innerHTML = html;
}

function renderButton(status) {
    let html = '';

    if (status === 0) {
        html = `
            <button class="button-close">Đóng</button>
            <button class="button-submit" value="1">Xác nhận</button>
            <button class="button-cancel" value="-1">Hủy đơn</button>
        `;
    } else if (status === 1) {
        html = `
            <button class="button-close">Đóng</button>
            <button class="button-submit" value="2">Hoàn thành</button>
        `;
    } else {
        html = `<button class="button-close">Đóng</button>`;
    }

    const buttonContainer = document.querySelector(".order-detail-button");
    if (buttonContainer) {
        buttonContainer.innerHTML = html;
    } else {
        console.error("Phần tử .order-detail-button không tồn tại");
    }
    addFeature()
}

// update status

async function updateStatusOrder (userId, tourOrderId,status){
    try {
        const response = await axios.put(`http://localhost:8080/api/v1/orders?userId=${userId}&orderId=${tourOrderId}&status=${status}`)
        if(response.status == 200){
            alert("Cập nhật trạng thái thành công")
             window.location.href ="/admin-order"
        }
    } catch (error) {
        console.log("Lỗi khi cập nhật trạng thái đơn đặt tour");
        alert("Lỗi khi cập nhật trạng thái đơn đặt tour");     
    }
}

function addFeature (){
    const btnClose = document.querySelector(".button-close")
    const btnSubmit = document.querySelector(".button-submit")
    const btnCancel = document.querySelector(".button-cancel")

    if(btnClose){
        btnClose.addEventListener("click", () => {
            window.location.href ="/admin-order"
        })
    }
    if(btnSubmit){
        btnSubmit.addEventListener("click", () => {
            const status = btnSubmit.value;
            updateStatusOrder(userId,tourOrderId,status)
        })
    }
    if(btnCancel){
        btnCancel.addEventListener("click", () => {
            const status = btnCancel.value;
            updateStatusOrder(userId,tourOrderId,status)
        })
    }
}
// Khởi chạy khi tải trang
document.addEventListener("DOMContentLoaded", () => {
    getUTorByID(userId, tourOrderId);
});
