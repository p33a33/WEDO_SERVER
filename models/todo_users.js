'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class todo_users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  todo_users.init({
    isclear: {
      type: DataTypes.BOOLEAN,
      
      defaultValue: 0
    }
  }, {
    sequelize,
    modelName: 'todo_users',
  });
  return todo_users;
};