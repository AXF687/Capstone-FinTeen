import { useState, useEffect, useCallback } from "react";
import hutangService from "../services/hutangService";
import { toast } from "sonner";

const useHutang = () => {
  const [riwayatList, setRiwayatList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchRiwayat = useCallback(async () => {
    setLoading(true);
    try {
      const data = await hutangService.getAll();
      setRiwayatList(data);
    } catch (err) {
      console.error("Error fetch riwayat hutang:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRiwayat();
  }, [fetchRiwayat]);

  const hitungDanSimpan = async (formData) => {
    setSubmitting(true);
    try {
      const result = await hutangService.create(formData);
      await fetchRiwayat();
      return result.data || result;
    } catch (err) {
      console.error("Error hitung hutang:", err);
      throw new Error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const hapusRiwayat = async (id) => {
    try {
      await hutangService.delete(id);
      await fetchRiwayat();
      toast.success("Riwayat berhasil dihapus.");
    } catch (err) {
      console.error("Error hapus hutang:", err);
      throw new Error("Gagal menghapus riwayat.");
    }
  };

  return {
    riwayatList,
    loading,
    submitting,
    error,
    hitungDanSimpan,
    hapusRiwayat,
    refresh: fetchRiwayat
  };
};

export default useHutang;