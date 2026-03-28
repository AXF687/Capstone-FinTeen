const TargetTabungan = require("../models/TargetTabungan");
const Transaction = require("../models/Transaction");
const User = require("../models/User");

exports.createTarget = async (req, res) => {
  try {
    const { namaTarget, nominalTarget, targetBulan } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const saldoAwal = user?.profil?.saldo_awal || 0;

    const pemasukan = await Transaction.aggregate([
      { $match: { user: userId, tipe: "pemasukan" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const pengeluaran = await Transaction.aggregate([
      { $match: { user: userId, tipe: "pengeluaran" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const totalPemasukan = pemasukan[0]?.total || 0;
    const totalPengeluaran = pengeluaran[0]?.total || 0;

    const saldo = saldoAwal + totalPemasukan - totalPengeluaran;
    const perBulan = nominalTarget / targetBulan;
    let status = "realistis";

    if (perBulan > saldo) {
      status = "tidak realistis";
    }

    const target = await TargetTabungan.create({
      user: userId,
      namaTarget,
      nominalTarget,
      targetBulan,
      tabunganSekarang: 0,
      perBulan,
      status,
    });

    res.status(201).json(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTargets = async (req, res) => {
  try {
    const targets = await TargetTabungan.find({ user: req.user.id });
    res.status(200).json(targets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getTargetById = async (req, res) => {
  try {
    const target = await TargetTabungan.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!target) {
      return res.status(404).json({ message: "Target tidak ditemukan" });
    }
    res.status(200).json(target);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTarget = async (req, res) => {
  try {
    const target = await TargetTabungan.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true },
    );

    if (!target) {
      return res.status(404).json({ message: "Target tidak ditemukan" });
    }

    res.status(200).json({ message: "Target berhasil diupdate", target });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteTarget = async (req, res) => {
  try {
    const target = await TargetTabungan.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!target) {
      return res.status(404).json({ message: "Target tidak ditemukan" });
    }

    res.status(200).json({ message: "Target berhasil dihapus" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.topupTarget = async (req, res) => {
  try {
    const { id } = req.params;
    const { jumlah } = req.body;
    const userId = req.user.id;

    if (!jumlah || jumlah <= 0) {
      return res.status(400).json({ message: "Jumlah harus lebih dari 0" });
    }

    const target = await TargetTabungan.findOne({ _id: id, user: userId });

    if (!target) {
      return res.status(404).json({ message: "Target tidak ditemukan" });
    }

    const userModel = await User.findById(userId);
    const saldoAwal = userModel?.profil?.saldo_awal || 0;

    const pemasukan = await Transaction.aggregate([
      { $match: { user: userId, tipe: "pemasukan" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const pengeluaran = await Transaction.aggregate([
      { $match: { user: userId, tipe: "pengeluaran" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const totalPemasukan = pemasukan[0]?.total || 0;
    const totalPengeluaran = pengeluaran[0]?.total || 0;

    const saldo = saldoAwal + totalPemasukan - totalPengeluaran;

    if (jumlah > saldo) {
      return res.status(400).json({
        message: `Saldo tidak mencukupi. Saldo Anda saat ini: Rp${saldo.toLocaleString("id-ID")}`,
      });
    }

    target.tabunganSekarang += jumlah;

    const transaction = await Transaction.create({
      user: userId,
      tipe: "pengeluaran",
      nominal: jumlah,
      kategori: "Tabungan",
      catatan: `Menabung untuk target: ${target.namaTarget}`,
      tanggal: new Date(),
    });

    const pemasukanBaru = await Transaction.aggregate([
      { $match: { user: userId, tipe: "pemasukan" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const pengeluaranBaru = await Transaction.aggregate([
      { $match: { user: userId, tipe: "pengeluaran" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const totalPemasukanBaru = pemasukanBaru[0]?.total || 0;
    const totalPengeluaranBaru = pengeluaranBaru[0]?.total || 0;

    const saldoBaru = saldoAwal + totalPemasukanBaru - totalPengeluaranBaru;

    if (target.tabunganSekarang >= target.nominalTarget) {
      target.status = "tercapai";
    } else {
      target.status =
        target.perBulan > saldoBaru ? "tidak realistis" : "realistis";
    }

    await target.save();

    res.status(200).json({
      message: "Tabungan berhasil ditambahkan",
      target,
      transaction,
    });
  } catch (error) {
    console.error("Error in topupTarget:", error);
    res.status(500).json({ message: error.message });
  }
};
