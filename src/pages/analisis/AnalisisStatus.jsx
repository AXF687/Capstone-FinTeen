import React from 'react';

export default function AnalisisStatus({ statusKeuangan }) {
  const getStatusColor = (status) => {
    switch(status) {
      case 'sehat':
        return 'text-emerald-600 dark:text-emerald-400';
      case 'cukup':
        return 'text-blue-600 dark:text-blue-400';
      case 'waspada':
        return 'text-orange-600 dark:text-orange-400';
      case 'buruk':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-slate-600 dark:text-slate-400';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'sehat':
        return 'bg-emerald-50 dark:bg-emerald-900/30 border-emerald-200 dark:border-emerald-800';
      case 'cukup':
        return 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800';
      case 'waspada':
        return 'bg-orange-50 dark:bg-orange-900/30 border-orange-200 dark:border-orange-800';
      case 'buruk':
        return 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800';
      default:
        return 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700';
    }
  };

  return (
    <div className={`p-4 rounded-xl border ${getStatusBgColor(statusKeuangan)} transition-colors`}>
      <div className="flex items-center gap-3">
        <div className={`text-2xl font-bold ${getStatusColor(statusKeuangan)}`}>
          {statusKeuangan.toUpperCase()}
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Status keuanganmu berdasarkan analisis pengeluaran dan pemasukan bulan ini.
        </p>
      </div>
    </div>
  );
}