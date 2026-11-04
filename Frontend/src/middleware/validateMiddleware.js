let validateDataUser = (req, res, next) => {
  try {
    let userId = req.params.id;
    // Kiểm tra có gửi id user hay không
    if (!userId) {
      return res.status(400).json({
        errCode: 2,
        message: 'Đầu vào dữ liệu không hợp lệ',
      });
    }
    let data = req.body;
    // Kiểm tra có dữ liệu gửi hay không
    if (!data.name || !data.email || !data.address || !data.phoneNumber) {
      return res.status(400).json({
        errCode: 2,
        message: 'Không có đầu vào dữ liệu',
      });
    }
    res.locals.data = data;
    res.locals.userId = userId;
    return next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errCode: 3,
      message: 'Error from server',
    });
  }
};

module.exports = {
  validateDataUser: validateDataUser,
};
