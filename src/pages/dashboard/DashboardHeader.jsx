import React from "react";

export default function DashboardHeader({ user, filterBulan, setFilterBulan, filterTahun, setFilterTahun }) {
  const currentYear = new Date().getFullYear();

  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
          Halo, {user?.nama || 'FinTeeners'}! 👋
        </h1>
        <p className="text-slate-600 dark:text-slate-400 transition-colors">Ini ringkasan keuanganmu saat ini.</p>
      </div>

      <div className="flex items-center gap-3 w-full md:w-auto">
        <select
          value={filterBulan}
          onChange={(e) => setFilterBulan(Number(e.target.value))}
          className="flex-1 md:flex-none h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <option value={1}>Januari</option><option value={2}>Februari</option><option value={3}>Maret</option>
          <option value={4}>April</option><option value={5}>Mei</option><option value={6}>Juni</option>
          <option value={7}>Juli</option><option value={8}>Agustus</option><option value={9}>September</option>
          <option value={10}>Oktober</option><option value={11}>November</option><option value={12}>Desember</option>
        </select>

        <select
          value={filterTahun}
          onChange={(e) => setFilterTahun(Number(e.target.value))}
          className="flex-1 md:flex-none h-10 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 transition-colors cursor-pointer"
        >
          <option value={currentYear - 2}>{currentYear - 2}</option>
          <option value={currentYear - 1}>{currentYear - 1}</option>
          <option value={currentYear}>{currentYear}</option>
          <option value={currentYear + 1}>{currentYear + 1}</option>
        </select>
      </div>
    </div>
  );
}