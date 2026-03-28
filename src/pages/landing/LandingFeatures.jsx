import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingUp, Target, BarChart3, Shield, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function LandingFeatures() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  const features = [
    { icon: Wallet, title: "Pencatatan Transaksi", desc: "Catat semua pemasukan dan pengeluaran dengan mudah.", color: "blue" },
    { icon: BarChart3, title: "Dashboard Interaktif", desc: "Visualisasi keuangan dengan grafik yang mudah dipahami. Lihat ringkasan lengkap dalam satu tampilan.", color: "purple" },
    { icon: Target, title: "Target Tabungan", desc: "Buat target tabungan untuk impianmu dan mulailah mengisi progress tabunganmu!.", color: "green" },
    { icon: TrendingUp, title: "Simulasi Hutang", desc: "Hitung cicilan paylater atau pinjaman sebelum memutuskan. Ketahui total bunga dan risikonya.", color: "orange" },
    { icon: Shield, title: "Analisis Otomatis", desc: "Dapatkan insight dan peringatan tentang pola keuangan kamu.", color: "red" },
    { icon: Users, title: "Dirancang untuk Anak Muda", desc: "Dirancang untuk generasi muda. Interface yang mudah dan menyenangkan.", color: "pink" }
  ];

  const getColorClasses = (color) => {
    switch (color) {
      case 'blue': return 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400';
      case 'purple': return 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400';
      case 'green': return 'bg-green-100 dark:bg-emerald-900/30 text-green-600 dark:text-emerald-400';
      case 'orange': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400';
      case 'red': return 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400';
      case 'pink': return 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400';
      default: return '';
    }
  };

  return (
    <section id="features" className="bg-white dark:bg-slate-900 py-16 md:py-20 transition-colors duration-500 overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">Fitur Unggulan</h2>
          <p className="text-center text-gray-600 dark:text-slate-400 mb-12 max-w-2xl mx-auto">
            Semua yang kamu butuhkan untuk mengelola keuangan dengan mudah dan cerdas
          </p>
        </motion.div>
        
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <motion.div key={idx} variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
                <Card className="h-full hover:shadow-lg dark:hover:shadow-emerald-900/10 transition-shadow dark:bg-slate-950 dark:border-slate-800">
                  <CardContent className="pt-6">
                    <div className={`h-12 w-12 rounded-lg flex items-center justify-center mb-4 ${getColorClasses(feat.color)}`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{feat.title}</h3>
                    <p className="text-gray-600 dark:text-slate-400">
                      {feat.desc}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}