const crypto = require('crypto')
const { todo } = require('../models');

'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      user.hasMany(models.todo, {
        foreignKey: 'user_id',
        sourceKey: 'id'})
    }
  };
  user.init({
    email: DataTypes.STRING,
    nickname: DataTypes.STRING,
    full_name: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  user.addHook('afterValidate', (data, options) =>{
    data.password = crypto.createHmac('sha256','4bproject')
    .update(data.password)
    .digest("base64")
    })


  return user;
};