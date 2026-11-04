require('dotenv').config();
const jwt = require('jsonwebtoken');

let validateAPI = (req, res, next) => {
  try {
    let authHeader = req.cookies['SessionID'];
    if (!authHeader) {
      return res.status(401).json({
        errCode: 2,
        message: 'Không token xác thực',
      });
    }
    try {
      let tokenVerify = jwt.verify(authHeader, process.env.JWT_SECRET);
      res.locals.userRole = tokenVerify.role;
      res.locals.userId = tokenVerify.userId;
      res.locals.userName = tokenVerify.userName;
      next();
    } catch (error) {
      console.log(error);
      return res.status(401).json({
        errCode: 2,
        message: 'Token không hợp lệ',
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: 3,
      message: 'Error from server',
    });
  }
};

let authorizationAPI = (req, res, next) => {
  try {
    let role = res.locals.userRole;
    if (role !== 1 && role !== 0) {
      return res.status(401).json({
        errCode: 1,
        message: 'Không có quyền truy cập dữ liệu',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      errCode: 3,
      message: 'Error from server',
    });
  }
};

let authorizationAPIAdmin = (req, res, next) => {
  try {
    let role = res.locals.userRole;
    if (role !== 1) {
      return res.status(401).json({
        errCode: 1,
        message: 'Không có quyền truy cập dữ liệu',
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      errCode: 3,
      message: 'Error from server',
    });
  }
};

// Middleware kiểm tra đã đăng nhập hay chưa
let checkLogged = async (req, res, next) => {
  try {
    let authHeader = req.cookies['SessionID'];
    if (!authHeader) {
      return res.redirect('/login');
    }
    try {
      let verify = await jwt.verify(authHeader, process.env.JWT_SECRET);
      if (verify.role === -1) {
        return res.redirect('/login');
      }
      res.locals.role = verify.role;
      res.locals.userId = verify.userId;
      res.locals.userName = verify.userName;
      next();
    } catch (error) {
      console.log(error);
      return res.redirect('/login');
    }
  } catch (error) {
    return res.render('404.ejs');
  }
};

let authorizationAdmin = (req, res, next) => {
  try {
    let role = res.locals.role;
    if (role !== 1) {
      return res.redirect('/login');
    }
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};

let authorizationCustomer = (req, res, next) => {
  try {
    let role = res.locals.role;
    if (role !== 0) {
      return res.redirect('/login');
    }
    next();
  } catch (error) {
    return res.redirect('/login');
  }
};

module.exports = {
  checkLogged: checkLogged,
  validateAPI: validateAPI,
  authorizationAPIAdmin: authorizationAPIAdmin,
  authorizationAPI: authorizationAPI,
  authorizationAdmin: authorizationAdmin,
  authorizationCustomer: authorizationCustomer,
};
