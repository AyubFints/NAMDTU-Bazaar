const express = require('express');
const router = express.Router();
const {
  getProducts,
  getAdminProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  approveProduct,
  rejectProduct
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

router.route('/admin')
  .get(protect, admin, getAdminProducts);

router.route('/:id')
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

router.route('/:id/approve')
  .put(protect, admin, approveProduct);

router.route('/:id/reject')
  .put(protect, admin, rejectProduct);

module.exports = router;
