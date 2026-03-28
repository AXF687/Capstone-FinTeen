import { useState, useEffect } from 'react';
import useTransaksi from '../../hooks/useTransaksi';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import { Download } from 'lucide-react'; 
import { Button } from '@/components/ui/button'; 

import TransaksiHeader from './TransaksiHeader';
import TransaksiFormModal from './TransaksiFormModal';
import TransaksiList from './TransaksiList';

export default function Transaksi() {
  const { 
    transaksi, 
    submitting, 
    Tambah, 
    hapus,
    ubah, 
    page,
    setPage,
    totalPages,
    loading,
    exportCSV 
  } = useTransaksi();

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [formData, setFormData] = useState({
    tanggal: '', tipe: 'pengeluaran', kategori: '', nominal: '', catatan: ''
  });
  const [displayNominal, setDisplayNominal] = useState('');

  useEffect(() => {
    document.title = "Riwayat Transaksi - FinTeen";
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

  const openEditModal = (trx) => {
    setIsEditing(true);
    setEditId(trx._id);
    const formattedDate = new Date(trx.tanggal).toISOString().split('T')[0];
    setFormData({
      tanggal: formattedDate, tipe: trx.tipe, kategori: trx.kategori, nominal: trx.nominal, catatan: trx.catatan || ''
    });
    setDisplayNominal(new Intl.NumberFormat('id-ID').format(trx.nominal));
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ tanggal: '', tipe: 'pengeluaran', kategori: '', nominal: '', catatan: '' });
    setDisplayNominal('');
  };

  const handleModalChange = (open) => {
    setIsModalOpen(open);
    if (!open) resetForm(); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await ubah(editId, formData);
        toast.success("Transaksi berhasil diperbarui");
      } else {
        await Tambah(formData); 
        toast.success("Transaksi berhasil dicatat");
      }
      setIsModalOpen(false);
      resetForm();
    } catch (error) {
      toast.error(error?.message || error || "Gagal menyimpan transaksi");
    }
  };

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsDeleteOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await hapus(selectedId);
      toast.success("Transaksi berhasil dihapus");
      setIsDeleteOpen(false);
    } catch (error) {
      toast.error("Gagal menghapus transaksi");
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka);
  };

  const formatDateString = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
  };

  const goToPage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 transition-colors duration-300">
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <TransaksiHeader />
        
        <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
          
          <Button 
            onClick={exportCSV}
            variant="outline" 
            className="w-full sm:w-auto bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm"
          >
            <Download className="w-4 h-4 mr-2" />
            Unduh CSV
          </Button>

          <TransaksiFormModal 
            isModalOpen={isModalOpen}
            handleModalChange={handleModalChange}
            handleSubmit={handleSubmit}
            formData={formData}
            setFormData={setFormData}
            displayNominal={displayNominal}
            handleNominalChange={handleNominalChange}
            submitting={submitting}
            isEditing={isEditing}
          />
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <TransaksiList 
          transaksi={transaksi}
          loading={loading}
          openDeleteModal={openDeleteModal}
          openEditModal={openEditModal} 
          isDeleteOpen={isDeleteOpen}
          setIsDeleteOpen={setIsDeleteOpen}
          confirmDelete={confirmDelete}
          formatDateString={formatDateString}
          formatRupiah={formatRupiah}
          page={page}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      </motion.div>
    </motion.div>
  );
}