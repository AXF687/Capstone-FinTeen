import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";
import CountUp from "@/components/ui/CountUp";

export default function DashboardSummary({ summary }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">Total Pemasukan</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-emerald-600 dark:text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors">
            <CountUp value={summary?.income || 0} />
          </div>
          {/* 🌟 FIX: Tulisan "Termasuk saldo awal" dihapus agar user tidak bingung */}
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">Total Pengeluaran</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-red-600 dark:text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600 dark:text-red-400 transition-colors">
            <CountUp value={summary?.expense || 0} />
          </div>
        </CardContent>
      </Card>

      <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-slate-600 dark:text-slate-400 transition-colors">Sisa Uang</CardTitle>
          <Wallet className={`h-4 w-4 ${(summary?.balance || 0) >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold transition-colors ${(summary?.balance || 0) >= 0 ? "text-blue-600 dark:text-blue-400" : "text-red-600 dark:text-red-400"}`}>
            <CountUp value={summary?.balance || 0} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}