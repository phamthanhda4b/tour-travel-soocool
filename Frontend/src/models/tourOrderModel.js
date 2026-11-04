'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TourOrder.hasMany(models.UserTourOrder, {
        foreignKey: 'tour_order_Id',
        as: 'userTourOrder',
      });
      TourOrder.belongsTo(models.Tour, {
        foreignKey: 'tour_id',
        as: 'tour',
      });
      TourOrder.hasMany(models.Member, {
        foreignKey: 'tour_order_id',
        as: 'members',
      });
    }
  }
  TourOrder.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      total_price: {
        type: DataTypes.DOUBLE,
        allowNull: true,
      },
      note: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      order_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      total_member: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tour_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TourOrder',
      tableName: 'tour_order',
      timestamps: false,
    }
  );
  return TourOrder;
};
