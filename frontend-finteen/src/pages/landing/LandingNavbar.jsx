import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sun, Moon } from 'lucide-react';
import LogoImage from "../../assets/finteenLogo.png";

export default function LandingNavbar({ isDark, toggleTheme }) {
  return (
    <nav className="border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-sm sticky top-0 z-50 transition-colors duration-500">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <img src={LogoImage} alt="Logo FinTeen" className="w-13 h-13 object-contain" />
          <span className="text-xl md:text-2xl font-bold text-emerald-600 dark:text-emerald-500">FinTeen</span>
        </div>

        <div className="hidden md:flex items-center gap-6">
          <a href="#home" className="hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors font-semibold">Home</a>
          <a href="#features" className="hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors font-semibold">Fitur</a>
          <a href="#about" className="hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors font-semibold">Tentang</a>
          <a href="#contact" className="hover:text-emerald-600 dark:text-slate-300 dark:hover:text-emerald-400 transition-colors font-semibold">Kontak</a>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700 transition-colors"
            title="Ganti Tema"
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link to="/login" className="hidden sm:block">
            <Button variant="ghost" className="font-semibold dark:text-slate-200 dark:hover:text-emerald-400 dark:hover:bg-slate-800">Login</Button>
          </Link>
          <Link to="/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 font-semibold text-white">Daftar</Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}