/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { toast } from 'sonner';
import { motion } from 'motion/react';

import AnalisisHeader from './AnalisisHeader';
import AnalisisStatus from './AnalisisStatus';
import AnalisisSummaryCards from './AnalisisSummaryCards';
import AnalisisInsights from './AnalisisInsights';
import AnalisisDistribusi from './AnalisisDistribusi';

export default function Analisis() {
  const { user } = useAuthStore();
  
  const [loading, setLoading] = useState(true);
  const [analisisData, setAnalisisData] = useState({
    totalPemasukan: 0,
    totalPengeluaran: 0,
    saldo: 0,
    score: 0,
    statusKeuangan: 'belum ada data',
    distribusi: [],
    insights: []
  });

  useEffect(() => {
    document.title = "Analisis Cerdas - FinTeen";
    fetchAnalisis();
  }, []);

  const fetchAnalisis = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analisis');
      
      setAnalisisData(response.data);
      
    } catch (error) {
      console.error('Gagal mengambil data analisis:', error);
      toast.error('Gagal memuat data analisis');
      
      setAnalisisData({
        totalPemasukan: 3000000,
        totalPengeluaran: 2500000,
        saldo: 500000,
        score: 75,
        statusKeuangan: 'cukup',
        distribusi: [
          { _id: 'Makan & Minum', total: 1200000 },
          { _id: 'Transportasi', total: 400000 },
          { _id: 'Hiburan', total: 800000 },
          { _id: 'Uang Saku', total: 100000 },
        ],
        insights: [
          "Bagus! Pengeluaranmu masih di bawah 50% pemasukan. Keuanganmu cukup sehat.",
          "Pengeluaran Hiburan kamu cukup tinggi (lebih dari 20% budget). Pertimbangkan untuk menguranginya.",
          "Kamu punya sisa uang sekitar Rp500.000. Jangan lupa sisihkan sebagian untuk target tabunganmu!"
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { 
      style: 'currency', 
      currency: 'IDR', 
      minimumFractionDigits: 0 
    }).format(angka);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Memuat data analisis...</p>
        </div>
      </div>
    );
  }

  const sisaUang = analisisData.saldo;

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 transition-colors duration-300">
      
      <motion.div variants={itemVariants}>
        <AnalisisHeader score={analisisData.score} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AnalisisStatus statusKeuangan={analisisData.statusKeuangan} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <AnalisisSummaryCards 
          totalPemasukan={analisisData.totalPemasukan}
          totalPengeluaran={analisisData.totalPengeluaran}
          sisaUang={sisaUang}
          formatRupiah={formatRupiah}
        />
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalisisInsights insights={analisisData.insights} />

        <AnalisisDistribusi 
          distribusi={analisisData.distribusi}
          totalPengeluaran={analisisData.totalPengeluaran}
          totalPemasukan={analisisData.totalPemasukan}
          formatRupiah={formatRupiah}
        />
      </motion.div>

    </motion.div>
  );
}