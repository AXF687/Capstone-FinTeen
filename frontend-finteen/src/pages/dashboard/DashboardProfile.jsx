import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardProfile({ userProfil }) {
  const formatStatus = (status) => {
    if (!status) return "-";
    return status.replace("_", " ");
  };

  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <CardHeader>
        <CardTitle className="dark:text-slate-100 transition-colors">Info Profil</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 transition-colors">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Status</span>
            <span className="font-semibold capitalize text-slate-800 dark:text-slate-100 transition-colors">
              {formatStatus(userProfil.status)}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 transition-colors">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Saldo Awal</span>
            <span className="font-semibold text-slate-800 dark:text-emerald-400 transition-colors">
              Rp {(userProfil.saldo_awal || 0).toLocaleString("id-ID")}
            </span>
          </div>
          <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-800 transition-colors">
            <span className="text-slate-500 dark:text-slate-400 text-sm">Target Tabungan</span>
            <span className="font-semibold text-slate-800 dark:text-slate-100 transition-colors">
              Rp {(userProfil.target_bulanan || 0).toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}