const TargetTabugan = require("../models/TargetTabungan");
const Transaction = require("../models/Transaction");


// CREATE TARGET
exports.createTarget = async (req, res) => {
  try {

    const { namaTarget, nominalTarget, targetBulan } = req.body;

    const pemasukan = await Transaction.aggregate([
      { $match: { user: req.user.id, tipe: "pemasukan" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);

    const pengeluaran = await Transaction.aggregate([
      { $match: { user: req.user.id, tipe: "pengeluaran" } },
      { $group: { _id: null, total: { $sum: "$nominal" } } }
    ]);

    const totalPemasukan = pemasukan[0]?.total || 0;
    const totalPengeluaran = pengeluaran[0]?.total || 0;

    const saldo = totalPemasukan - totalPengeluaran;

    const perBulan = nominalTarget / targetBulan;

    let status = "realistis";

    if (perBulan > saldo) {
      status = "tidak realistis";
    }

    const target = await TargetTabugan.create({
      user: req.user.id,
      namaTarget,
      nominalTarget,
      targetBulan,
      tabunganSekarang: saldo,
      perBulan,
      status
    });

    res.status(201).json(target);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL TARGET
exports.getTargets = async (req, res) => {
  try {

    const targets = await TargetTabugan.find({
      user: req.user.id
    });

    res.status(200).json(targets);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET SINGLE TARGET
exports.getTargetById = async (req, res) => {
  try {

    const target = await TargetTabugan.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!target) {
      return res.status(404).json({
        message: "Target tidak ditemukan"
      });
    }

    res.status(200).json(target);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE TARGET
exports.updateTarget = async (req, res) => {
  try {

    const target = await TargetTabugan.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      req.body,
      { new: true }
    );

    if (!target) {
      return res.status(404).json({
        message: "Target tidak ditemukan"
      });
    }

    res.status(200).json({
      message: "Target berhasil diupdate",
      target
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE TARGET
exports.deleteTarget = async (req, res) => {
  try {

    const target = await TargetTabugan.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!target) {
      return res.status(404).json({
        message: "Target tidak ditemukan"
      });
    }

    res.status(200).json({
      message: "Target berhasil dihapus"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};