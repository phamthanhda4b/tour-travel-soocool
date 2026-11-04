const addVoucherForm = document.getElementById('addVoucherForm');
const cancelAddVoucherBtn = document.getElementById('cancelAddVoucher');

const checkType = (type, value,e) => {
    const numericType = parseInt(type, 10); // Chuyển chuỗi type thành số
    const numericValue = parseFloat(value); // Đảm bảo value là số
    
    if (numericType === 1) {
        if (numericValue >= 1000) {
            return true;
        } else {
            alert("Giá trị voucher tiền không hợp lệ");
            return false;
        }
    }
    if (numericType === 0) {
        if (numericValue > 0 && numericValue <= 100) {
            return true;
        } else {
            alert("Giá trị voucher phần trăm không hợp lệ");
            return false;
        }
    }
    return false;
};


// Xử lý form thêm mới voucher (có thể gọi API để lưu)
document.querySelector('.crud-voucher-form').addEventListener('submit', async function (e) {
    e.preventDefault(); // Chặn hành vi mặc định của form
    const id = "";
    const voucherName = document.getElementById('voucherName').value;
    const value = document.getElementById('voucherValue').value;
    const type = document.querySelector('select.voucher-input').value;
    const startDate = document.getElementById('voucherStartDate').value;
    const expiryDate = document.getElementById('voucherExpiryDate').value;

    if (checkType(type, value)) {
        try {
            const response = await axios.post('http://localhost:8080/api/v1/vouchers', {
                id: id,
                voucherName: voucherName,
                value: value,
                status : 1,
                type: type,
                startDate: new Date(startDate).toISOString(),
                expiryDate: new Date(expiryDate).toISOString(),
            });

            if (response.status === 200) {
                alert('Voucher đã được thêm mới thành công!');
                window.location.href = '/voucher'; // Điều hướng về danh sách voucher
            }
        } catch (error) {
            console.error('Lỗi khi thêm mới voucher:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại!');
        }
    } else {
        return
    }
});


// Khi nhấn nút Hủy
cancelAddVoucherBtn.addEventListener('click', () => {
    window.location.href = '/voucher'; // Quay lại trang danh sách voucher
});
