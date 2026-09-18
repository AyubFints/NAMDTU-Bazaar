const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  price: {
    type: DataTypes.STRING,
    allowNull: false
  },
  oldPrice: {
    type: DataTypes.STRING
  },
  category: {
    type: DataTypes.STRING,
    allowNull: false
  },
  images: {
    type: DataTypes.JSON, // Arrays of strings can be stored as JSON in Postgres
    defaultValue: []
  },
  description: {
    type: DataTypes.TEXT
  },
  stock: {
    type: DataTypes.STRING
  },
  badge: {
    type: DataTypes.STRING
  },
  brand: {
    type: DataTypes.STRING
  },
  sizes: {
    type: DataTypes.JSON,
    defaultValue: []
  },
  creatorPhone: {
    type: DataTypes.STRING
  },
  creatorName: {
    type: DataTypes.STRING
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  timestamps: true,
  tableName: 'products'
});

module.exports = Product;
