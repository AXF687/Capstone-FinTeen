/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import useHutang from '../../hooks/useHutang';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { motion } from 'motion/react';

import HutangHeader from './HutangHeader';
import HutangFormModal from './HutangFormModal';
import HutangHasilBox from './HutangHasilBox';
import HutangListRiwayat from './HutangListRiwayat';

export default function Hutang() {
  const { riwayatList, submitting, hitungDanSimpan, hapusRiwayat } = useHutang();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ nominal: '', bunga: '', lamaBulan: '', tempatHutang: '' });
  const [displayNominal, setDisplayNominal] = useState('');
  const [hasilTerbaru, setHasilTerbaru] = useState(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  useEffect(() => {
    document.title = "Simulasi Cicilan - FinTeen";
  }, []);

  const handleNominalChange = (e) => {
    let inputValue = e.target.value;
    const cleanNumber = inputValue.replace(/\D/g, '');

    if (cleanNumber === '') {
      setDisplayNominal('');
      setFormData({ ...formData, nominal: '' });
      return;
    }

    const formattedDisplay = new Intl.NumberFormat('id-ID').format(cleanNumber);
    setDisplayNominal(formattedDisplay); 
    setFormData({ ...formData, nominal: cleanNumber }); 
  };

  const handleSimpan = async (e) => {
    e.preventDefault();
    
    if (formData.nominal <= 0 || formData.lamaBulan <= 0) {
      toast.error("Nominal pinjaman dan lama bulan harus lebih dari 0");
      return;
    }

    const dataKirim = {
        ...formData,
        bunga: formData.bunga === '' ? 0 : Number(String(formData.bunga).replace(',', '.'))
    };

    try {
      const hasil = await hitungDanSimpan(dataKirim);
      setHasilTerbaru(hasil.data || hasil);
      setIsModalOpen(false);
      toast.success("Simulasi berhasil dihitung!");
    } catch (error) {
      toast.error("Terjadi kesalahan saat menghitung simulasi.");
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  const resetSimulasi = () => {
    setHasilTerbaru(null);
    setFormData({ nominal: '', bunga: '', lamaBulan: '', tempatHutang: '' });
    setDisplayNominal(''); 
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await hapusRiwayat(selectedId);
      if (hasilTerbaru && hasilTerbaru._id === selectedId) {
        setHasilTerbaru(null);
      }
      setIsDeleteOpen(false);
      toast.success("Riwayat simulasi berhasil dihapus.");
    } catch (error) {
      toast.error("Gagal menghapus riwayat.");
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 transition-colors duration-300">
      
      <motion.div variants={itemVariants}>
        <HutangHeader isModalOpen={isModalOpen} setIsModalOpen={setIsModalOpen}>
          <HutangFormModal 
            handleSimpan={handleSimpan}
            displayNominal={displayNominal}
            handleNominalChange={handleNominalChange}
            formData={formData}
            setFormData={setFormData}
            submitting={submitting}
          />
        </HutangHeader>
      </motion.div>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[400px] dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <DialogTitle>Hapus Riwayat Simulasi</DialogTitle>
            <DialogDescription className="text-slate-500">Apakah kamu yakin ingin menghapus riwayat ini? Data yang dihapus tidak dapat dikembalikan.</DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)} className="dark:text-slate-300 dark:border-slate-700">Batal</Button>
            <Button onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">Ya, Hapus</Button>
          </div>
        </DialogContent>
      </Dialog>

      <motion.div variants={itemVariants}>
        <HutangHasilBox 
          hasilTerbaru={hasilTerbaru}
          riwayatList={riwayatList}
          resetSimulasi={resetSimulasi}
          formatRupiah={formatRupiah}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <HutangListRiwayat 
          riwayatList={riwayatList}
          formatRupiah={formatRupiah}
          openDeleteModal={openDeleteModal}
        />
      </motion.div>

    </motion.div>
  );
}