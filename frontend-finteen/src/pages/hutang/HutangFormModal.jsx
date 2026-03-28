import React from 'react';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function HutangFormModal({ 
  handleSimpan, 
  displayNominal, 
  handleNominalChange, 
  formData, 
  setFormData, 
  submitting 
}) {
  return (
    <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 transition-colors w-[90vw] rounded-xl">
      <DialogHeader>
        <DialogTitle>Kalkulator Cicilan</DialogTitle>
        <DialogDescription className="dark:text-slate-400">Bisa untuk bunga 0% (cicilan tanpa bunga).</DialogDescription>
      </DialogHeader>
      
      <form onSubmit={handleSimpan} className="space-y-4 mt-4">
        <div className="space-y-2">
          <Label className="dark:text-slate-300">Pinjam Ke / Tempat</Label>
          <Input 
            type="text" 
            placeholder="Contoh: Bank BCA, Teman, atau Koperasi" 
            value={formData.tempatHutang} 
            onChange={(e) => setFormData({...formData, tempatHutang: e.target.value})} 
            required 
            className="dark:bg-slate-950 dark:border-slate-700" 
          />
        </div>
        <div className="space-y-2">
          <Label className="dark:text-slate-300">Total Pinjaman (Rp)</Label>
          <Input type="text" placeholder="Contoh: 5.000.000" value={displayNominal} onChange={handleNominalChange} required className="dark:bg-slate-950 dark:border-slate-700 font-semibold" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="dark:text-slate-300">Bunga / Tahun (%)</Label>
            <Input type="number" min="0" step="0.1" placeholder="0 jika tanpa bunga" value={formData.bunga} onChange={(e) => setFormData({...formData, bunga: e.target.value})} className="dark:bg-slate-950 dark:border-slate-700" />
          </div>
          <div className="space-y-2">
            <Label className="dark:text-slate-300">Lama (Bulan)</Label>
            <Input type="number" min="1" placeholder="Contoh: 12" value={formData.lamaBulan} onChange={(e) => setFormData({...formData, lamaBulan: e.target.value})} required className="dark:bg-slate-950 dark:border-slate-700" />
          </div>
        </div>

        <Button type="submit" disabled={submitting} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold mt-2">
          {submitting ? 'Menghitung...' : 'Hitung & Simpan'}
        </Button>
      </form>
    </DialogContent>
  );
}