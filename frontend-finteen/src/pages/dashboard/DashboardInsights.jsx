import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

export default function DashboardInsights({ insights }) {
  if (!insights || insights.length === 0) return null;

  return (
    <Card className="bg-amber-50 border-amber-200 dark:bg-amber-900/10 dark:border-amber-900/50 shadow-sm transition-colors duration-300">
      <CardContent className="p-4 flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-semibold text-amber-800 dark:text-amber-500">FinTeen Insights</h4>
          <ul className="text-sm text-amber-700 dark:text-amber-400/90 list-disc list-inside space-y-1">
            {insights.map((pesan, index) => (
              <li key={index}>{pesan}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}