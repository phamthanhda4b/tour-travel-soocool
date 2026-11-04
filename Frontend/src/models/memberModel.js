'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Member extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Member.belongsTo(models.TourOrder, {
        foreignKey: 'tour_order_id',
        as: 'tourOrder',
      });
    }
  }
  Member.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      bod: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      role: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tour_order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Member',
      tableName: 'member',
      timestamps: false,
    }
  );
  return Member;
};
