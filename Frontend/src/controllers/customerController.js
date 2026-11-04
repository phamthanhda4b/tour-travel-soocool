const axios = require('../utils/axios.js');
const moment = require('moment');

let orderPage = async (req, res) => {
  try {
    let tourId = req.query.tourId;
    let date = req.query.dateId;
    if (!tourId || !date) {
      return res.render('404.ejs');
    }
    let dataTour;
    try {
      dataTour = await axios.get(
        `http://localhost:3124/api/v1/tours/${tourId}?dateId=${date}`
      );
      let myMoment = moment(dataTour.data.tourCalendars[0].start_date);
      dataTour.data.tourCalendars[0].start_date_format =
        myMoment.format('YYYY-MM-DD');
      if (!dataTour.data.tourCalendars[0].voucher) {
        let option = {
          value: 0,
          type: 1,
        };
        dataTour.data.tourCalendars[0].voucher = option;
      }
    } catch (error) {
      console.log(error);
    }
    return res.render('customer/orderTour.ejs', {
      tour: dataTour.data,
      calendars: dataTour.data.tourCalendars[0],
    });
  } catch (error) {
    console.log(error);
    return res.redirect('/');
  }
};

let editInfoPage = async (req, res) => {
  try {
    let userId = req.params.id;
    let cookies = req.headers.cookie;
    try {
      let dataUser = await axios.get(
        `http://localhost:3124/api/v1/users/${userId}`,
        {
          headers: {
            Cookie: cookies, // Gắn cookie vào trong headers
          },
          withCredentials: true, // Gắn thông tin xác thực
        }
      );
      return res.render('customer/editInfoCustomer.ejs', {
        user: dataUser.data,
      });
    } catch (error) {
      console.log(error);
      return res.redirect('/');
    }
  } catch (error) {
    console.log(error);
    return res.redirect('/');
  }
};
const userService = require('../services/userService');

let myOrdersPage = async (req, res) => {
  try {
    let currentUserId = res.locals.userId;
    if (!currentUserId && req.cookies && req.cookies['SessionID']) {
      try {
        const jwt = require('jsonwebtoken');
        let decoded = jwt.verify(req.cookies['SessionID'], process.env.JWT_SECRET);
        currentUserId = decoded.userId;
      } catch (e) {
        console.log('Token decode error in myOrdersPage:', e.message);
      }
    }

    if (!currentUserId) {
      return res.redirect('/login');
    }

    let result = await userService.getOrdersByUserId(currentUserId);
    return res.render('customer/myOrders.ejs', {
      orders: (result && result.data) || [],
      userId: currentUserId,
      moment: moment,
    });
  } catch (error) {
    console.log('Error myOrdersPage:', error);
    return res.render('customer/myOrders.ejs', {
      orders: [],
      userId: res.locals.userId || null,
      moment: moment,
    });
  }
};

let handleCancelOrder = async (req, res) => {
  try {
    let currentUserId = res.locals.userId;
    let orderId = req.params.orderId;
    if (!currentUserId || !orderId) {
      return res.status(400).json({ errCode: 1, message: 'Dữ liệu không hợp lệ' });
    }

    let result = await userService.cancelUserOrder(currentUserId, orderId);
    return res.status(200).json({
      errCode: result.status,
      message: result.message,
    });
  } catch (error) {
    console.log('Error handleCancelOrder:', error);
    return res.status(500).json({ errCode: 3, message: 'Lỗi máy chủ' });
  }
};

module.exports = {
  orderPage: orderPage,
  editInfoPage: editInfoPage,
  myOrdersPage: myOrdersPage,
  handleCancelOrder: handleCancelOrder,
};
