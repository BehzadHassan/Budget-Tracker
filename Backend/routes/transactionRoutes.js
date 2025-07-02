const express = require('express');
const router = express.Router();
const {
    getTransactions,
    addTransaction,
    deleteTransaction,
    updateTransaction  // ✅ add this
} = require('../controllers/transactionController');

const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware); // protect all routes below

router.get('/', getTransactions);
router.post('/', addTransaction);
router.delete('/:id', deleteTransaction);
router.put('/:id', updateTransaction);  // ✅ add PUT route


module.exports = router;
