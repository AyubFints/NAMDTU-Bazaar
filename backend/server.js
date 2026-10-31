const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
const { sequelize } = require('./models');

dotenv.config();

const app = express();

app.use(cors());
// Allow up to 50MB for high-resolution banner and product images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const PORT = process.env.PORT || 5000;

// Swagger UI Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use('/api', require('./routes/userRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/store-applications', require('./routes/storeRoutes'));

app.get('/', (req, res) => {
  res.send({
    message: 'NAMDTU Bazaar API is running on Local PostgreSQL',
    swaggerDocs: `http://localhost:${PORT}/api-docs`
  });
});

// Sync database and start server
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Connected to Local PostgreSQL and synchronized models successfully.');
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err.message);
  });
