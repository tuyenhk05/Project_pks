const express = require('express');
const router = express.Router();
const enrollmentsController = require('../../controllers/client/enrollments.controller');
const { authenticate, requireStudent } = require('../../middlewares/auth.middleware');

router.post('/', authenticate, requireStudent, enrollmentsController.enroll);
router.get('/my-courses', authenticate, requireStudent, enrollmentsController.getMyEnrollments);

module.exports = router;
