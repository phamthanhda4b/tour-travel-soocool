// Hàm khởi tạo toggle mật khẩu
function setupTogglePassword() {
    document.querySelectorAll('.toggle-password').forEach(icon => {
        icon.addEventListener('click', function () {
            const input = this.previousElementSibling;
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            this.setAttribute('name', isPassword ? 'eye-outline' : 'eye-off-outline');
        });
    });
}

// Hàm lấy dữ liệu từ form
function getFormData() {
    const tinhText = document.querySelector('#tinh option:checked').text;
    const quanText = document.querySelector('#quan option:checked').text;
    const phuongText = document.querySelector('#phuong option:checked').text;

    // Kiểm tra nếu Tỉnh, Quận, Phường có tên hợp lệ
    if (tinhText === "Tỉnh Thành" || quanText === "Quận Huyện" || phuongText === "Phường Xã") {
        alert("Vui lòng chọn đầy đủ Tỉnh, Quận, Phường!");
        return null; // Không tiếp tục nếu giá trị không hợp lệ
    }

    return {
        userName: document.querySelector('#username').value,
        passWord: document.querySelector('#password').value,
        reEnterPassword: document.querySelector('#re-enter_password').value,
        name: document.querySelector('#name').value,
        phoneNumber: document.querySelector('#phone_number').value,
        email: document.querySelector('#email').value,
        address: `${tinhText} - ${quanText} - ${phuongText}`
    };
}

// Hàm gửi yêu cầu đăng ký với Axios
function registerUser(user) {
    axios.post('http://localhost:8080/api/User/users', user)
        .then(response => {
            alert('Đăng ký thành công!');
            console.log(response.data);
            window.location.href = '/login';
        })
        .catch(error => {
            alert(error.response ? error.response.data.message : 'Đã xảy ra lỗi khi đăng ký!');
        });
}

// Hàm kiểm tra ô nhập liệu trống (chỉ áp dụng cho input và select có required)
function isFieldEmpty(field) {
    if (!field.value || field.value === "0") {
        field.setCustomValidity("Vui lòng nhập trường này!");
        return true;
    }
    field.setCustomValidity(""); // Xóa thông báo khi có giá trị hợp lệ
    return false;
}

// Hàm kiểm tra các trường dữ liệu từ form
function validateForm() {
    const form = document.querySelector('.form-content');
    let isValid = true;

    // Kiểm tra tất cả các input và select có required
    form.querySelectorAll("input[required], select[required]").forEach(field => {
        if (isFieldEmpty(field)) {
            isValid = false;
        }
    });

    return isValid;
}

// Hàm kiểm tra mật khẩu
function validatePassword(passWord, reEnterPassword) {
    const minLength = 8, maxLength = 20;

    // Kiểm tra độ dài và sự khớp của mật khẩu
    if (passWord.length < minLength || passWord.length > maxLength) {
        alert(`Mật khẩu phải có độ dài từ ${minLength} đến ${maxLength} ký tự!`);
        return false;
    }
    if (passWord !== reEnterPassword) {
        alert('Mật khẩu không khớp!');
        return false;
    }

    return true;
}

// Hàm kiểm tra số điện thoại
function validatePhoneNumber(phoneNumber) {
    // Biểu thức chính quy kiểm tra số điện thoại bắt đầu với 0 và có chính xác 10 chữ số
    const phonePattern = /^0[0-9]{9}$/;

    if (!phonePattern.test(phoneNumber)) {
        alert('Số điện thoại không hợp lệ! Vui lòng nhập số điện thoại đúng');
        return false;
    }
    return true;
}

// Hàm kiểm tra email hợp lệ
function validateEmail(email) {
    // Biểu thức chính quy để kiểm tra định dạng email
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!emailPattern.test(email)) {
        alert('Địa chỉ email không hợp lệ! Vui lòng nhập lại.');
        return false;
    }
    return true;
}

// Hàm xử lý sự kiện đăng ký
function handleRegistration() {
    document.querySelector('.btn-submit').addEventListener('click', function (e) {
        e.preventDefault();

        // Kiểm tra nếu form hợp lệ
        if (!validateForm()) {
            alert('Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Nếu form hợp lệ, lấy dữ liệu từ form và gửi đăng ký
        const user = getFormData();

        // Kiểm tra mật khẩu
        if (!validatePassword(user.passWord, user.reEnterPassword)) {
            return;
        }

        // Kiểm tra số điện thoại
        if (!validatePhoneNumber(user.phoneNumber)) {
            return;
        }

        // Kiểm tra email hợp lệ
        if (!validateEmail(user.email)) {
            return;
        }

        // Gửi yêu cầu đăng ký
        registerUser(user);
    });
}


// Hàm lấy Tỉnh Thành và thêm vào dropdown
function loadTinhThanh() {
    fetch('https://esgoo.net/api-tinhthanh/1/0.htm')
        .then(response => response.json())
        .then(data_tinh => {
            if (data_tinh.error === 0) {
                populateTinhDropdown(data_tinh.data);
            }
        })
        .catch(error => console.error('Có lỗi khi lấy dữ liệu Tỉnh Thành:', error));
}

// Hàm thêm các tỉnh vào dropdown
function populateTinhDropdown(tinhData) {
    const tinhSelect = document.getElementById('tinh');
    tinhData.forEach(val_tinh => {
        const option = document.createElement('option');
        option.value = val_tinh.id;
        option.textContent = val_tinh.full_name;
        tinhSelect.appendChild(option);
    });
    tinhSelect.addEventListener('change', function () {
        const idtinh = this.value;
        idtinh !== '0' ? loadQuanHuyen(idtinh) : clearOptions('quan', 'phuong');
    });
}

// Hàm lấy Quận Huyện và thêm vào dropdown
function loadQuanHuyen(idtinh) {
    fetch(`https://esgoo.net/api-tinhthanh/2/${idtinh}.htm`)
        .then(response => response.json())
        .then(data_quan => {
            if (data_quan.error === 0) {
                populateQuanDropdown(data_quan.data);
            }
        })
        .catch(error => console.error('Có lỗi khi lấy dữ liệu Quận Huyện:', error));
}

// Hàm thêm các quận vào dropdown
function populateQuanDropdown(quanData) {
    const quanSelect = document.getElementById('quan');
    clearOptions('quan', 'phuong');
    quanData.forEach(val_quan => {
        const option = document.createElement('option');
        option.value = val_quan.id;
        option.textContent = val_quan.full_name;
        quanSelect.appendChild(option);
    });
    quanSelect.addEventListener('change', function () {
        this.value !== '0' ? loadPhuongXa(this.value) : clearOptions('phuong');
    });
}

// Hàm lấy Phường Xã và thêm vào dropdown
function loadPhuongXa(idquan) {
    fetch(`https://esgoo.net/api-tinhthanh/3/${idquan}.htm`)
        .then(response => response.json())
        .then(data_phuong => {
            if (data_phuong.error === 0) {
                populatePhuongDropdown(data_phuong.data);
            }
        })
        .catch(error => console.error('Có lỗi khi lấy dữ liệu Phường Xã:', error));
}

// Hàm thêm các phường vào dropdown
function populatePhuongDropdown(phuongData) {
    const phuongSelect = document.getElementById('phuong');
    clearOptions('phuong');
    phuongData.forEach(val_phuong => {
        const option = document.createElement('option');
        option.value = val_phuong.id;
        option.textContent = val_phuong.full_name;
        phuongSelect.appendChild(option);
    });
}

// Hàm xóa các options trong dropdown
function clearOptions(...selectIds) {
    selectIds.forEach(selectId => {
        const selectElement = document.getElementById(selectId);
        selectElement.innerHTML = '<option value="0">Chọn</option>';
    });
}

// Khởi tạo sự kiện khi trang tải
document.addEventListener('DOMContentLoaded', () => {
    setupTogglePassword();
    handleRegistration();
    loadTinhThanh();
});
