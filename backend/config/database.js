const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Agar DATABASE_URL berilgan bo'lsa (bulutli server uchun), uni ishlatamiz
const sequelize = process.env.DATABASE_URL 
  ? new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      }
    })
  : new Sequelize(
      process.env.DB_NAME || 'namdtu_shop',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
        logging: false,
      }
    );

module.exports = sequelize;
