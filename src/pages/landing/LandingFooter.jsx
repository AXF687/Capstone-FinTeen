import React from 'react';
import { Wallet } from 'lucide-react';
import LogoImage from "../../assets/finteenLogo.png";

export default function LandingFooter() {
  return (
    <footer className="bg-gray-900 dark:bg-slate-950 dark:border-t dark:border-slate-800 text-white py-8 transition-colors duration-500">
      <div className="container mx-auto px-4 text-center">
        <div className="flex items-center justify-center gap-1 mb-4">
          <img src={LogoImage} alt="Logo FinTeen" className="w-12 h-12 object-contain" />
          <span className="text-xl font-bold">FinTeen</span>
        </div>
        <p className="text-gray-400 dark:text-slate-500 mb-4 text-sm md:text-base">
          Platform Manajemen Keuangan untuk Generasi Muda
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 text-sm text-gray-400 dark:text-slate-500">
          <a href="#" className="hover:text-white dark:hover:text-emerald-400 transition-colors">Kebijakan Privasi</a>
          <a href="#" className="hover:text-white dark:hover:text-emerald-400 transition-colors">Syarat & Ketentuan</a>
          <a href="#" className="hover:text-white dark:hover:text-emerald-400 transition-colors">FAQ</a>
        </div>
        <p className="text-gray-500 dark:text-slate-600 text-xs md:text-sm mt-6">
          © 2026 FinTeen. All rights reserved.
        </p>
      </div>
    </footer>
  );
}