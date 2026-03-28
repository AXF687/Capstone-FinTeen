import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Trash2, Clock, MapPin } from 'lucide-react'; // Tambah MapPin
import { motion, AnimatePresence } from 'motion/react';

export default function HutangListRiwayat({ riwayatList, formatRupiah, openDeleteModal }) {
  if (riwayatList.length === 0) return null;

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-slate-500" /> Riwayat Simulasi Tersimpan
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {riwayatList.map((riwayat) => (
            <motion.div
              key={riwayat._id}
              layout
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ type: "spring", stiffness: 300, damping: 24 }}
            >
              <Card className="h-full border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md flex flex-col group">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      {/* Tampilkan Nama Tempat sebagai Judul Utama */}
                      <CardTitle className="text-sm font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider">
                        <MapPin className="w-3.5 h-3.5" /> {riwayat.tempatHutang}
                      </CardTitle>
                      <p className="text-lg font-bold text-slate-800 dark:text-slate-100">
                        {formatRupiah(riwayat.totalPinjaman)}
                      </p>
                    </div>
                    <button 
                      onClick={() => openDeleteModal(riwayat._id)} 
                      className="text-slate-400 hover:text-red-500 p-1 transition-colors" 
                      title="Hapus riwayat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <CardDescription className="dark:text-slate-400 text-xs">
                    Bunga {riwayat.bungaTahunan}% • {riwayat.lamaBulan} bln
                  </CardDescription>
                </CardHeader>
                <CardContent className="pb-4 flex-1">
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 mt-2 group-hover:border-emerald-500/30 transition-colors">
                    <p className="text-[10px] uppercase font-bold text-slate-400 dark:text-slate-500 mb-1">Cicilan per bulan:</p>
                    <p className="text-xl font-black text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(riwayat.cicilanPerBulan)}
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="pt-0 text-[11px] text-slate-500 border-t border-slate-100 dark:border-slate-800 pt-3 mt-auto flex justify-between">
                  <span>Total Bayar:</span>
                  <span className="font-semibold">{formatRupiah(riwayat.totalBayar)}</span>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
