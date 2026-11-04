'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourCalendar extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TourCalendar.belongsTo(models.Tour, {
        foreignKey: 'tour_Id',
        as: 'tour',
      });
      TourCalendar.belongsTo(models.Voucher, {
        foreignKey: 'voucher_Id',
        as: 'voucher',
      })
    }
  }
  TourCalendar.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      voucher_Id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tour_Id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slot: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'TourCalendar',
      tableName: 'tour_calendar',
      timestamps: false,
    }
  );
  return TourCalendar;
};
