const Transaction = require("../models/Transaction");

exports.createTransaction = async (req, res) => {
  try {
    const { tipe, nominal, kategori, catatan, tanggal } = req.body;

    if (!tipe || !nominal || !kategori || !tanggal) {
      return res.status(400).json({
        message: "Tanggal, tipe, kategori, dan nominal wajib diisi!!"
      });
    }

    const nominalNumber = Number(nominal);

    if (isNaN(nominalNumber)) {
      return res.status(400).json({
        message: "Nominal harus berupa angka."
      });
    }

    if (nominalNumber <= 0) {
      return res.status(400).json({
        message: "Nominal tidak boleh minus atau nol."
      });
    }

    if (tipe !== "pemasukan" && tipe !== "pengeluaran") {
      return res.status(400).json({
        message: "Tipe transaksi tidak valid."
      });
    }

    const transaction = await Transaction.create({
      user: req.user.id,
      tipe,
      nominal: nominalNumber,
      kategori,
      catatan,
      tanggal
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
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 5, 50);
    const skip = (page - 1) * limit;

    const { bulan, tahun } = req.query;

    let filter = {
      user: req.user.id
    };

    if (bulan && tahun) {
      const startDate = new Date(tahun, bulan - 1, 1);
      const endDate = new Date(tahun, bulan, 1);

      filter.tanggal = {
        $gte: startDate,
        $lt: endDate
      };
    }

    const total = await Transaction.countDocuments(filter);

    const transactions = await Transaction.find(filter)
      .sort({ tanggal: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Daftar transaksi berhasil diambil",
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalData: total,
      transactions
    });

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

    if (!transaction) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan"
      });
    }

    res.status(200).json(transaction);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTransaction = async (req, res) => {
  try {
    const { nominal } = req.body;
   
    if (nominal !== undefined) {
      const nominalNumber = Number(nominal);
      if (isNaN(nominalNumber) || nominalNumber <= 0) {
        return res.status(400).json({ message: "Nominal tidak valid." });
      }
      req.body.nominal = nominalNumber;
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );

    if (!transaction) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan"
      });
    }

    res.status(200).json({
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

    if (!transaction) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan"
      });
    }

    res.status(200).json({
      message: "Transaksi berhasil dihapus"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};