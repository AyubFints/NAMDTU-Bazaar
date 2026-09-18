const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const sequelize = require('./config/database');

// Import models to ensure they are registered with Sequelize
require('./models/User');
require('./models/Product');
require('./models/Order');
require('./models/Category');
require('./models/Banner');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = process.env.PORT || 5000;

// Sync database and start server
sequelize.sync({ alter: true }) // alter: true updates tables to match models
  .then(() => {
    console.log('Connected to PostgreSQL and synchronized models');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));

app.get('/', (req, res) => {
  res.send('NAMDTU Bazaar API is running on PostgreSQL');
});
