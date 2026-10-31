const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /api/products/search:
 *   get:
 *     tags: [Products]
 *     summary: Search products by name, category, or brand
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: Matching products
 *       400:
 *         description: Search query required
 *       500:
 *         description: Server error
 */
router.get(['/search', '/products/search'], productController.searchProducts);

/**
 * @swagger
 * /api/products/my-products:
 *   get:
 *     tags: [Products]
 *     summary: Get products created by logged in user
 *     responses:
 *       200:
 *         description: List of user products
 *       500:
 *         description: Server error
 */
router.get(['/my-products', '/products/my-products'], protect, productController.getMyProducts);

/**
 * @swagger
 * /api/products/admin:
 *   get:
 *     tags: [Products]
 *     summary: Get all products for admin
 *     responses:
 *       200:
 *         description: List of all products
 *       500:
 *         description: Server error
 */
router.get(['/admin', '/products/admin'], protect, admin, productController.getAdminProducts);

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     summary: Get all approved products
 *     responses:
 *       200:
 *         description: List of products
 *       500:
 *         description: Server error
 */
router.get(['/', '/products'], productController.getProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     tags: [Products]
 *     summary: Create a new product
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post(['/', '/products'], protect, productController.createProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     tags: [Products]
 *     summary: Get product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.get(['/:id', '/products/:id'], productController.getProductById);

/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     tags: [Products]
 *     summary: Update product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(['/:id', '/products/:id'], protect, admin, productController.updateProduct);

/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     tags: [Products]
 *     summary: Delete product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.delete(['/:id', '/products/:id'], protect, admin, productController.deleteProduct);

/**
 * @swagger
 * /api/products/{id}/approve:
 *   put:
 *     tags: [Products]
 *     summary: Approve product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product approved
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(['/:id/approve', '/products/:id/approve'], protect, admin, productController.approveProduct);

/**
 * @swagger
 * /api/products/{id}/reject:
 *   put:
 *     tags: [Products]
 *     summary: Reject product
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product rejected
 *       404:
 *         description: Product not found
 *       500:
 *         description: Server error
 */
router.put(['/:id/reject', '/products/:id/reject'], protect, admin, productController.rejectProduct);

module.exports = router;
