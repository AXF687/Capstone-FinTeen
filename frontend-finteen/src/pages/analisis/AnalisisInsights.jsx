import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Lightbulb, AlertTriangle, CheckCircle2, Target } from 'lucide-react';

export default function AnalisisInsights({ insights }) {
  const getInsightIcon = (insight) => {
    if (insight.toLowerCase().includes('awas') || insight.toLowerCase().includes('melebihi')) {
      return AlertTriangle;
    }
    if (insight.toLowerCase().includes('bagus') || insight.toLowerCase().includes('sehat') || insight.toLowerCase().includes('dekat')) {
      return CheckCircle2;
    }
    if (insight.toLowerCase().includes('target') || insight.toLowerCase().includes('tabungan')) {
      return Target;
    }
    return Lightbulb;
  };

  const getInsightIconColor = (insight) => {
    if (insight.toLowerCase().includes('awas') || insight.toLowerCase().includes('melebihi')) {
      return 'text-red-600 dark:text-red-400';
    }
    if (insight.toLowerCase().includes('bagus') || insight.toLowerCase().includes('sehat') || insight.toLowerCase().includes('dekat')) {
      return 'text-emerald-600 dark:text-emerald-400';
    }
    if (insight.toLowerCase().includes('target') || insight.toLowerCase().includes('tabungan')) {
      return 'text-purple-600 dark:text-purple-400';
    }
    return 'text-blue-600 dark:text-blue-400';
  };

  const getInsightBgColor = (insight) => {
    if (insight.toLowerCase().includes('awas') || insight.toLowerCase().includes('melebihi')) {
      return 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-900/50';
    }
    if (insight.toLowerCase().includes('bagus') || insight.toLowerCase().includes('sehat') || insight.toLowerCase().includes('dekat')) {
      return 'bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-900/50';
    }
    if (insight.toLowerCase().includes('target') || insight.toLowerCase().includes('tabungan')) {
      return 'bg-purple-50 border-purple-200 dark:bg-purple-950/30 dark:border-purple-900/50';
    }
    return 'bg-blue-50 border-blue-200 dark:bg-blue-950/30 dark:border-blue-900/50';
  };

  return (
    <Card className="border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col h-full transition-colors duration-300">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2 dark:text-slate-100 transition-colors">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          Insight FinTeen
        </CardTitle>
        <CardDescription className="dark:text-slate-400 transition-colors">
          Saran otomatis berdasarkan data keuanganmu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 flex-1">
        {insights.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400 text-center py-8 transition-colors">
            Belum ada insight bulan ini. Catat transaksi lebih banyak!
          </p>
        ) : (
          insights.map((insight, index) => {
            const Icon = getInsightIcon(insight);
            const bgColor = getInsightBgColor(insight);
            const iconColor = getInsightIconColor(insight);

            return (
              <div 
                key={index} 
                className={`flex items-start gap-3 p-4 rounded-xl border transition-colors ${bgColor}`}
              >
                <Icon className={`w-5 h-5 shrink-0 mt-0.5 transition-colors ${iconColor}`} />
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                  {insight}
                </p>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}