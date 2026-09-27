const express = require('express');
const router = express.Router();
const coursesController = require('../../controllers/admin/courses.controller');
const { validateBody } = require('../../middlewares/validate.middleware');
const { createCourseSchema, updateCourseSchema } = require('../../validations/course.validation');
const { authenticate, requireAdmin } = require('../../middlewares/auth.middleware');

// Protect all admin course endpoints
router.use(authenticate, requireAdmin);

router.get('/', coursesController.getCourses);
router.get('/:id', coursesController.getCourseById);
router.post('/', validateBody(createCourseSchema), coursesController.createCourse);
router.put('/:id', validateBody(updateCourseSchema), coursesController.updateCourse);
router.delete('/:id', coursesController.deleteCourse);

module.exports = router;
