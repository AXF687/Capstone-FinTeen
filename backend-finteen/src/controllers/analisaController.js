const Transaction = require("../models/Transaction");
const TargetTabungan = require("../models/TargetTabungan");

exports.getAnalysis = async (req, res) => {
  try {
    const userId = req.user.id;

    const { bulan, tahun } = req.query;

    let query = { user: userId };

    if (bulan && tahun) {
      const startDate = new Date(tahun, Number(bulan) - 1, 1); 
      const endDate = new Date(tahun, Number(bulan), 1); 
      
      query.tanggal = {
        $gte: startDate,
        $lt: endDate
      };
    }

   const transactions = await Transaction.find(query);

    const totalPemasukan = transactions
      .filter(t => t.tipe === "pemasukan")
      .reduce((sum, t) => sum + t.nominal, 0);

    const totalPengeluaran = transactions
      .filter(t => t.tipe === "pengeluaran")
      .reduce((sum, t) => sum + t.nominal, 0);

    const saldo = totalPemasukan - totalPengeluaran;

    const distribusiMap = new Map();
    
    transactions
      .filter(t => t.tipe === "pengeluaran")
      .forEach(t => {
        const key = t.kategori;
        const current = distribusiMap.get(key) || 0;
        distribusiMap.set(key, current + t.nominal);
      });

    const distribusi = Array.from(distribusiMap.entries()).map(([kategori, total]) => ({
      _id: kategori,
      total
    }));

    const insights = [];

    // FILTER PEMASUKAN 20% UNTUK INVESTASI
    const targetInvestasi = totalPemasukan * 0.2;
    const formattedTarget = formatRupiah(targetInvestasi);

    if (totalPemasukan > 0) {
      if (saldo >= targetInvestasi) {
        if (targetInvestasi <= 100000) {
          insights.push(
            `✅ Sisa uangmu cukup! Target 20% pemasukanmu (${formattedTarget}) bisa dialokasikan ke Emas Digital atau Reksa Dana Pasar Uang yang risikonya rendah.`
          );
        } else if (targetInvestasi <= 1000000) {
          insights.push(
            `💡 Mantap! Target 20% pemasukanmu sebesar ${formattedTarget} sudah aman. Coba mulai melirik investasi Obligasi atau P2P Lending untuk hasil lebih stabil.`
          );
        } else {
          insights.push(
            `🚀 Luar biasa! Sisa uangmu sangat cukup untuk target investasi 20% (${formattedTarget}). Waktunya beli Saham Blue Chip atau SBN untuk aset jangka panjang!`
          );
        }
      } else if (saldo > 0 && saldo < targetInvestasi) {
        insights.push(
          `⚠️ Sisa uangmu (${formatRupiah(saldo)}) belum mencapai target ideal 20% pemasukan (${formattedTarget}). Tapi tenang, kamu tetap bisa mulai investasi kecil-kecilan di Emas Digital mulai dari Rp10.000!`
        );
      } else {
        insights.push(
          `❗ Bulan ini sisa uangmu belum ada untuk investasi. Fokus rapihin pengeluaran dulu ya supaya bulan depan ada saldo yang bisa disisihkan!`
        );
      }
    }

    if (totalPemasukan > 0) {
      const rasioPengeluaran = totalPengeluaran / totalPemasukan;

      if (rasioPengeluaran > 0.8) {
        insights.push(
          "⚠️ Awas! Pengeluaranmu bulan ini sudah mencapai lebih dari 80% pemasukan. Rem pengeluaranmu sekarang."
        );
      } else if (rasioPengeluaran < 0.5) {
        insights.push(
          "✅ Bagus! Pengeluaranmu masih di bawah 50% pemasukan. Keuanganmu cukup sehat."
        );
      } else {
        insights.push(
          "📊 Pengeluaranmu masih dalam batas wajar. Tetap jaga pola keuanganmu!"
        );
      }
    }

    if (totalPengeluaran > 0) {
      distribusi.forEach(item => {
        const persentase = (item.total / totalPengeluaran) * 100;
        
        if (persentase > 30) {
          insights.push(
            `💰 Pengeluaran ${item._id} cukup dominan (${persentase.toFixed(1)}% dari total). Pertimbangkan untuk mengecek kembali kebutuhan di kategori ini.`
          );
        }
      });
    }

    if (saldo > 0) {
      insights.push(
        `💵 Kamu punya sisa uang ${formatRupiah(saldo)}. Jangan lupa sisihkan untuk tabungan atau investasi!`
      );
    } else if (saldo < 0) {
      insights.push(
        "❗ Pengeluaranmu melebihi pemasukan. Segera evaluasi pengeluaran bulan ini!"
      );
    }

    const targets = await TargetTabungan.find({ user: userId });
    
    if (targets.length > 0) {
      targets.forEach(target => {
        const progress = (target.tabunganSekarang / target.nominalTarget) * 100;
        
        if (progress < 20) {
          insights.push(
            `🎯 Progress target "${target.namaTarget}" masih ${progress.toFixed(1)}%. Yuk, mulai nabung lebih rutin!`
          );
        } else if (progress > 70) {
          insights.push(
            `🔥 Mantap! Kamu sudah mencapai ${progress.toFixed(1)}% dari target "${target.namaTarget}". Teruskan!`
          );
        }
      });
    }

    let score = 0;
    if (totalPemasukan > 0) {
      const rasioScore = Math.max(0, 40 - (totalPengeluaran / totalPemasukan) * 40);
   
      const sisaRasio = saldo / totalPemasukan;
      const sisaScore = Math.max(0, Math.min(30, sisaRasio * 30));
      
      let targetScore = 0;
      if (targets.length > 0) {
        const avgProgress = targets.reduce((sum, t) => 
          sum + (t.tabunganSekarang / t.nominalTarget), 0) / targets.length * 30;
        targetScore = Math.min(30, avgProgress);
      }
      
      score = Math.round(rasioScore + sisaScore + targetScore);
      score = Math.max(0, Math.min(100, score)); 
    }

    let statusKeuangan = "buruk";
    if (score >= 80) statusKeuangan = "sehat";
    else if (score >= 60) statusKeuangan = "cukup";
    else if (score >= 40) statusKeuangan = "waspada";

    res.json({
      totalPemasukan,
      totalPengeluaran,
      saldo,
      score,
      statusKeuangan,
      distribusi,
      insights
    });

  } catch (error) {
    console.error("Error in getAnalysis:", error);
    res.status(500).json({ 
      message: "Gagal mengambil data analisis",
      error: error.message 
    });
  }
};

function formatRupiah(angka) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(angka);
}