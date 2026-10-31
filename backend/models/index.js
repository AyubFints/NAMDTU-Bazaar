const sequelize = require('../config/database');
const { Sequelize } = require('sequelize');

const User = require('./User');
const Customer = require('./Customer');
const Product = require('./Product');
const Order = require('./Order');
const Category = require('./Category');
const Banner = require('./Banner');
const StoreApplication = require('./StoreApplication');

// Associations
User.belongsTo(Customer, {
  foreignKey: 'customer_id',
  as: 'customer'
});

Customer.hasMany(User, {
  foreignKey: 'customer_id',
  as: 'users'
});

module.exports = {
  sequelize,
  Sequelize,
  User,
  Customer,
  Product,
  Order,
  Category,
  Banner,
  StoreApplication
};
