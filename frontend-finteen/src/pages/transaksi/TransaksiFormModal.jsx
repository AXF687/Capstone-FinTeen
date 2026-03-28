import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function TransaksiFormModal({
  isModalOpen,
  handleModalChange,
  handleSubmit,
  formData,
  setFormData,
  displayNominal,
  handleNominalChange,
  submitting,
  isEditing 
}) {
  return (
    <Dialog open={isModalOpen} onOpenChange={handleModalChange}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold transition-colors">
          <Plus className="w-5 h-5 mr-2" />
          Tambah Transaksi
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[425px] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 transition-colors w-[90vw] rounded-xl">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit Transaksi" : "Catat Transaksi Baru"}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Tanggal</Label>
              <Input 
                type="date" 
                value={formData.tanggal}
                onChange={(e) => setFormData({...formData, tanggal: e.target.value})}
                required 
                className="dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500"
              />
            </div>
            <div className="space-y-2">
              <Label className="dark:text-slate-300">Tipe</Label>
              <select
                className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-500 transition-colors"
                value={formData.tipe}
                onChange={(e) => setFormData({...formData, tipe: e.target.value})}
              >
                <option value="pengeluaran">Pengeluaran</option>
                <option value="pemasukan">Pemasukan</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="dark:text-slate-300">Kategori</Label>
            <select
              className="flex h-10 w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-500 transition-colors"
              value={formData.kategori}
              onChange={(e) => setFormData({...formData, kategori: e.target.value})}
              required
            >
              <option value="" disabled>Pilih Kategori...</option>
              <option value="Makan">Makan & Minum</option>
              <option value="Transport">Transportasi</option>
              <option value="Hiburan">Hiburan</option>
              <option value="Uang Saku">Uang Saku / Gaji</option>
              <option value="Tabungan">Tabungan / Investasi</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label className="dark:text-slate-300">Nominal (Rp)</Label>
            <Input 
              type="text" 
              placeholder="Contoh: 50.000"
              value={displayNominal}
              onChange={handleNominalChange}
              required 
              className="dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500 font-semibold"
            />
          </div>

          <div className="space-y-2">
            <Label className="dark:text-slate-300">Catatan (Opsional)</Label>
            <Input 
              type="text" 
              placeholder="Contoh: Beli kuota internet"
              value={formData.catatan}
              onChange={(e) => setFormData({...formData, catatan: e.target.value})}
              className="dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500"
            />
          </div>

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold mt-2 transition-all" disabled={submitting}>
            {submitting ? 'Menyimpan...' : (isEditing ? 'Simpan Perubahan' : 'Simpan Transaksi')}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}