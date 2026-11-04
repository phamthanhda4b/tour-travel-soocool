'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Voucher extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Voucher.hasMany(models.TourCalendar, {
        foreignKey: 'voucher_Id',
        as: 'calendars'
      })
    }
  }
  Voucher.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      voucher_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      value: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      type: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Voucher',
      tableName: 'voucher',
      timestamps: false,
    }
  );
  return Voucher;
};
