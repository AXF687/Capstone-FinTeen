import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function DashboardChart({ chartData }) {
  return (
    <Card className="dark:bg-slate-900 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <CardHeader><CardTitle className="dark:text-slate-100 transition-colors">Grafik Pemasukan & Pengeluaran</CardTitle></CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData || []}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8' }} tickFormatter={(value) => {
                if (value >= 1000000) return `${value / 1000000}jt`; 
                else if (value >= 1000) return `${value / 1000}k`; 
                return value; 
              }} 
            />
            <Tooltip formatter={(value) => `Rp ${value.toLocaleString('id-ID')}`} cursor={{fill: 'rgba(148, 163, 184, 0.1)'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Legend wrapperStyle={{ paddingTop: '10px' }} />
            <Bar dataKey="pemasukan" fill="#10b981" name="Pemasukan" radius={[4, 4, 0, 0]} maxBarSize={100} />
            <Bar dataKey="pengeluaran" fill="#f43f5e" name="Pengeluaran" radius={[4, 4, 0, 0]} maxBarSize={100} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}