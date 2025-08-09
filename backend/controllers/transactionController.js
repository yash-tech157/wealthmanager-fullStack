const Transaction = require('../models/Transaction');

const getTransactions = async (req, res) => {
  const transactions = await Transaction.find();
  res.json(transactions);
};

const addTransaction = async (req, res) => {
  const { title, amount } = req.body;
  const transaction = new Transaction({ title, amount });
  await transaction.save();
  res.status(201).json(transaction);
};

module.exports = { getTransactions, addTransaction };