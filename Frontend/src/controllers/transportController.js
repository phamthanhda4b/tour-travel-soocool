const transportService = require('../services/transportService');

let handleGetValues = async (req, res) => {
  try {
    let id = req.query.id;
    let result = null;
    if (id === 'ALL') {
      result = await transportService.getAllValues();
    }
    if (!result) {
      return res.status(404).json({
        errMessage: 'Lỗi truyền dữ liệu',
      });
    }
    if (result.errCode !== 0) {
      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      errMessage: 'Lỗi kết nối hệ thống',
    });
  }
};

let handleCreate = async (req, res) => {
  try {
    let data = req.body;
    console.log({ data });
    return res.status(200).json({
      text: 'ok',
    });
    let result = await transportService.postNewValue(data);
    if (result.errCode !== 0) {
      console.log(result);

      return res.status(400).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.log({ error });
    return res.status(500).json({
      error: error,
      errMessage: 'Lỗi kết nối hệ thống',
    });
  }
};

module.exports = {
  handleGetValues: handleGetValues,
  handleCreate: handleCreate,
};
