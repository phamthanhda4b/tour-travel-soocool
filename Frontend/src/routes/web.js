const express = require('express');
const router = express.Router();
const adminController = require('../controllers/dashboardController');
const axios = require('../utils/axios.js');
const authMiddleware = require('../middleware/authMiddleware');
const customerController = require('../controllers/customerController.js');
const paymentController = require('../controllers/paymentController.js');
const slideController = require('../controllers/slideController.js');
const slideService = require('../services/slideService.js');

const initWebRouters = (app) => {
  // Trang chủ
  router.get('/', async (req, res) => {
    try {
      const slidesResult = await slideService.getActiveSlides();
      return res.render('customer/home.ejs', {
        slides: slidesResult.data || [],
      });
    } catch (e) {
      return res.render('customer/home.ejs', { slides: [] });
    }
  });
  // Dashboard
  router.get(
    '/Dashboard',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    adminController.getDashBoard
  );
  // Quản lí voucher
  router.get(
    '/voucher',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      return res.render('admin/voucher.ejs');
    }
  );
  router.get(
    '/voucher/add',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      return res.render('admin/voucherAdd.ejs');
    }
  );
  router.get(
    '/voucher/modify/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      const voucherId = req.params.id;
      return res.render('admin/voucherModify.ejs', { voucherId });
    }
  );
  // Quản lí tour
  router.get(
    '/tour/add',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      return res.render('admin/tourAdd.ejs');
    }
  );
  router.get(
    '/tour/modify/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      const tourId = req.params.id;
      return res.render('admin/tourModify.ejs', { tourId });
    }
  );
  router.get(
    '/tour',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      return res.render('admin/tour.ejs');
    }
  );
  // Quản lí lịch tour
  router.get(
    '/calendar/add/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      const tourId = req.params.id;
      return res.render('admin/calendarAdd.ejs', { tourId });
    }
  );
  router.get(
    '/calendar/modify/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      const calendarId = req.params.id;
      return res.render('admin/calendarModify.ejs', { calendarId });
    }
  );
  router.get(
    '/tour/calendar/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      const tourId = req.params.id;
      return res.render('admin/tourCalendar.ejs', { tourId });
    }
  );
  router.get(
    '/tour/detail/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      const tourId = req.params.id;
      return res.render('admin/tourDetail.ejs', { tourId });
    }
  );
  // Quản lí tài khoản
  router.get(
    '/customer',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      return res.render('admin/customer.ejs');
    }
  );
  // Đặt tour
  router.get(
    '/order-tour',
    authMiddleware.checkLogged,
    authMiddleware.authorizationCustomer,
    customerController.orderPage
  );
  // trang chi tiết đặt tour
  router.get('/detail/:id', async (req, res) => {
    return res.render('customer/detail.ejs');
  });

  // Đăng nhập
  router.get('/login', (req, res) => {
    return res.render('customer/login.ejs');
  });

  // Đăng ký
  router.get('/register', (req, res) => {
    return res.render('customer/register.ejs');
  });

  // Thay đổi mật khẩu
  router.get('/change-password', async (req, res) => {
    const token = req.query.token;
    if (!token) {
      return res.status(400).send('Token is missing!');
    }

    try {
      // Gửi yêu cầu kiểm tra token
      const response = await axios.get(
        `http://localhost:8080/api/User/changePassword?token=${token}`
      );
      // Kiểm tra thông báo từ API
      if (response.message.trim().length > 0) {
        // Token hợp lệ, render trang thay đổi mật khẩu
        return res.render('customer/change-password.ejs', { token });
      } else {
        // Token không hợp lệ, hiển thị lỗi
        return res.status(403).send('Token không hợp lệ!');
      }
    } catch (error) {
      console.error('Error validating token:', error);
      return res
        .status(500)
        .send('Đã xảy ra lỗi trong quá trình xác thực token');
    }
  });

  // Quản lí order
  router.get(
    '/admin-order',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      return res.render('admin/order.ejs');
    }
  );
  router.get(
    '/admin-order/user/:userId/order/:orderID',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => {
      const userId = req.params.userId;
      const orderId = req.params.orderID;
      return res.render('admin/orderAdminDetail.ejs', { userId, orderId });
    }
  );

  // Đặt tour thành công
  router.get(
    '/complete-order',
    authMiddleware.checkLogged,
    paymentController.handleCompleteOrder
  );

  // Hủy thanh toán đặt tour
  router.get('/cancel-order', authMiddleware.checkLogged, (req, res) => {
    res.redirect('/');
  });

  // Chỉnh sửa thông tin tài khoản khách hàng
  router.get(
    '/customer/edit/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationCustomer,
    customerController.editInfoPage
  );

  // Xem danh sách tour đã đặt của khách hàng
  router.get(
    '/customer/orders',
    authMiddleware.checkLogged,
    authMiddleware.authorizationCustomer,
    customerController.myOrdersPage
  );
  router.get(
    '/my-orders',
    authMiddleware.checkLogged,
    customerController.myOrdersPage
  );

  // Quản lý Banner / Slide
  router.get(
    '/admin/slides',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    slideController.slidePage
  );
  router.get(
    '/slide',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    (req, res) => res.redirect('/admin/slides')
  );
  router.get(
    '/admin/slides/add',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    slideController.slideAddPage
  );
  router.get(
    '/admin/slides/modify/:id',
    authMiddleware.checkLogged,
    authMiddleware.authorizationAdmin,
    slideController.slideModifyPage
  );

  return app.use('/', router);
};

module.exports = initWebRouters;
