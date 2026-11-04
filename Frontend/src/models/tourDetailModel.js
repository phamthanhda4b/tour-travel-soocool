'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TourDetail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      TourDetail.belongsTo(models.Tour, {
        foreignKey: 'tour_id',
        as: 'tours',
      });
    }
  }
  TourDetail.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      file_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sight_seeing: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      cuisine: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      suitable_people: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      time_suiable: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transport: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      sale_description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      tour_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'TourDetail',
      tableName: 'tour_detail',
      timestamps: false,
    }
  );
  return TourDetail;
};
