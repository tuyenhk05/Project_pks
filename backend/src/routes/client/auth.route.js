const express = require('express');
const router = express.Router();
const authController = require('../../controllers/client/auth.controller');
const { validateBody } = require('../../middlewares/validate.middleware');
const { registerSchema, loginSchema } = require('../../validations/auth.validation');
const { authenticate } = require('../../middlewares/auth.middleware');

router.post('/register', validateBody(registerSchema), authController.register);
router.post('/login', validateBody(loginSchema), authController.login);
router.get('/me', authenticate, authController.getMe);
router.post('/logout', authenticate, authController.logout);

module.exports = router;
