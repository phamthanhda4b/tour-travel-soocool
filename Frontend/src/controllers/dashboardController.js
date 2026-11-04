const axios = require('../utils/axios.js');
let getDashBoard = async (req, res) => {
  let cookies = req.headers.cookie;
  let axiosConfig = {
    headers: {
      Cookie: cookies, // Gắn cookie vào trong headers
    },
    withCredentials: true, // Gắn thông tin xác thực
  };
  const revenue = await axios.get(
    `http://localhost:8080/api/v1/Revenue/MONTH`
  );
  const topTour = await axios.get(
    `http://localhost:8080/api/v1/TopTour?type=MONTH`
  );
  
  const totalAccountCustomer = await axios.get(
    `http://localhost:8080/api/User/TotalUsers`
  );
  const totalTourOrder = await axios.get(
    `http://localhost:8080/api/v1/TourOrders/TourOrdersByType/MONTH`
  );
  const topCustomer = await axios.get(
    `http://localhost:3124/api/v1/users-top?month=3`,
    axiosConfig
  );

  let data = {
    revenue: revenue,
    topTour: topTour,
    totalAccountCustomer: totalAccountCustomer,
    totalTourOrder: totalTourOrder,
    topCustomer: topCustomer.data,
  };
  return res.render('admin/dashboard.ejs', { data: data });
};
module.exports = { getDashBoard: getDashBoard };
