const express = require('express');
const router = express.Router();
const bannerController = require('../controllers/bannerController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Banners
 *   description: Promotional banner management
 */

/**
 * @swagger
 * /api/banners:
 *   get:
 *     tags: [Banners]
 *     summary: Get all banners
 *     responses:
 *       200:
 *         description: List of banners
 *       500:
 *         description: Server error
 */
router.get('/', bannerController.getBanners);

/**
 * @swagger
 * /api/banners/{id}:
 *   get:
 *     tags: [Banners]
 *     summary: Get banner by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner details
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.get('/:id', bannerController.getBannerById);

/**
 * @swagger
 * /api/banners:
 *   post:
 *     tags: [Banners]
 *     summary: Create new banner (admin)
 *     responses:
 *       201:
 *         description: Banner created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post('/', protect, admin, bannerController.createBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   put:
 *     tags: [Banners]
 *     summary: Update banner by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.put('/:id', protect, admin, bannerController.updateBanner);

/**
 * @swagger
 * /api/banners/{id}:
 *   delete:
 *     tags: [Banners]
 *     summary: Delete banner by ID (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Banner ID
 *     responses:
 *       200:
 *         description: Banner deleted
 *       404:
 *         description: Banner not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', protect, admin, bannerController.deleteBanner);

module.exports = router;
