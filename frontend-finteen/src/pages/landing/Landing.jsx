import { useState, useEffect } from 'react';

import LandingNavbar from './LandingNavbar';
import LandingHero from './LandingHero';
import LandingFeatures from './LandingFeatures';
import LandingAbout from './LandingAbout';
import LandingContact from './LandingContact';
import LandingCTA from './LandingCTA';
import LandingFooter from './LandingFooter';

export default function Landing() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    document.title = "FinTeen - Smart Budgeting untuk Anak Muda";
    const savedTheme = localStorage.getItem('finteen-theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDark(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('finteen-theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('finteen-theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 dark:from-slate-950 dark:to-slate-900 transition-colors duration-500 text-slate-900 dark:text-slate-100 font-sans">
      <LandingNavbar isDark={isDark} toggleTheme={toggleTheme} />
      <LandingHero />
      <LandingFeatures />
      <LandingAbout />
      <LandingContact />
      <LandingCTA />
      <LandingFooter />
    </div>
  );
}