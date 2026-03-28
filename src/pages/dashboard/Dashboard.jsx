import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/useAuthStore";
import useDashboard from "../../hooks/useDashboard"; 
// eslint-disable-next-line no-unused-vars
import { motion } from "motion/react";

import DashboardHeader from "./DashboardHeader";
import DashboardInsights from "./DashboardInsights";
import DashboardSummary from "./DashboardSummary";
import DashboardChart from "./DashboardChart";
import DashboardQuickActions from "./DashboardQuickActions";
import DashboardProfile from "./DashboardProfile";

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();
  
  const [filterBulan, setFilterBulan] = useState(currentMonth);
  const [filterTahun, setFilterTahun] = useState(currentYear);
  
  const { summary, chartData, insights, loading } = useDashboard(filterBulan, filterTahun);

  useEffect(() => {
    if (user && (!user?.profil?.status || user?.profil?.status === "lainnya")) {
      navigate("/setup-profil");
    }
  }, [user, navigate]);

  useEffect(() => {
    document.title = "Dashboard - FinTeen";
  }, []);

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <div className="text-center text-slate-500 dark:text-slate-400 animate-pulse font-medium">
          Menganalisis data bulan ini... 🔍
        </div>
      </div>
    );
  }

  const userProfil = user?.profil || {};

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
        <DashboardHeader 
          user={user} 
          filterBulan={filterBulan} 
          setFilterBulan={setFilterBulan} 
          filterTahun={filterTahun} 
          setFilterTahun={setFilterTahun} 
        />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardInsights insights={insights} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardSummary summary={summary} />
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardChart chartData={chartData} />
      </motion.div>

      <motion.div variants={itemVariants} className="grid md:grid-cols-3 gap-6">
        <DashboardQuickActions />
        <DashboardProfile userProfil={userProfil} />
      </motion.div>
    </motion.div>
  );
}