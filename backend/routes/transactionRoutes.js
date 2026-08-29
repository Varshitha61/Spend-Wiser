const express = require('express');
const router = express.Router();
const transactionController = require('../controllers/transactionController');
const authMiddleware = require('../middleware/auth');
const validateRequest = require('../middleware/validate');
const { transactionSchema } = require('../validators/schemas');

router.get('/', authMiddleware, transactionController.getTransactions);
router.post('/', authMiddleware, validateRequest(transactionSchema), transactionController.createTransaction);
router.put('/:id', authMiddleware, transactionController.updateTransaction);
router.delete('/:id', authMiddleware, transactionController.deleteTransaction);
router.get('/download', transactionController.downloadTransactions);

// The clear endpoint was separated in server.js but makes sense under transactions or data
router.delete('/data/clear', transactionController.clearAllTransactions);

module.exports = router;
