import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowRightLeft,
  Calculator,
  Target,
  PieChart,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import LogoImage from "../assets/finteenLogo.png";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const menuItems = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transaksi", path: "/transaksi", icon: ArrowRightLeft },
  { name: "Simulasi Hutang", path: "/hutang", icon: Calculator },
  { name: "Tabungan", path: "/tabungan", icon: Target },
  { name: "Analisis", path: "/analisis", icon: PieChart },
];

export default function Sidebar({ closeMobileMenu }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();
 
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Dari useAuthStore
    // 🌟 TAMBAHKAN BARIS INI:
    localStorage.removeItem('token'); 
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 w-64 transition-colors duration-300">
 
      <div className="p-6 flex gap-1 mb-2 items-center">
        <img src={LogoImage} alt="Logo FinTeen" className="w-14 h-14 object-contain" />
        <div className="flex flex-col">
          <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">FinTeen</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">Smart Budgeting</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={closeMobileMenu}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium ${
                isActive
                  ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 font-semibold"
                  : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <button
          onClick={() => setIsLogoutOpen(true)}
          className="flex items-center w-full gap-3 px-4 py-3 text-red-600 dark:text-red-400 transition-colors rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 font-medium"
        >
          <LogOut className="w-5 h-5" />
          <span>Keluar</span>
        </button>
      </div>

      <Dialog open={isLogoutOpen} onOpenChange={setIsLogoutOpen}>
        <DialogContent className="sm:max-w-[400px] dark:bg-slate-900 dark:border-slate-800 dark:text-slate-100 transition-colors rounded-xl w-[90vw]">
          <DialogHeader>
            <DialogTitle className="text-xl">Konfirmasi Keluar</DialogTitle>
            <DialogDescription className="text-slate-500 dark:text-slate-400 mt-2">
              Apakah kamu yakin ingin keluar dari aplikasi FinTeen? Kamu harus login kembali untuk mencatat keuanganmu.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              variant="outline" 
              onClick={() => setIsLogoutOpen(false)}
              className="dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold transition-colors"
            >
              Ya, Keluar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}