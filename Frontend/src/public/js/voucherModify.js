// Lấy các phần tử DOM
const cancelAddVoucherBtn = document.getElementById('cancelAddVoucher');
const addVoucherForm = document.getElementById('addVoucherForm');

// Lấy ID từ URL
const voucherId = extractVoucherIdFromUrl(window.location.pathname);

// Biến lưu voucher
let voucher = [];

// Hàm lấy voucher theo ID
async function fetchVoucherById(id) {
    try {
        const response = await axios.get(`${URL_API_SERVER_V1}/vouchers/voucherId/${id}`);
        if (response.status === 200) {
            voucher = response.data;
            renderVoucher(voucher);
        } else {
            showErrorMessage('Lấy voucher thất bại');
        }
    } catch (error) {
        console.error('Lỗi khi lấy voucher:', error);
        showErrorMessage('Lấy voucher thất bại');
    }
}

// Hàm hiển thị thông báo lỗi
function showErrorMessage(message) {
    alert(message);
}

// Hàm lấy ID voucher từ URL
function extractVoucherIdFromUrl(url) {
    const splitId = url.split('/').pop();
    return splitId;
}

function formatDateForInput(dateString) {
    // Chuyển chuỗi ISO thành đối tượng Date
    const date = new Date(dateString);
    
    // Lấy phần yyyy-mm-dd
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Tháng từ 0-11, cần cộng thêm 1
    const day = date.getDate().toString().padStart(2, '0');
    
    // Trả về giá trị theo định dạng yyyy-mm-dd
    return `${year}-${month}-${day}`;
}
// Hàm render voucher ra giao diện
function renderVoucher(voucher) {
    document.getElementById('voucherName').value = voucher.voucherName;
    document.getElementById('voucherType').value = voucher.type;
    document.getElementById('voucherValue').value = voucher.value;
    document.getElementById('voucherStartDate').value = formatDateForInput(voucher.startDate);
    document.getElementById('voucherExpiryDate').value = formatDateForInput(voucher.expiryDate);
    console.log(document.getElementById('voucherType').value);
    
}

// Hàm kiểm tra tính hợp lệ của type và value
function isVoucherValid(type, value) {
    const numericType = parseInt(type, 10);
    const numericValue = parseFloat(value);

    if (numericType === 1) {
        if (numericValue >= 1000) {
            return true;
        } else {
            showErrorMessage('Giá trị voucher tiền không hợp lệ');
            return false;
        }
    }

    if (numericType === 0) {
        if (numericValue > 0 && numericValue <= 100) {
            return true;
        } else {
            showErrorMessage('Giá trị voucher phần trăm không hợp lệ');
            return false;
        }
    }

    return false;
}

// Hàm cập nhật voucher
async function updateVoucher(id) {
    const voucherName = document.getElementById('voucherName').value;
    const value = document.getElementById('voucherValue').value;
    const type = document.querySelector('select.voucher-input').value;
    const startDate = document.getElementById('voucherStartDate').value;
    const expiryDate = document.getElementById('voucherExpiryDate').value;

    if (isVoucherValid(type, value)) {
        try {
            const response = await axios.put(`http://localhost:8080/api/v1/vouchers/${id}`, {
                id: id,
                voucherName: voucherName,
                value: value,
                type: type,
                startDate: new Date(startDate).toISOString(),
                expiryDate: new Date(expiryDate).toISOString(),
            });

            if (response.status === 200) {
                alert('Voucher đã được cập nhật thành công!');
                window.location.href = '/voucher'; // Quay lại trang danh sách voucher
            }
        } catch (error) {
            console.error('Lỗi khi cập nhật voucher:', error);
            showErrorMessage('Có lỗi xảy ra khi cập nhật voucher');
        }
    }
}

// Hàm xử lý sự kiện submit form
document.querySelector('.crud-voucher-form').addEventListener('submit', function (e) {
    e.preventDefault();  // Chặn hành vi mặc định của form
    updateVoucher(voucherId);  // Gọi hàm cập nhật voucher
});

// Hàm hủy thêm voucher và quay lại trang danh sách voucher
cancelAddVoucherBtn.addEventListener('click', (event) => {
    event.preventDefault();
    window.location.href = '/voucher'; // Quay lại trang danh sách voucher
});

// Lấy thông tin voucher khi load trang
fetchVoucherById(voucherId);
