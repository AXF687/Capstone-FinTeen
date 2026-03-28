import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Calculator } from 'lucide-react';

export default function HutangHeader({ isModalOpen, setIsModalOpen, children }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 transition-colors">Simulasi Hutang</h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">Hitung estimasi cicilan Paylater atau Pinjamanmu di sini.</p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold transition-colors">
            <Calculator className="w-5 h-5 mr-2" />
            Mulai Simulasi Baru
          </Button>
        </DialogTrigger>
        
        {children}
      </Dialog>
    </div>
  );
}