import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, CheckCircle2, Receipt, MapPin } from 'lucide-react'; 

export default function HutangHasilBox({ hasilTerbaru, riwayatList, resetSimulasi, formatRupiah }) {
  if (!hasilTerbaru && riwayatList.length === 0) {
    return (
      <Card className="border-dashed border-2 border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-transparent">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mb-4">
            <Receipt className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-2">Belum Ada Simulasi</h3>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">Klik tombol "Mulai Simulasi Baru" untuk menghitung estimasi cicilan hutang atau paylater kamu.</p>
        </CardContent>
      </Card>
    );
  }

  if (!hasilTerbaru) return null;

  return (
    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm overflow-hidden ring-1 ring-emerald-500/20">
      <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between py-4">
        <div>
          <CardTitle className="text-lg text-emerald-700 dark:text-emerald-400">Hasil Simulasi Terbaru</CardTitle>
          <CardDescription className="dark:text-slate-400">Dihitung oleh sistem</CardDescription>
        </div>
        <Button variant="outline" size="sm" onClick={resetSimulasi} className="text-slate-500 dark:text-slate-400">Tutup Hasil</Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="flex flex-col justify-center items-center p-6 bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-2">Estimasi Cicilan per Bulan</p>
            <p className="text-4xl md:text-5xl font-bold text-emerald-600 dark:text-emerald-400">{formatRupiah(hasilTerbaru.cicilanPerBulan)}</p>
            <div className="mt-4 px-4 py-1.5 bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs rounded-full font-medium">
              Selama {hasilTerbaru.lamaBulan} Bulan
            </div>
          </div>
          <div className="space-y-4 flex flex-col justify-center">
            <div className="space-y-3 p-5 rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm text-sm">
              <div className="flex justify-between items-center pb-2 border-b border-slate-50 dark:border-slate-800/50">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" /> Pinjam Ke / Tempat
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-100 uppercase tracking-tight italic">
                  {hasilTerbaru.tempatHutang}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Pokok Pinjaman</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{formatRupiah(hasilTerbaru.totalPinjaman)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-500 dark:text-slate-400">Bunga per Tahun</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{hasilTerbaru.bungaTahunan}%</span>
              </div>
              <div className="flex justify-between items-center pt-3 border-t border-dashed border-slate-200 dark:border-slate-700">
                <span className="font-medium text-slate-700 dark:text-slate-300">Total yang Harus Dibayar</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400 text-base">{formatRupiah(hasilTerbaru.totalBayar)}</span>
              </div>
            </div>
            {hasilTerbaru.bungaTahunan > 15 ? (
              <div className="flex gap-3 p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-xl text-red-700 dark:text-red-400 text-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Peringatan Risiko:</strong> Bunga pinjaman ini cukup tinggi ({hasilTerbaru.bungaTahunan}%/tahun). Pertimbangkan kembali ya!</p>
              </div>
            ) : hasilTerbaru.bungaTahunan === 0 ? (
              <div className="flex gap-3 p-4 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-xl text-blue-700 dark:text-blue-400 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Wow! Cicilan 0% tanpa bunga. Pastikan bayar tepat waktu ya agar tidak kena denda.</p>
              </div>
            ) : (
              <div className="flex gap-3 p-4 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/50 rounded-xl text-emerald-700 dark:text-emerald-400 text-sm">
                <CheckCircle2 className="w-5 h-5 shrink-0 mt-0.5" />
                <p>Bunga masih wajar. Pastikan cicilan bulananmu tidak memberatkan.</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}