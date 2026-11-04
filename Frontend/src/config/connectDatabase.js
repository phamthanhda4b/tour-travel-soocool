require('dotenv').config();
const { Sequelize } = require('sequelize');
const moment = require('moment-timezone');
// Create connect to Database
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DIALECT,
    // dialectOptions: { timezone: '+07:00' },
    dialectOptions: {
      useUTC: false, //for reading from database
      dateStrings: true,
      typeCast: true,
    },
    timezone: '+07:00',
    logging: false,
  }
);
// Test connect to Database
const connectDB = async () => {
  let retries = 0;
  const maxRetries = 30;

  while (retries < maxRetries) {
    try {
      await sequelize.authenticate();
      console.log('Connect Database successfully.');
      return;
    } catch (error) {
      retries += 1;
      console.error(`Unable to connect to the database (attempt ${retries}/${maxRetries}):`, error.message);
      if (retries >= maxRetries) {
        console.error('Database connection failed after retries.');
        return;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
};
module.exports = connectDB;
