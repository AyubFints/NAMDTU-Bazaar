const express = require('express');
const router = express.Router();
const {
  createApplication,
  getMyApplications,
  getAllApplications,
  updateApplication,
  deleteApplication,
  updateApplicationStatus
} = require('../controllers/storeController');
const { protect, admin } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createApplication)
  .get(protect, admin, getAllApplications);

router.get('/my-applications', protect, getMyApplications);

router.route('/:id')
  .put(protect, updateApplication)
  .delete(protect, deleteApplication);

router.put('/:id/status', protect, admin, updateApplicationStatus);

module.exports = router;
