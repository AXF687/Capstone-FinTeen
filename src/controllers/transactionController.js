const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { type, amount, category, note, date } = req.body;

    const transaction = await Transaction.create({
      user: req.user.id,
      type,
      amount,
      category,
      note,
      date
    });

    res.status(201).json({
      message: "Transaksi berhasil dibuat",
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 });

    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSingleTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    res.json(transaction);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    res.json({
      message: "Transaksi berhasil diupdate",
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!transaction)
      return res.status(404).json({ message: "Transaksi tidak ditemukan" });

    res.json({ message: "Transaksi berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};