import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { motion } from 'motion/react';

export default function LandingHero() {
  return (
    <section id="home" className="container mx-auto px-4 py-16 md:py-24 text-center overflow-hidden">
      <motion.h1 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent"
      >
        Kelola Keuangan,<br />Raih Impian!
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className="text-lg md:text-xl text-gray-600 dark:text-slate-400 mb-8 max-w-2xl mx-auto px-4"
      >
        Platform manajemen keuangan yang dirancang untuk generasi muda agar dapat mengelola keuangan mereka dengan lebih bijak sehingga terealisasi kestabilan ekonomi. 
        Belajar mengelola uang dengan bijak sejak dini.
      </motion.p>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4 px-4"
      >
        <Link to="/register" className="w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" className="w-full text-lg px-8 bg-emerald-600 hover:bg-emerald-700 text-white">
              Mulai Mencoba
            </Button>
          </motion.div>
        </Link>
        <a href="#features" className="w-full sm:w-auto">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button size="lg" variant="outline" className="w-full text-lg px-8 text-emerald-600 border-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:border-emerald-500 dark:hover:bg-slate-800 dark:bg-transparent">
              Pelajari Lebih Lanjut
            </Button>
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}