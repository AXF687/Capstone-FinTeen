const Loan = require("../models/Hutang");


// CREATE (hitung cicilan)
exports.createHutang = async (req, res) => {
  try {

    const { totalPinjaman, bungaTahunan, lamaBulan } = req.body;

    const bungaBulanan = bungaTahunan / 12 / 100;

    const cicilanPerBulan =
      (totalPinjaman * bungaBulanan) /
      (1 - Math.pow(1 + bungaBulanan, -lamaBulan));

    const totalBayar = cicilanPerBulan * lamaBulan;

    const loan = await Loan.create({
      user: req.user.id,
      totalPinjaman,
      bungaTahunan,
      lamaBulan,
      cicilanPerBulan,
      totalBayar
    });

    res.status(201).json({
      message: "Perhitungan cicilan berhasil",
      data: loan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET ALL
exports.getHutang = async (req, res) => {
  try {

    const loans = await Loan.find({
      user: req.user.id
    });

    res.status(200).json(loans);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// GET SINGLE
exports.getHutangById = async (req, res) => {
  try {

    const loan = await Loan.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!loan) {
      return res.status(404).json({
        message: "Data tidak ditemukan"
      });
    }

    res.status(200).json(loan);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE
exports.updateHutang = async (req, res) => {
  try {

    const { totalPinjaman, bungaTahunan, lamaBulan } = req.body;

    const bungaBulanan = bungaTahunan / 12 / 100;

    const cicilanPerBulan =
      (totalPinjaman * bungaBulanan) /
      (1 - Math.pow(1 + bungaBulanan, -lamaBulan));

    const totalBayar = cicilanPerBulan * lamaBulan;

    const loan = await Loan.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        totalPinjaman,
        bungaTahunan,
        lamaBulan,
        cicilanPerBulan,
        totalBayar
      },
      { new: true }
    );

    res.status(200).json({
      message: "Perhitungan berhasil diupdate",
      data: loan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// DELETE
exports.deleteHutang = async (req, res) => {
  try {

    await Loan.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    res.status(200).json({
      message: "Data berhasil dihapus"
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};