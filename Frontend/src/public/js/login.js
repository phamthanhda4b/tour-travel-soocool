document
  .querySelector('.toggle-password')
  .addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const icon = this;
    if (passwordInput.type === 'password') {
      passwordInput.type = 'text';
      icon.name = 'eye-outline';
    } else {
      passwordInput.type = 'password';
      icon.name = 'eye-off-outline';
    }
  });

document
  .querySelector('form')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const remember = document.getElementById('remember').checked;
    const errorMessage = document.getElementById('error-message');

    const loginData = {
      emailOrUserName: username,
      password: password,
    };

    try {
      const response = await axios.post(
        'http://localhost:8080/api/auth/login',
        loginData
      );

      if (response.status === 200) {
        const jwtResponse = response.data.data;
        const decodedToken = typeof jwt_decode === 'function' ? jwt_decode(jwtResponse.token) : {};

        const actualUsername =
          jwtResponse.userName ||
          jwtResponse.username ||
          decodedToken.sub ||
          decodedToken.username ||
          decodedToken.userName ||
          username;
        const actualUserId = jwtResponse.userId || jwtResponse.id || decodedToken.userId || '';

        // Lưu vào cả sessionStorage và localStorage để tránh mất phiên
        sessionStorage.setItem('jwt', jwtResponse.token);
        sessionStorage.setItem('userID', actualUserId);
        sessionStorage.setItem('username', actualUsername);

        localStorage.setItem('jwt', jwtResponse.token);
        localStorage.setItem('userID', actualUserId);
        localStorage.setItem('username', actualUsername);

        try {
          await axios.post('/api/v1/auth/login', {
            userId: actualUserId,
          });
        } catch (e) {
          console.warn('Frontend auth sync warning:', e);
        }

        const roles = decodedToken.roles || [];
        if (roles.includes('ROLE_ADMIN')) {
          window.location.href = '/dashboard';
        } else {
          window.location.href = '/';
        }
      }
    } catch (error) {
      console.error('Login failed', error);
      const errorData = error.response ? error.response.data : null;
      if (errorData) {
        alert(errorData.message || 'Đăng nhập thất bại');
      } else {
        alert('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản hoặc mật khẩu!');
      }
    }
  });

const btnRegister = document.querySelector('.register-click');
if (btnRegister) {
  btnRegister.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = `/register`;
  });
}

const btnForgotPassword = document.querySelector('.ip-link');
if (btnForgotPassword) {
  btnForgotPassword.addEventListener('click', () => {
    const containerRight = document.querySelector('.container-right');
    const resetPass = document.querySelector('.reset-password');
    if (containerRight) containerRight.style.display = 'none';
    if (resetPass) resetPass.style.display = 'flex';
  });
}

const btnBack = document.querySelector('.btn-back');
if (btnBack) {
  btnBack.addEventListener('click', () => {
    const containerRight = document.querySelector('.container-right');
    const resetPass = document.querySelector('.reset-password');
    if (containerRight) containerRight.style.display = 'flex';
    if (resetPass) resetPass.style.display = 'none';
  });
}

async function resetPassword() {
  const email = document.getElementById('email').value;
  if (email && email.trim().length > 0) {
    try {
      const respone = await axios.post(
        `http://localhost:8080/api/User/resetPassword?email=${encodeURIComponent(email.trim())}`
      );
      if (respone.status == 200) {
        alert(respone.data.message || 'Yêu cầu đặt lại mật khẩu đã được gửi!');
      }
    } catch (error) {
      console.log('Gửi yêu cầu đặt lại mật khẩu thất bại ' + error);
      alert('Gửi yêu cầu đặt lại mật khẩu thất bại. Vui lòng kiểm tra lại!');
    }
  } else {
    alert('Vui lòng nhập đúng email!');
  }
}

const btnResetSubmit = document.querySelector('.btn-submit-reset');
if (btnResetSubmit) {
  btnResetSubmit.addEventListener('click', (e) => {
    e.preventDefault();
    resetPassword();
  });
}
