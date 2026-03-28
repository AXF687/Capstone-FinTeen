import { useState, useEffect, useCallback } from "react";
import dashboardService from "../services/dashboardService";

const useDashboard = (bulan, tahun) => {
    const [summary, setSummary] = useState({ income: 0, expense: 0, balance: 0 });
    const [chartData, setChartData] = useState([]);
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboard = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const data = await dashboardService.getDashboardData(bulan, tahun);

            // 1. Set Ringkasan (Summary)
            setSummary({
                income: data.totalPemasukan || 0,
                expense: data.totalPengeluaran || 0,
                balance: data.saldo || 0,
            });

            // 2. Set Data Grafik Recharts
            setChartData([
                {
                    name: "Total Arus Kas",
                    pemasukan: data.totalPemasukan || 0,
                    pengeluaran: data.totalPengeluaran || 0,
                },
            ]);

            // 3. Set Insights / Pesan AI
            setInsights(data.insights || []);

        } catch (err) {
            console.error('Error fetching dashboard:', err);
            setError(err.message || 'Gagal memuat data dashboard');
        } finally {
            setLoading(false);
        }
     
    }, [bulan, tahun]); 

    useEffect(() => {
        fetchDashboard();
    }, [fetchDashboard]);

    return {
        summary,
        chartData,
        insights,
        loading,
        error,
        refresh: fetchDashboard,
    };
};

export default useDashboard;