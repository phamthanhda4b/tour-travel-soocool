// Lấy URL hiện tại
const url = window.location.href;

// Tạo một đối tượng URLSearchParams để xử lý query string
const params = new URLSearchParams(new URL(url).search);

// Lấy giá trị của 'token'
const token = params.get('token');


async function changePassword(token, newPassword) {
    try {
        const respone = await axios.post(`http://localhost:8080/api/User/savePassword`,
            {
                token: token,
                newPassword: newPassword,
                oldPassword: "",
                id: 0,
                userName: "",
                passWord: "",
                name: "",
                phoneNumber: "",
                email: "",
                address: "",
                role: 0
            }
        )
        if (respone.status == 200) {
            alert(respone.data.message)
            window.location.href = "/login"
        }
    } catch (error) {
        console.log("Thay đổi mật khẩu không thành công " + error);
        alert("Thay đổi mật khẩu không thành công");
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const newPasswordInput = document.getElementById("new-password").value;
    const reNewPasswordInput = document.getElementById("re-new-password").value;
    const submitButton = document.querySelector(".btn-change-password-submit");
    const buttonBack = document.querySelector(".btn-change-password-back");
    buttonBack.addEventListener("click", (e) => {
        e.preventDefault()
        window.location.href = "/login"
    })
    // Validate function
    const validatePasswords = () => {
        const newPassword = document.getElementById("new-password").value.trim();
        const reNewPassword = document.getElementById("re-new-password").value.trim();
    
        // Reset styles
        document.getElementById("new-password").classList.remove("error");
        document.getElementById("re-new-password").classList.remove("error");
    
        if (newPassword.length < 8) {
            alert("Mật khẩu phải có độ dài lớn hơn 8 ký tự.");
            document.getElementById("new-password").classList.add("error");
            return false;
        }
    
        if (newPassword !== reNewPassword) {
            alert("Mật khẩu không khớp.");
            document.getElementById("re-new-password").classList.add("error");
            return false;
        }
    
        return true;
    };
    

    submitButton.addEventListener("click", (event) => {
        event.preventDefault(); // Ngăn form submit mặc định
    
        const newPassword = document.getElementById("new-password").value.trim();
        console.log(newPassword);
        
        if (validatePasswords()) {
            changePassword(token, newPassword);
        }
    });
    

    // Toggle password visibility
    const togglePasswordIcons = document.querySelectorAll(".toggle-password");
    togglePasswordIcons.forEach((icon) => {
        icon.addEventListener("click", () => {
            const passwordInput = icon.previousElementSibling;
            const isPasswordVisible = passwordInput.type === "text";
            passwordInput.type = isPasswordVisible ? "password" : "text";
            icon.name = isPasswordVisible ? "eye-off-outline" : "eye-outline";
        });
    });
});
