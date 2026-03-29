const TargetTabungan = require("../models/TargetTabungan");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.createTarget = async (req, res) => {
  try {
    const { namaTarget, nominalTarget, targetBulan } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    const saldoAwal = user?.profil?.saldo_awal || 0;

    const pemasukan = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), tipe: "pemasukan" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const pengeluaran = await Transaction.aggregate([
      { $match: { user: new mongoose.Types.ObjectId(userId), tipe: "pengeluaran" } },
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

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const target = await TargetTabungan.findOne({ _id: id, user: userId });
    if (!target) {
      return res.status(404).json({ message: "Target tidak ditemukan" });
    }

    const user = await User.findById(userId);
    const saldoAwal = user?.profil?.saldo_awal || 0;

    const pemasukan = await Transaction.aggregate([
      { $match: { user: userObjectId, tipe: "pemasukan" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const pengeluaran = await Transaction.aggregate([
      { $match: { user: userObjectId, tipe: "pengeluaran" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } },
    ]);

    const totalPemasukan = pemasukan[0]?.total || 0;
    const totalPengeluaran = pengeluaran[0]?.total || 0;

    const saldo = saldoAwal + totalPemasukan - totalPengeluaran;

    const totalTabungan = await TargetTabungan.aggregate([
      {
        $match: {
          user: userObjectId,
          _id: { $ne: target._id }, 
        },
      },
      { $group: { _id: null, total: { $sum: "$tabunganSekarang" } } },
    ]);

    const usedTabungan = totalTabungan[0]?.total || 0;

    const saldoTersedia = saldo - usedTabungan;

    if (jumlah > saldoTersedia) {
      return res.status(400).json({
        message: `Saldo tidak mencukupi. Sisa saldo Anda: Rp${saldoTersedia.toLocaleString("id-ID")}`,
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

    if (target.tabunganSekarang >= target.nominalTarget) {
      target.status = "tercapai";
    } else {
      target.status =
        target.perBulan > saldoTersedia - jumlah
          ? "tidak realistis"
          : "realistis";
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
