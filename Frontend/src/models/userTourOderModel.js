'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserTourOrder extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserTourOrder.belongsTo(models.TourOrder, {
        foreignKey: 'tour_order_Id',
        as: 'tourOrder',
      });
      UserTourOrder.belongsTo(models.User, {
        foreignKey: 'user_Id',
        as: 'user',
      });
    }
  }
  UserTourOrder.init(
    {
      user_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      tour_order_Id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      status: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      tour_start_date: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'UserTourOrder',
      tableName: 'user_tour_order',
      timestamps: false,
    }
  );
  return UserTourOrder;
};
