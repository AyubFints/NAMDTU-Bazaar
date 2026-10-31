const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: Category management
 */

/**
 * @swagger
 * /api/categories/search:
 *   get:
 *     tags: [Categories]
 *     summary: Search categories by name
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: Matching categories
 *       400:
 *         description: Query required
 *       500:
 *         description: Server error
 */
router.get(['/search', '/categories/search'], categoryController.searchCategories);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     tags: [Categories]
 *     summary: Get all categories
 *     responses:
 *       200:
 *         description: List of categories
 *       500:
 *         description: Server error
 */
router.get(['/', '/categories'], categoryController.getCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   get:
 *     tags: [Categories]
 *     summary: Get category by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category details
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.get(['/:id', '/categories/:id'], categoryController.getCategoryById);

/**
 * @swagger
 * /api/categories:
 *   post:
 *     tags: [Categories]
 *     summary: Create a new category (admin)
 *     responses:
 *       201:
 *         description: Category created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post(['/', '/categories'], protect, admin, categoryController.createCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     tags: [Categories]
 *     summary: Update category by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.put(['/:id', '/categories/:id'], protect, admin, categoryController.updateCategory);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     tags: [Categories]
 *     summary: Delete category by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Category ID
 *     responses:
 *       200:
 *         description: Category deleted
 *       404:
 *         description: Category not found
 *       500:
 *         description: Server error
 */
router.delete(['/:id', '/categories/:id'], protect, admin, categoryController.deleteCategory);

module.exports = router;
