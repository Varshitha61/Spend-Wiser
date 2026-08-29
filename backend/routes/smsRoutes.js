const express = require('express');
const router = express.Router();
const smsController = require('../controllers/smsController');
const { smsLimiter } = require('../middleware/rateLimiter');
const validateRequest = require('../middleware/validate');
const { smsSchema } = require('../validators/schemas');

router.post('/webhook', smsLimiter, validateRequest(smsSchema), smsController.receiveWebhook);

module.exports = router;
