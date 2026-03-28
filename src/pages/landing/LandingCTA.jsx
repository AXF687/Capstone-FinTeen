import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

export default function LandingCTA() {
  return (
    <section className="bg-gradient-to-r from-emerald-600 to-emerald-700 dark:from-emerald-800 dark:to-slate-900 py-16 md:py-20 transition-colors duration-500">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Siap Mengelola Keuangan dengan Lebih Baik?
        </h2>
        <p className="text-lg md:text-xl text-emerald-50 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
          Bergabunglah untuk merasakan pengalaman pengelolaan keuangan dengan mudah dan menyenangkan!
        </p>
        <Link to="/register">
          <Button size="lg" variant="secondary" className="w-full sm:w-auto text-lg px-8 text-emerald-700 dark:text-slate-900 dark:bg-emerald-400 dark:hover:bg-emerald-300 border-none font-bold">
            Daftar Sekarang
          </Button>
        </Link>
      </div>
    </section>
  );
}