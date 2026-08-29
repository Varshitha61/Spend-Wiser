const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { bankDetailsSchema } = require('../validators/schemas');

router.get('/:userId', authMiddleware, bankController.getBankDetails);
router.post('/', authMiddleware, validateRequest(bankDetailsSchema), bankController.updateBankDetails);
router.delete('/:userId', authMiddleware, bankController.deleteBankDetails);

module.exports = router;
