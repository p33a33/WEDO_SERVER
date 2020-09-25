'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class todo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      todo.belongsTo(models.user,{
        foreignKey: "user_id",
        targetKey: "id"
      })
    }
  };
  todo.init({
    title: DataTypes.STRING,
    body: DataTypes.TEXT,
    filepath: DataTypes.STRING,
    isclear: {
      type : DataTypes.BOOLEAN,
      defaultValue: 0
    },
    user_id: {
      // allowNull: false,
      type: DataTypes.INTEGER,
    }
  }, {
    sequelize,
    modelName: 'todo',
  });
  return todo;
};