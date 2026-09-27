const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/auth.controller');
const { validateBody } = require('../../middlewares/validate.middleware');
const { loginSchema } = require('../../validations/auth.validation');

router.post('/login', validateBody(loginSchema), authController.adminLogin);

module.exports = router;
