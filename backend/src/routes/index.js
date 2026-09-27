const express = require('express');
const router = express.Router();

// Client Routes
const clientAuthRoutes = require('./client/auth.route');
const clientCoursesRoutes = require('./client/courses.route');
const clientEnrollmentsRoutes = require('./client/enrollments.route');

// Admin Routes
const adminAuthRoutes = require('./admin/auth.route');
const adminCoursesRoutes = require('./admin/courses.route');
const adminEnrollmentsRoutes = require('./admin/enrollments.route');

// Mount Client API endpoints (/api/v1/*)
router.use('/api/v1/auth', clientAuthRoutes);
router.use('/api/v1/courses', clientCoursesRoutes);
router.use('/api/v1/enrollments', clientEnrollmentsRoutes);

// Mount Admin API endpoints (/admin/*)
router.use('/admin/auth', adminAuthRoutes);
router.use('/admin/courses', adminCoursesRoutes);
router.use('/admin/enrollments', adminEnrollmentsRoutes);

module.exports = router;
