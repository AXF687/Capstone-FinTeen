import api from "./api";

const dashboardService = {
    getDashboardData: async (bulan, tahun) => {
        const params = new URLSearchParams();
      
        if (bulan) params.append('bulan', bulan);
        if (tahun) params.append('tahun', tahun);

        const res = await api.get(`/analisis?${params.toString()}`);
        return res.data; 
    }
};

export default dashboardService;