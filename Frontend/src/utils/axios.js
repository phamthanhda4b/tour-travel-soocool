const conFigAxios = require('../config/axiosConfig');
const axios = require('axios');
const instance = axios.create(conFigAxios);
instance.interceptors.response.use((response) => {
  // const { data } = response;
  return response.data;
});
module.exports = instance;
