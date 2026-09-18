const express = require('express');
const router = express.Router();
const {
  createOrder,
  getOrders,
  getMyOrders,
  cancelOrder,
  updateOrderStatus,
  deleteOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(createOrder) // Guest can create order
  .get(protect, admin, getOrders); // Only admin can get all orders

router.route('/my')
  .post(getMyOrders);

router.route('/:id/cancel')
  .post(cancelOrder);
router.route('/:id/status')
  .put(protect, admin, updateOrderStatus);

router.route('/:id')
  .delete(protect, admin, deleteOrder);

module.exports = router;
