const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");

/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: Customer management
 */

/**
 * @swagger
 * /api/customers:
 *   post:
 *     tags: [Customers]
 *     summary: Create a new customer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               phone:
 *                 type: string
 *               email:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Customer created
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Server error
 */
router.post("/", customerController.createCustomer);

/**
 * @swagger
 * /api/customers/search:
 *   get:
 *     tags: [Customers]
 *     summary: Search customers by name, email, or phone
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         required: true
 *         description: Search query
 *     responses:
 *       200:
 *         description: Search results
 *       400:
 *         description: Query required
 *       500:
 *         description: Server error
 */
router.get("/search", customerController.searchCustomers);

/**
 * @swagger
 * /api/customers:
 *   get:
 *     tags: [Customers]
 *     summary: Get all customers
 *     responses:
 *       200:
 *         description: List of customers
 *       500:
 *         description: Server error
 */
router.get("/", customerController.getCustomers);

/**
 * @swagger
 * /api/customers/{id}:
 *   get:
 *     tags: [Customers]
 *     summary: Get customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.get("/:id", customerController.getCustomerById);

/**
 * @swagger
 * /api/customers/{id}:
 *   put:
 *     tags: [Customers]
 *     summary: Update customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.put("/:id", customerController.updateCustomer);

/**
 * @swagger
 * /api/customers/{id}:
 *   delete:
 *     tags: [Customers]
 *     summary: Delete customer by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: integer
 *         required: true
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", customerController.deleteCustomer);

module.exports = router;
