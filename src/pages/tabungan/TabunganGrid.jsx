import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { CheckCircle2, AlertCircle, TrendingUp, PiggyBank, PartyPopper } from 'lucide-react';

export default function TabunganGrid({ targetList, formatRupiah, openTopupModal }) {
  if (targetList.length === 0) {
    return (
      <div className="col-span-full p-8 text-center bg-slate-50 dark:bg-transparent border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl text-slate-500 dark:text-slate-400 transition-colors">
        Belum ada target impian. Yuk mulai rencanakan masa depanmu!
      </div>
    );
  }

  return (
    <>
      {targetList.map((item) => {
        const persentase = item.nominalTarget > 0 
          ? Math.min((item.tabunganSekarang / item.nominalTarget) * 100, 100) 
          : 0;
        const isRealistis = item.status === "realistis";
        const sisaTarget = item.nominalTarget - item.tabunganSekarang;
        
        const isTercapai = persentase >= 100;

        return (
          <Card 
            key={item._id} 
            className={`border-slate-200 dark:border-slate-800 dark:bg-slate-900 shadow-sm transition-all flex flex-col ${isTercapai ? 'border-emerald-400 dark:border-emerald-600 shadow-emerald-100 dark:shadow-emerald-900/20' : 'hover:shadow-md dark:hover:shadow-emerald-900/10'}`}
          >
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start mb-2">
                <CardTitle className="text-xl text-slate-800 dark:text-slate-100 line-clamp-1 transition-colors" title={item.namaTarget}>
                  {item.namaTarget}
                </CardTitle>
                <div className={`p-2 rounded-lg transition-colors ${isTercapai ? 'bg-emerald-500 text-white' : 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400'}`}>
                  {isTercapai ? <PartyPopper className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                </div>
              </div>
              <CardDescription className="text-base font-semibold text-slate-700 dark:text-slate-300 transition-colors">
                {formatRupiah(item.nominalTarget)}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-5 flex-1">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-emerald-600 dark:text-emerald-400 font-semibold transition-colors">
                    {persentase.toFixed(1)}%
                  </span>
                  <span className="text-slate-500 dark:text-slate-400 text-xs transition-colors">
                    Target: {item.targetBulan} bln
                  </span>
                </div>
                
                <Progress value={persentase} className="h-2 bg-slate-100 dark:bg-slate-800" />
                
                <div className="flex justify-between text-xs mt-1">
                  <span className="text-slate-500 dark:text-slate-400">
                    Terkumpul: {formatRupiah(item.tabunganSekarang)}
                  </span>
                  {sisaTarget > 0 && (
                    <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                      Sisa: {formatRupiah(sisaTarget)}
                    </span>
                  )}
                </div>
              </div>

              {!isTercapai ? (
                <>
                  <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800 transition-colors">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 transition-colors">Harus nabung bulan ini:</p>
                    <p className="text-lg font-bold text-slate-800 dark:text-slate-100 transition-colors">{formatRupiah(item.perBulan)}</p>
                  </div>

                  <Button
                    onClick={() => openTopupModal(item)}
                    className="w-full bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/50 dark:hover:bg-emerald-800/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 transition-all group"
                  >
                    <PiggyBank className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                    Isi Tabungan
                  </Button>
                </>
              ) : (
                <div className="w-full flex justify-center items-center gap-2 text-sm font-bold text-white bg-emerald-500 p-3 rounded-md shadow-sm h-[92px]">
                  <CheckCircle2 className="w-6 h-6" /> IMPIAN TERCAPAI!
                </div>
              )}
            </CardContent>

            <CardFooter className="pt-0 pb-4">
              {isTercapai ? (
                <div className="w-full flex items-center justify-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-md border border-emerald-100 dark:border-emerald-900/50 transition-colors font-medium">
                  <PartyPopper className="w-4 h-4 shrink-0" />
                  Selamat! Kamu berhasil mencapai target ini.
                </div>
              ) : isRealistis ? (
                <div className="w-full flex items-center gap-2 text-xs text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 rounded-md border border-emerald-100 dark:border-emerald-900/50 transition-colors">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Target ini realistis dengan pemasukanmu!
                </div>
              ) : (
                <div className="w-full flex items-center gap-2 text-xs text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/30 px-3 py-2 rounded-md border border-orange-100 dark:border-orange-900/50 transition-colors">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  Wow! Target nabung bulan ini cukup berat.
                </div>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </>
  );
}