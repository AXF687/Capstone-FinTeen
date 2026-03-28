import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { PieChart, Award } from 'lucide-react';

export default function AnalisisHeader({ score }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors">
          <PieChart className="w-8 h-8 text-emerald-500" />
          Analisis & Insight
        </h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">
          Evaluasi kebiasaan finansialmu secara cerdas.
        </p>
      </div>

      <Card className="bg-gradient-to-r from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-700 border-0 shadow-lg min-w-[180px]">
        <CardContent className="px-5 py-3 flex items-center gap-3">
          <Award className="w-8 h-8 text-white" />
          <div>
            <p className="text-lg text-emerald-100 leading-none">Skor Kesehatan</p>
            <p className="tesxt-3xl font-bold text-white leading-tight">{score}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}