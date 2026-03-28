import React from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Receipt, Calculator, Target, TrendingUp } from "lucide-react";

export default function DashboardQuickActions() {
  return (
    <Card className="md:col-span-2 dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <CardHeader><CardTitle className="dark:text-slate-100 transition-colors">Akses Cepat</CardTitle></CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/transaksi">
            <Button variant="outline" className="w-full h-24 flex-col gap-2 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-emerald-400 dark:hover:border-emerald-500 transition-all">
              <Receipt className="h-6 w-6" /><span className="text-xs font-semibold">Transaksi</span>
            </Button>
          </Link>
          <Link to="/hutang">
            <Button variant="outline" className="w-full h-24 flex-col gap-2 hover:bg-slate-50 hover:border-orange-500 hover:text-orange-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-orange-400 dark:hover:border-orange-500 transition-all">
              <Calculator className="h-6 w-6" /><span className="text-xs font-semibold">Simulasi</span>
            </Button>
          </Link>
          <Link to="/tabungan">
            <Button variant="outline" className="w-full h-24 flex-col gap-2 hover:bg-slate-50 hover:border-blue-500 hover:text-blue-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400 dark:hover:border-blue-500 transition-all">
              <Target className="h-6 w-6" /><span className="text-xs font-semibold">Tabungan</span>
            </Button>
          </Link>
          <Link to="/analisis">
            <Button variant="outline" className="w-full h-24 flex-col gap-2 hover:bg-slate-50 hover:border-purple-500 hover:text-purple-700 dark:bg-slate-950 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-purple-400 dark:hover:border-purple-500 transition-all">
              <TrendingUp className="h-6 w-6" /><span className="text-xs font-semibold">Analisis</span>
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}