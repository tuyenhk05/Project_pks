const express = require('express');
const router = express.Router();
const enrollmentsController = require('../../controllers/admin/enrollments.controller');
const { authenticate, requireAdmin } = require('../../middlewares/auth.middleware');

// Protect all admin enrollment endpoints
router.use(authenticate, requireAdmin);

router.get('/', enrollmentsController.getEnrollments);
router.get('/course/:courseId', enrollmentsController.getEnrollmentsByCourse);

module.exports = router;
