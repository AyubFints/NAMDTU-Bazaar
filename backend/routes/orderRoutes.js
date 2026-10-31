const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management
 */

/**
 * @swagger
 * /api/orders/my-orders:
 *   post:
 *     tags: [Orders]
 *     summary: Get buyer's orders by list of IDs
 *     responses:
 *       200:
 *         description: List of orders
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post(['/my-orders', '/my', '/orders/my-orders', '/orders/my'], orderController.getMyOrders);

/**
 * @swagger
 * /api/orders/my-sales:
 *   get:
 *     tags: [Orders]
 *     summary: Get seller's sales orders
 *     responses:
 *       200:
 *         description: List of sales orders
 *       500:
 *         description: Server error
 */
router.get(['/my-sales', '/orders/my-sales'], protect, orderController.getMySales);

/**
 * @swagger
 * /api/orders/{id}/cancel:
 *   put:
 *     tags: [Orders]
 *     summary: Cancel order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order cancelled
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put(['/:id/cancel', '/orders/:id/cancel'], orderController.cancelOrder);
router.post(['/:id/cancel', '/orders/:id/cancel'], orderController.cancelOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     tags: [Orders]
 *     summary: Get all orders (admin)
 *     responses:
 *       200:
 *         description: List of orders
 *       500:
 *         description: Server error
 */
router.get(['/', '/orders'], protect, admin, orderController.getOrders);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     tags: [Orders]
 *     summary: Create new order
 *     responses:
 *       201:
 *         description: Order created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post(['/', '/orders'], orderController.createOrder);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     tags: [Orders]
 *     summary: Get order by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order details
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get(['/:id', '/orders/:id'], orderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   put:
 *     tags: [Orders]
 *     summary: Update order status (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order status updated
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put(['/:id/status', '/orders/:id/status'], protect, admin, orderController.updateOrderStatus);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     tags: [Orders]
 *     summary: Delete order by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete(['/:id', '/orders/:id'], protect, admin, orderController.deleteOrder);

module.exports = router;
