import React from 'react';

export default function LandingContact() {
  return (
    <section id="contact" className="bg-white dark:bg-slate-900 py-16 md:py-20 transition-colors duration-500">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Hubungi Kami</h2>
          <p className="text-base md:text-lg text-gray-600 dark:text-slate-400 mb-8">
            Punya pertanyaan atau saran? Kami siap membantu!
          </p>
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-base md:text-lg">
              <span className="font-semibold">Email:</span>
              <a href="mailto:supportfinteen@gmail.com" className="text-emerald-600 dark:text-emerald-400 hover:underline">
                supportfinteen@gmail.com
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
