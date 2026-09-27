const express = require('express');
const router = express.Router();
const coursesController = require('../../controllers/client/courses.controller');

router.get('/', coursesController.getCourses);
router.get('/:id', coursesController.getCourseById);

module.exports = router;
