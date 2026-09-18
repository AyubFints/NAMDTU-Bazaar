const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('Order', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  buyerName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  buyerPhone: {
    type: DataTypes.STRING,
    allowNull: false
  },
  items: {
    type: DataTypes.JSON, // Arrays of objects can be stored as JSON in Postgres
    allowNull: false
  },
  totalAmount: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('Yangi', 'Yetkazilmoqda', 'Sotildi', 'Bekor qilingan'),
    defaultValue: 'Yangi'
  },
  address: {
    type: DataTypes.STRING,
    allowNull: false
  },
  comment: {
    type: DataTypes.TEXT
  }
}, {
  timestamps: true,
  tableName: 'orders'
});

module.exports = Order;
