/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import api from '../../services/api';
import { toast } from 'sonner';
import { motion } from 'motion/react';
import confetti from 'canvas-confetti';

import TabunganHeader from './TabunganHeader';
import TabunganBanner from './TabunganBanner';
import TabunganTopupModal from './TabunganTopupModal';
import TabunganGrid from './TabunganGrid';

export default function Tabungan() {
  const { user } = useAuthStore(); 
  
  const [targetList, setTargetList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [topupAmount, setTopupAmount] = useState('');
  const [displayTopupAmount, setDisplayTopupAmount] = useState('');
  const [isTopupLoading, setIsTopupLoading] = useState(false);

  const [formData, setFormData] = useState({ nama: '', target_nominal: '', deadline_bulan: '' });
  const [displayTargetNominal, setDisplayTargetNominal] = useState('');

  const fetchTarget = async () => {
    try {
      const response = await api.get('/target-tabungan');
      if (Array.isArray(response.data)) setTargetList(response.data);
    } catch (error) {
      toast.error('Gagal mengambil data tabungan dari server.');
    }
  };

  useEffect(() => {
    document.title = "Target Tabungan - FinTeen";
    fetchTarget();
  }, []);

  const handleTargetNominalChange = (e) => {
    let inputValue = e.target.value;
    const cleanNumber = inputValue.replace(/\D/g, '');

    if (cleanNumber === '') {
      setDisplayTargetNominal('');
      setFormData({ ...formData, target_nominal: '' });
      return;
    }

    const formattedDisplay = new Intl.NumberFormat('id-ID').format(cleanNumber);
    setDisplayTargetNominal(formattedDisplay);
    setFormData({ ...formData, target_nominal: cleanNumber });
  };

  const handleTopupAmountChange = (e) => {
    let inputValue = e.target.value;
    const cleanNumber = inputValue.replace(/\D/g, '');

    if (cleanNumber === '') {
      setDisplayTopupAmount('');
      setTopupAmount('');
      return;
    }

    const formattedDisplay = new Intl.NumberFormat('id-ID').format(cleanNumber);
    setDisplayTopupAmount(formattedDisplay);
    setTopupAmount(cleanNumber);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await api.post('/target-tabungan', {
        namaTarget: formData.nama,
        nominalTarget: Number(formData.target_nominal),
        targetBulan: Number(formData.deadline_bulan),
      });
      
      setIsModalOpen(false);
      setFormData({ nama: '', target_nominal: '', deadline_bulan: '' });
      setDisplayTargetNominal('');
      
      await fetchTarget(); 
      toast.success('Target impianmu berhasil dibuat! Semangat menabung!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal membuat target tabungan');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTopup = async (e) => {
    e.preventDefault();
    
    if (!selectedTarget || !topupAmount || Number(topupAmount) <= 0) {
      toast.error('Masukkan nominal yang valid');
      return;
    }

    setIsTopupLoading(true);
    
    try {
      await api.post(`/target-tabungan/${selectedTarget._id}/topup`, { jumlah: Number(topupAmount) });
      
      setIsTopupModalOpen(false);
      setSelectedTarget(null);
      setTopupAmount('');
      setDisplayTopupAmount('');
      
      await fetchTarget();
      
      toast.success(
        <div>
          <p className="font-bold">Berhasil menabung!</p>
          <p className="text-sm">{formatRupiah(Number(topupAmount))} untuk "{selectedTarget.namaTarget}"</p>
        </div>
      );

      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10b981', '#34d399', '#fbbf24', '#3b82f6'], // Warna tema FinTeen
        zIndex: 9999
      });

    } catch (error) {
      toast.error(error.response?.data?.message || 'Gagal menambah tabungan');
    } finally {
      setIsTopupLoading(false);
    }
  };

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
  };

  const openTopupModal = (item) => {
    setSelectedTarget(item);
    setIsTopupModalOpen(true);
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
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6 transition-colors duration-300">
      
      <motion.div variants={itemVariants}>
        <TabunganHeader 
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          handleSubmit={handleSubmit}
          formData={formData}
          setFormData={setFormData}
          displayTargetNominal={displayTargetNominal}
          handleTargetNominalChange={handleTargetNominalChange}
          isLoading={isLoading}
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <TabunganBanner 
          targetBulanan={user?.profil?.target_bulanan} 
          formatRupiah={formatRupiah} 
        />
      </motion.div>

      <TabunganTopupModal 
        isTopupModalOpen={isTopupModalOpen}
        setIsTopupModalOpen={setIsTopupModalOpen}
        selectedTarget={selectedTarget}
        setSelectedTarget={setSelectedTarget}
        handleTopup={handleTopup}
        displayTopupAmount={displayTopupAmount}
        handleTopupAmountChange={handleTopupAmountChange}
        topupAmount={topupAmount}
        setTopupAmount={setTopupAmount}
        setDisplayTopupAmount={setDisplayTopupAmount}
        isTopupLoading={isTopupLoading}
        formatRupiah={formatRupiah}
      />

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <TabunganGrid 
          targetList={targetList}
          formatRupiah={formatRupiah}
          openTopupModal={openTopupModal}
        />
      </motion.div>

    </motion.div>
  );
}