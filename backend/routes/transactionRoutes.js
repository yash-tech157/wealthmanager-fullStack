const express = require('express');
const { getTransactions, addTransaction } = require('../controllers/transactionController');
const router = express.Router();

router.get('/', getTransactions);
router.post('/', addTransaction);

module.exports = router;