const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: StoreApplications
 *   description: Store application and seller management
 */

/**
 * @swagger
 * /api/store-applications/my:
 *   get:
 *     tags: [StoreApplications]
 *     summary: Get current user's applications
 *     responses:
 *       200:
 *         description: List of applications
 *       500:
 *         description: Server error
 */
router.get(['/my', '/store-applications/my'], protect, storeController.getMyApplications);

/**
 * @swagger
 * /api/store-applications:
 *   get:
 *     tags: [StoreApplications]
 *     summary: Get all store applications (admin)
 *     responses:
 *       200:
 *         description: List of applications
 *       500:
 *         description: Server error
 */
router.get(['/', '/store-applications'], protect, admin, storeController.getAllApplications);

/**
 * @swagger
 * /api/store-applications:
 *   post:
 *     tags: [StoreApplications]
 *     summary: Create new store application
 *     responses:
 *       201:
 *         description: Application created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post(['/', '/store-applications'], protect, storeController.createApplication);

/**
 * @swagger
 * /api/store-applications/{id}:
 *   put:
 *     tags: [StoreApplications]
 *     summary: Update application details
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Updated application
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put(['/:id', '/store-applications/:id'], protect, storeController.updateApplication);

/**
 * @swagger
 * /api/store-applications/{id}:
 *   delete:
 *     tags: [StoreApplications]
 *     summary: Delete application
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Application deleted
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.delete(['/:id', '/store-applications/:id'], protect, storeController.deleteApplication);

/**
 * @swagger
 * /api/store-applications/{id}/status:
 *   put:
 *     tags: [StoreApplications]
 *     summary: Update application status (admin)
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Application ID
 *     responses:
 *       200:
 *         description: Status updated
 *       404:
 *         description: Not found
 *       500:
 *         description: Server error
 */
router.put(['/:id/status', '/store-applications/:id/status'], protect, admin, storeController.updateApplicationStatus);

module.exports = router;
