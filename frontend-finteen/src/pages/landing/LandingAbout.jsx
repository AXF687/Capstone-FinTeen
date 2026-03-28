import React from 'react';

export default function LandingAbout() {
  return (
    <section id="about" className="py-16 md:py-20 dark:bg-slate-950">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Tentang FinTeen</h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 mb-6">
            FinTeen adalah platform manajemen keuangan yang dirancang khusus untuk generasi muda. 
            Kami percaya bahwa literasi keuangan harus dimulai sejak dini, dan kami hadir untuk 
            membuat pengelolaan keuangan menjadi mudah dan menyenangkan.
          </p>
          <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 mb-6">
            Dengan fitur-fitur yang intuitif dan analisis, FinTeen membantu kamu 
            membuat keputusan keuangan yang lebih baik, memastikan kestabilan ekonomi, dan mencapai 
            target tabungan dengan lebih mudah.
          </p>
        </div>
      </div>
    </section>
  );
}