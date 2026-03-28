import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function AnalisisDistribusi({ distribusi, totalPengeluaran, totalPemasukan, formatRupiah }) {
  return (
    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col h-full transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl dark:text-slate-100 transition-colors">
          Distribusi Pengeluaran
        </CardTitle>
        <CardDescription className="dark:text-slate-400 transition-colors">
          Kemana perginya uangmu bulan ini?
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 flex-1">
        {distribusi.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8 transition-colors">
            Belum ada data pengeluaran.
          </p>
        ) : (
          distribusi.map((item, index) => {
            const persentase = totalPengeluaran > 0 
              ? ((item.total / totalPengeluaran) * 100).toFixed(1) 
              : 0;
            
            const colors = [
              'bg-blue-500',
              'bg-emerald-500',
              'bg-orange-500',
              'bg-purple-500',
              'bg-pink-500',
              'bg-indigo-500',
              'bg-yellow-500',
              'bg-red-500'
            ];
            
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                    {item._id}
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 transition-colors">
                    {formatRupiah(item.total)} ({persentase}%)
                  </span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden transition-colors">
                  <div 
                    className={`h-full rounded-full ${colors[index % colors.length]} transition-all duration-500 ease-in-out`} 
                    style={{ width: `${persentase}%` }}
                  />
                </div>
              </div>
            );
          })
        )}

        {totalPengeluaran > 0 && (
          <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Rasio pengeluaran terhadap pemasukan:{' '}
              <span className="font-semibold text-slate-700 dark:text-slate-300">
                {((totalPengeluaran / totalPemasukan) * 100).toFixed(1)}%
              </span>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}