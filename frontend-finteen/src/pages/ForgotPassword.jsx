import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api'; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, ArrowLeft, MailCheck, Loader2 } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSent, setIsSent] = useState(false); 

  useEffect(() => {
    document.title = "Lupa Password - FinTeen";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setIsSent(true);
      toast.success("Link reset password berhasil dikirim!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengirim email. Pastikan email terdaftar.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-500 relative font-sans">
      
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <Link to="/login">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-lg border-blue-100 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-500 z-10 overflow-hidden">
        
        {/* TAMPILAN 1: Form Input Email */}
        {!isSent ? (
          <>
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Wallet className="h-8 w-8 text-emerald-600 dark:text-emerald-500 transition-colors" />
                <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 transition-colors">FinTeen</span>
              </div>
              <CardTitle className="text-2xl dark:text-slate-100 transition-colors">Lupa Password?</CardTitle>
              <CardDescription className="dark:text-slate-400 transition-colors px-4 mt-2">
                Jangan panik. Masukkan email yang terdaftar, dan kami akan mengirimkan link untuk mereset password kamu.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
                <div className="space-y-2">
                  <Label htmlFor="email" className="dark:text-slate-300 transition-colors">Email Terdaftar</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoFocus
                    className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus-visible:ring-emerald-500 transition-colors h-12"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold transition-all h-11 mt-2" 
                  disabled={loading || !email}
                >
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Mengirim...</> : 'Kirim Link Reset'}
                </Button>
              </form>
            </CardContent>
          </>
        ) : (
          /* TAMPILAN 2: Sukses Terkirim */
          <div className="py-12 px-6 text-center animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-emerald-500">
              <MailCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-2">Cek Email Kamu!</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
              Kami telah mengirimkan link instruksi untuk mereset password ke <strong>{email}</strong>. Silakan periksa kotak masuk atau folder spam kamu.
            </p>
            <Link to="/login">
              <Button variant="outline" className="w-full dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                Kembali ke Login
              </Button>
            </Link>
          </div>
        )}
      </Card>
    </div>
  );
}