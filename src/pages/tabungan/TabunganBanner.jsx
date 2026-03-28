import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export default function TabunganBanner({ targetBulanan, formatRupiah }) {
  if (!targetBulanan || targetBulanan <= 0) return null;

  return (
    <Card className="bg-gradient-to-r from-emerald-50 to-teal-50 border-emerald-200 dark:from-emerald-950/30 dark:to-teal-950/30 dark:border-emerald-800/50 shadow-sm transition-colors duration-300">
      <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-full">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Target Tabungan Bulanan (Dari Profil)</p>
            <h3 className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
              {formatRupiah(targetBulanan)} <span className="text-sm font-normal text-slate-500 dark:text-slate-500">/ bulan</span>
            </h3>
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs sm:text-right">
          Sisihkan nominal ini di awal bulan agar target impian di bawah cepat tercapai! 🚀
        </p>
      </CardContent>
    </Card>
  );
}