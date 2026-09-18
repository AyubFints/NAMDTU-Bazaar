const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createOrder)
  .get(protect, getOrders); // Getting all orders requires user to be logged in (can be filtered on frontend, or we can filter in backend later)

router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id')
  .delete(protect, admin, deleteOrder);

module.exports = router;
