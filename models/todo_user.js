'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class todo_user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  todo_user.init({
    owner_id: DataTypes.INTEGER,
    todo_id: DataTypes.INTEGER,
    share_id: DataTypes.INTEGER,
    isclear: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'todo_user',
  });
  return todo_user;
};