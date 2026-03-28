import api from "./api";

const transaksiService = {
    getAll: async ({ bulan, tahun, page = 1, limit = 5 } = {}) => {
        try {
            const now = new Date();

            const params = {
                bulan: bulan || String(now.getMonth() + 1).padStart(2, '0'),
                tahun: tahun || String(now.getFullYear()),
                page,
                limit
            };

            console.log('Mengirim request ke:', `/transaksi`, { params });
            
            const res = await api.get('/transaksi', { params });
            
            console.log('Response lengkap:', res);
            console.log('Response data:', res.data);
            console.log('Total Pages dari server:', res.data?.totalPages);
            console.log('Jumlah transaksi:', res.data?.transactions?.length);
            
            return {
                transactions: res.data.transactions || [],
                totalPages: res.data.totalPages || 1,
                currentPage: res.data.currentPage || page,
                totalData: res.data.totalData || 0
            };
            
        } catch (error) {
            console.error('Error di service getAll:', error);
            throw error;
        }
    },

    create: async ({ tipe, kategori, nominal, tanggal, catatan }) => {
        try {
            const res = await api.post('/transaksi', {
                tipe,
                kategori,
                nominal: Number(nominal),
                tanggal,
                catatan: catatan || '',
            });
            return res.data;
        } catch (error) {
            console.error('Error di service create:', error);
            throw error;
        }
    },

    update: async (id, { tipe, kategori, nominal, tanggal, catatan }) => {
        try {
            const res = await api.put(`/transaksi/${id}`, {
                tipe,
                kategori,
                nominal: Number(nominal),
                tanggal,
                catatan: catatan || '',
            });
            return res.data;
        } catch (error) {
            console.error('Error di service update:', error);
            throw error;
        }
    },

    delete: async (id) => {
        try {
            const res = await api.delete(`/transaksi/${id}`);
            return res.data;
        } catch (error) {
            console.error('Error di service delete:', error);
            throw error;
        }
    },

    getSummary: (transaksiList = []) => {
        const pemasukan = transaksiList
            .filter(t => t.tipe === 'pemasukan')
            .reduce((sum, t) => sum + (Number(t.nominal) || 0), 0);
        
        const pengeluaran = transaksiList
            .filter(t => t.tipe === 'pengeluaran')
            .reduce((sum, t) => sum + (Number(t.nominal) || 0), 0);
        
        const sisa = pemasukan - pengeluaran;
        
        return { 
            pemasukan, 
            pengeluaran, 
            sisa 
        };
    },
};

export default transaksiService;