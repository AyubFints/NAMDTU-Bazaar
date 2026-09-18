const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Banner = sequelize.define('Banner', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  image: {
    type: DataTypes.TEXT, // Banners might have long data URIs
    allowNull: false
  },
  title: {
    type: DataTypes.STRING
  },
  subtitle: {
    type: DataTypes.STRING
  }
}, {
  timestamps: true,
  tableName: 'banners'
});

module.exports = Banner;
