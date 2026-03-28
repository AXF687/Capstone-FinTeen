import { useState, useEffect, useCallback } from "react";
import tabunganService from "../services/tabunganService";
import { toast } from "sonner";

const useTabungan = () => {
  const [targets, setTargets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchTargets = useCallback(async () => {
    setLoading(true);
    try {
      const data = await tabunganService.getAll();
      setTargets(data);
    } catch (err) {
      console.error("Error memuat tabungan:", err);
      toast.error("Gagal memuat target tabungan.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTargets();
  }, [fetchTargets]);

  const addTarget = async (data) => {
    setSubmitting(true);
    try {
      await tabunganService.create(data);
      toast.success('Target impianmu berhasil dibuat!');
      await fetchTargets();
    } catch (err) {
      console.error('Error tambah tabungan:', err);
      toast.error('Gagal membuat target tabungan.');
    } finally {
      setSubmitting(false);
    }
  };

  const hapusTarget = async (id) => {
    setSubmitting(true);
    try {
      await tabunganService.delete(id);
      toast.success('Target berhasil dihapus!');
      await fetchTargets();
    } catch (err) {
       toast.error('Gagal menghapus target.');
    } finally {
      setSubmitting(false);
    }
  };

  const tandaiTercapai = async (id) => {
    setSubmitting(true);
    try {
      await tabunganService.updateStatus(id, "tercapai");
      toast.success('Hore! 🎉 Impianmu berhasil diwujudkan!');
      await fetchTargets(); 
    } catch (err) {
      console.error('Error update tabungan:', err);
      toast.error('Gagal mengubah status target.');
    } finally {
      setSubmitting(false);
    }
  };

 return {
    targets,
    loading,
    submitting,
    addTarget,
    hapusTarget,
    tandaiTercapai, 
    refresh: fetchTargets
  };
};

export default useTabungan;