import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Wallet, TrendingDown, CheckCircle2 } from 'lucide-react';
import CountUp from '@/components/ui/CountUp';

export default function AnalisisSummaryCards({ totalPemasukan, totalPengeluaran, sisaUang }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full transition-colors">
            <Wallet className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">Total Pemasukan</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
              <CountUp value={totalPemasukan} />
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full transition-colors">
            <TrendingDown className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">Total Pengeluaran</p>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
              <CountUp value={totalPengeluaran} />
            </h3>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardContent className="p-6 flex items-center gap-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full transition-colors">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400 transition-colors">Sisa Uang</p>
            <h3 className={`text-2xl font-bold transition-colors ${
              sisaUang < 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              <CountUp value={sisaUang} />
            </h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}