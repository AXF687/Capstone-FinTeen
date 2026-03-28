import { useState, useEffect, useCallback } from "react";
import transaksiService from "../services/transaksiService";
import { toast } from "sonner";

const useTransaksi = (initialFilter = {}) => {
    const now = new Date();

    // FILTER
    const [filter, setFilterState] = useState({
        bulan: String(now.getMonth() + 1).padStart(2, '0'),
        tahun: String(now.getFullYear()),
        ...initialFilter,
    });

    // DATA
    const [transaksi, setTransaksi] = useState([]);
    const [summary, setSummary] = useState({
        pemasukan: 0,
        pengeluaran: 0,
        sisa: 0
    });

    // STATE
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // PAGINATION
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // FETCH DATA
    const fetchTransaksi = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await transaksiService.getAll({
                ...filter,
                page,
                limit: 5
            });

            if (response && response.transactions) {
                setTransaksi(response.transactions);
                setTotalPages(response.totalPages || 1);
                
                const summaryData = transaksiService.getSummary(response.transactions);
                setSummary(summaryData);
            } else {
                setTransaksi([]);
                setTotalPages(1);
                setSummary({ pemasukan: 0, pengeluaran: 0, sisa: 0 });
            }
        } catch (err) {
            setError(err.message || "Gagal memuat data transaksi");
            setTransaksi([]);
            setTotalPages(1);
        } finally {
            setLoading(false);
        }
    }, [filter, page]);

    useEffect(() => {
        fetchTransaksi();
    }, [fetchTransaksi]);

    // TAMBAH
    const Tambah = async (formData) => {
        setSubmitting(true);
        try {
            await transaksiService.create(formData);
            await fetchTransaksi();
            return { success: true };
        } catch (err) {
            setError(err.message || "Gagal menambahkan transaksi");
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // UPDATE
    const ubah = async (id, formData) => {
        setSubmitting(true);
        try {
            await transaksiService.update(id, formData);
            await fetchTransaksi();
            return { success: true };
        } catch (err) {
            setError(err.message || "Gagal mengubah transaksi");
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // DELETE
    const hapus = async (id) => {
        setSubmitting(true);
        try {
            await transaksiService.delete(id);
            await fetchTransaksi();
            return { success: true };
        } catch (err) {
            setError(err.message || "Gagal menghapus transaksi");
            throw err;
        } finally {
            setSubmitting(false);
        }
    };

    // FILTER + RESET PAGE
    const setFilter = (newFilter) => {
        setPage(1); 
        setFilterState(prev => ({
            ...prev,
            ...newFilter
        }));
    };

    // EXPORT TO CSV
    const exportCSV = async () => {
        const toastId = toast.loading("Menyiapkan file CSV...");
        try {
            const response = await transaksiService.getAll({
                ...filter,
                page: 1,
                limit: 10000 
            });

            const dataToExport = response.transactions || [];

            if (dataToExport.length === 0) {
                toast.error("Tidak ada transaksi untuk diekspor pada bulan ini.", { id: toastId });
                return;
            }

            // Bikin Header CSV
            const headers = ["Tanggal", "Tipe", "Kategori", "Nominal", "Catatan"];
            const csvRows = [headers.join(",")];

            // Bikin Isi Data
            dataToExport.forEach((trx) => {
                const tanggal = new Date(trx.tanggal).toISOString().split("T")[0]; // YYYY-MM-DD
                const tipe = trx.tipe;
                const kategori = trx.kategori;
                const nominal = trx.nominal;
                const catatan = trx.catatan ? `"${trx.catatan.replace(/"/g, '""').replace(/\n/g, ' ')}"` : '""';

                csvRows.push([tanggal, tipe, kategori, nominal, catatan].join(","));
            });

            // Konversi ke Blob & Download
            const csvString = csvRows.join("\n");
            const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
            const url = window.URL.createObjectURL(blob);
            
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `FinTeen_Transaksi_${filter.bulan}_${filter.tahun}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("File CSV berhasil diunduh! 🎉", { id: toastId });
        } catch (error) {
            console.error("Gagal export CSV:", error);
            toast.error("Gagal mengunduh file CSV.", { id: toastId });
        }
    };

    return {
        transaksi,
        summary,
        filter,
        page,
        setPage,
        totalPages,
        loading,
        error,
        submitting,
        setFilter,
        Tambah,
        ubah,
        hapus,
        reFetch: fetchTransaksi,
        exportCSV
    };
};

export default useTransaksi;