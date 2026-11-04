require('dotenv').config();
const db = require('../models/index');
const jwt = require('jsonwebtoken');

const handleLogin = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: {
          id: userId,
        },
        attributes: ['id', 'user_name', 'role'],
      });
      //   Kiểm tra user có tồn tại hay không
      if (!user) {
        return resolve({
          status: 2,
          message: 'Không tồn tại người dùng',
        });
      }
      // Sinh token
      let token = await jwt.sign(
        {
          userId: user.id,
          userName: user.user_name,
          role: user.role,
        },
        process.env.JWT_SECRET,
        {
          algorithm: process.env.JWT_ALGORITHM,
          expiresIn: process.env.JWT_EXPIRES_IN,
        }
      );
      return resolve({
        status: 0,
        access_token: token,
      });
    } catch (error) {
      return reject(error);
    }
  });
};

module.exports = {
  handleLogin: handleLogin,
};
