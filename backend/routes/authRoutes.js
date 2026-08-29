const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { userSchema } = require('../validators/schemas');
const { loginLimiter, registerLimiter } = require('../middleware/rateLimiter');

router.post('/register', registerLimiter, validateRequest(userSchema), authController.register);
router.post('/login', loginLimiter, validateRequest(userSchema), authController.login);
router.get('/user/:userId', authMiddleware, authController.getUser);
router.put('/user/:userId', authMiddleware, authController.updateUser);

module.exports = router;
