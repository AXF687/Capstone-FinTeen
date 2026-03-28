import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PiggyBank, Wallet, AlertTriangle } from 'lucide-react';

export default function TabunganTopupModal({ 
  isTopupModalOpen, 
  setIsTopupModalOpen, 
  selectedTarget, 
  setSelectedTarget, 
  handleTopup, 
  displayTopupAmount, 
  handleTopupAmountChange, 
  topupAmount, 
  setTopupAmount, 
  setDisplayTopupAmount, 
  isTopupLoading, 
  formatRupiah 
}) {
  const [isConfirming, setIsConfirming] = useState(false);

  useEffect(() => {
    if (!isTopupModalOpen) {
      setIsConfirming(false);
    }
  }, [isTopupModalOpen]);

  const handleLanjut = (e) => {
    e.preventDefault();
    if (!topupAmount || Number(topupAmount) <= 0) return;
    setIsConfirming(true);
  };

  const handleClose = () => {
    setIsTopupModalOpen(false);
    setSelectedTarget(null);
    setTopupAmount('');
    setDisplayTopupAmount('');
    setIsConfirming(false);
  };

  return (
    <Dialog open={isTopupModalOpen} onOpenChange={(open) => {
      if (!isTopupLoading) setIsTopupModalOpen(open);
    }}>
      <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 transition-colors w-[90vw] rounded-xl overflow-hidden">
        
        {!isConfirming ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-emerald-500" />
                Isi Tabungan
              </DialogTitle>
            </DialogHeader>
            
            {selectedTarget && (
              <form onSubmit={handleLanjut} className="space-y-4 mt-4 animate-in fade-in slide-in-from-left-4 duration-300">
                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Target:</p>
                  <p className="font-semibold text-slate-800 dark:text-slate-100">
                    {selectedTarget.namaTarget}
                  </p>
                  <div className="flex justify-between mt-2 text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Terkumpul:</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400">
                      {formatRupiah(selectedTarget.tabunganSekarang)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-500 dark:text-slate-400">Target:</span>
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {formatRupiah(selectedTarget.nominalTarget)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="dark:text-slate-300">Jumlah Tabungan (Rp)</Label>
                  <div className="relative">
                    <Wallet className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input 
                      type="text" 
                      placeholder="Contoh: 500.000"
                      value={displayTopupAmount}
                      onChange={handleTopupAmountChange}
                      required 
                      className="pl-10 dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500 font-semibold text-lg h-12"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 dark:border-slate-700 dark:text-slate-300"
                    onClick={handleClose}
                  >
                    Batal
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold transition-colors"
                    disabled={!topupAmount}
                  >
                    Lanjutkan
                  </Button>
                </div>
              </form>
            )}
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-orange-600 dark:text-orange-500">
                <AlertTriangle className="w-5 h-5" />
                Konfirmasi Tabungan
              </DialogTitle>
            </DialogHeader>
            
            <div className="py-2 space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                Kamu akan memasukkan uang sebesar <strong className="text-emerald-600 dark:text-emerald-400 text-base">{formatRupiah(Number(topupAmount))}</strong> ke dalam target tabungan <strong>{selectedTarget?.namaTarget}</strong>.
              </p>
              
              <div className="p-3 bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 rounded-xl text-sm text-orange-800 dark:text-orange-300 flex items-start gap-2.5 shadow-sm">
                <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
                <p><strong>Perhatian:</strong> Transaksi ini akan tercatat otomatis di sistem. Uang yang ditabung <strong>tidak dapat diedit atau dihapus</strong> dari halaman riwayat transaksi.</p>
              </div>
            </div>

            <div className="flex gap-2 mt-4 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsConfirming(false)} 
                disabled={isTopupLoading}
                className="flex-1 dark:border-slate-700 dark:text-slate-300"
              >
                Koreksi Angka
              </Button>
              <Button 
                onClick={handleTopup} 
                disabled={isTopupLoading} 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-colors"
              >
                {isTopupLoading ? "Memproses..." : "Ya, Simpan"}
              </Button>
            </div>
          </>
        )}

      </DialogContent>
    </Dialog>
  );
}