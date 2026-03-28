import React from 'react';
import { Target, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function TabunganHeader({ 
  isModalOpen, 
  setIsModalOpen, 
  handleSubmit, 
  formData, 
  setFormData, 
  displayTargetNominal, 
  handleTargetNominalChange, 
  isLoading 
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2 transition-colors">
          <Target className="w-8 h-8 text-emerald-500" />
          Target Tabungan
        </h1>
        <p className="text-slate-500 dark:text-slate-400 transition-colors">
          Rencanakan impianmu dan pantau progresnya di sini.
        </p>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold transition-colors">
            <Plus className="w-5 h-5 mr-2" />
            Buat Target Baru
          </Button>
        </DialogTrigger>
        
        <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 transition-colors w-[90vw] rounded-xl">
          <DialogHeader>
            <DialogTitle>Buat Target Tabungan</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Nama Impian / Target</Label>
              <Input 
                type="text" 
                placeholder="Contoh: Beli Laptop Baru"
                value={formData.nama}
                onChange={(e) => setFormData({...formData, nama: e.target.value})}
                required 
                className="dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500"
              />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Target Nominal (Rp)</Label>
              <Input 
                type="text" 
                placeholder="Contoh: 10.000.000"
                value={displayTargetNominal}
                onChange={handleTargetNominalChange}
                required 
                className="dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500 font-semibold"
              />
            </div>

            <div className="space-y-2">
              <Label className="dark:text-slate-300">Target Tercapai Dalam (Bulan)</Label>
              <Input 
                type="number" 
                min="1"
                placeholder="Contoh: 12"
                value={formData.deadline_bulan}
                onChange={(e) => setFormData({...formData, deadline_bulan: e.target.value})}
                required 
                className="dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Berapa bulan lagi kamu ingin impian ini terwujud?
              </p>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold mt-2 transition-all" 
              disabled={isLoading}
            >
              {isLoading ? 'Menyimpan...' : 'Simpan Target'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}