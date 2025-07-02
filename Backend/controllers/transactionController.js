const Transaction = require('../models/Transaction');

// Get all transactions for a user
exports.getTransactions = async (req, res) => {
    const userId = req.userId;
    const transactions = await Transaction.find({ userId }).sort({ date: -1 });
    res.json(transactions);
};

// Add a new transaction
exports.addTransaction = async (req, res) => {
    const { title, type, category, amount, date } = req.body;
    const userId = req.userId;

    const transaction = new Transaction({ userId, title, type, category, amount, date });
    await transaction.save();

    res.status(201).json({ message: 'Transaction added', transaction });
};

// Delete a transaction
exports.deleteTransaction = async (req, res) => {
    const tx = await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted', tx });
};

// Update transaction
exports.updateTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });

        if (!updatedTransaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }

        res.status(200).json({ message: 'Transaction updated', transaction: updatedTransaction });
    } catch (error) {
        console.error('Error updating transaction:', error);
        res.status(500).json({ message: 'Failed to update transaction' });
    }
};
