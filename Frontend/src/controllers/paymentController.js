const paymentService = require('../services/paymentService');
let handleCreateOrder = async (req, res) => {
  try {
    let data = req.body;
    let url = await paymentService.createOrder(data);
    return res.status(200).json({
      message: 'OK',
      url: url,
    });
  } catch (error) {
    console.log('error : ', error);
    return res.status(500).json({
      message: 'Lỗi call api',
    });
  }
};

let handleCompleteOrder = async (req, res) => {
  try {
    await paymentService.capturePayment(req.query.token);
    return res.render('customer/orderTourSuccess');
  } catch (error) {
    return res.redirect('/');
  }
};

module.exports = {
  handleCreateOrder: handleCreateOrder,
  handleCompleteOrder: handleCompleteOrder,
};
