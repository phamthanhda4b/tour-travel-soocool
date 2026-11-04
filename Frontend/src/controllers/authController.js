let authService = require('../services/authService');
const handleLogin = async (req, res) => {
  try {
    let id = req.body.userId;
    if (!id) {
      return res.status(400).json({
        errCode: 2,
        message: 'Yêu cầu không được thực hiện',
      });
    }
    let token = await authService.handleLogin(id);
    if (token.status !== 0) {
      return res.status(400).json({
        errCode: 1,
        message: 'Không tồn tại người dùng',
      });
    }
    res.cookie('SessionID', token.access_token, {
      maxAge: 24 * 60 * 60 * 1000,
    });
    return res.status(200).json({
      errCode: 0,
      message: 'Đăng nhập thành công',
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: 3,
      message: 'Error from server',
    });
  }
};

module.exports = {
  handleLogin: handleLogin,
};
