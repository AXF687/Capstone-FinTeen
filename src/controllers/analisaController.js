const Transaction = require("../models/Transaction");
const TargetTabungan = require("../models/TargetTabungan");

exports.getAnalysis = async (req, res) => {
  try {

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

    const distribusi = await Transaction.aggregate([
      { $match: { user: req.user.id, tipe: "pengeluaran" } },
      {
        $group: {
          _id: "$kategori",
          total: { $sum: "$nominal" }
        }
      }
    ]);

    const insights = [];

    // 1. Rasio pengeluaran
    const rasioPengeluaran = totalPengeluaran / totalPemasukan;

    if (rasioPengeluaran > 0.8) {
      insights.push(
        "Awas! Pengeluaranmu bulan ini sudah mencapai lebih dari 80% pemasukan. Rem pengeluaranmu sekarang."
      );
    }

    if (rasioPengeluaran < 0.5) {
      insights.push(
        "Bagus! Pengeluaranmu masih di bawah 50% pemasukan. Keuanganmu cukup sehat."
      );
    }

    // 2. Distribusi kategori
    distribusi.forEach((item) => {
      const persentase = item.total / totalPengeluaran;

      if (persentase > 0.2) {
        insights.push(
          `Pengeluaran ${item._id} kamu cukup tinggi (lebih dari 20% budget). Pertimbangkan untuk menguranginya.`
        );
      }
    });

    // 3. Sisa uang
    if (saldo > 0) {
      insights.push(
        `Kamu punya sisa uang sekitar Rp${saldo.toLocaleString()}. Jangan lupa sisihkan sebagian untuk target tabunganmu!`
      );
    }

    if (saldo <= 0) {
      insights.push(
        "Pengeluaranmu melebihi pemasukan. Segera evaluasi pengeluaran bulan ini."
      );
    }

    // 4. Target tabungan
    const target = await TargetTabungan.findOne({ user: req.user.id });

    if (target) {
      const progress = (saldo / target.nominalTarget) * 100;

      if (progress < 20) {
        insights.push(
          `🎯 Progress target "${target.namaTarget}" masih rendah. Coba tingkatkan tabungan bulan ini.`
        );
      }

      if (progress > 70) {
        insights.push(
          `🔥 Kamu sudah dekat mencapai target "${target.namaTarget}". Teruskan menabung!`
        );
      }
    }

    res.json({
      totalPemasukan,
      totalPengeluaran,
      saldo,
      distribusi,
      insights
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};