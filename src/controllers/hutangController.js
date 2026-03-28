const Loan = require("../models/Hutang");

exports.createHutang = async (req, res) => {
  try {
    const { totalPinjaman, bungaTahunan, lamaBulan, tempatHutang } = req.body;

    if (!lamaBulan || lamaBulan <= 0) {
      return res.status(400).json({ message: "Lama bulan minimal harus 1" });
    }

    let cicilanPerBulan;
    let totalBayar;

    if (bungaTahunan > 0) {
      const totalBunga = totalPinjaman * (bungaTahunan / 100) * (lamaBulan / 12);
      totalBayar = totalPinjaman + totalBunga;
      cicilanPerBulan = Math.round(totalBayar / lamaBulan);
    } else {
      totalBayar = totalPinjaman;
      cicilanPerBulan = Math.round(totalPinjaman / lamaBulan);
    }

    const loan = await Loan.create({
      user: req.user.id,
      tempatHutang,
      totalPinjaman,
      bungaTahunan,
      lamaBulan,
      cicilanPerBulan,
      totalBayar
    });

    res.status(201).json({
      message: "Perhitungan berhasil disimpan",
      data: loan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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

exports.updateHutang = async (req, res) => {
  try {
    const { totalPinjaman, bungaTahunan, lamaBulan, tempatHutang } = req.body;

    if (!lamaBulan || lamaBulan <= 0) {
      return res.status(400).json({ message: "Lama bulan minimal harus 1" });
    }

    let cicilanPerBulan;
    let totalBayar;

    if (bungaTahunan > 0) {
      const totalBunga = totalPinjaman * (bungaTahunan / 100) * (lamaBulan / 12);
      totalBayar = totalPinjaman + totalBunga;
      cicilanPerBulan = Math.round(totalBayar / lamaBulan);
    } else {
      totalBayar = totalPinjaman;
      cicilanPerBulan = Math.round(totalPinjaman / lamaBulan);
    }

    const loan = await Loan.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        totalPinjaman,
        tempatHutang,
        bungaTahunan,
        lamaBulan,
        cicilanPerBulan,
        totalBayar
      },
      { new: true }
    );

    if (!loan) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      message: "Perhitungan berhasil diupdate",
      data: loan
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

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