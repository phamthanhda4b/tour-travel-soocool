const db = require('../models/index');

let getAllValues = async () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Transport.findAll({});
      if (!data) {
        return resolve({
          errCode: 2,
          message: 'Không thể lấy dữ liệu',
          data: null,
        });
      }
      return resolve({
        errCode: 0,
        message: 'OK!',
        data: data,
      });
    } catch (error) {
      reject(error);
    }
  });
};

let postNewValue = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.name) {
        return resolve({
          errCode: 1,
          message: 'Yêu cầu nhập tên!',
        });
      }
      await db.Transport.create({
        name: data.name,
      });
      return resolve({
        errCode: 0,
        message: 'Tạo thành công',
      });
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = {
  getAllValues: getAllValues,
  postNewValue: postNewValue,
};
