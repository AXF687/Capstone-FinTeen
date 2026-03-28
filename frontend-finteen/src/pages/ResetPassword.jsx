import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import api from '../services/api'; 

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Wallet, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function ResetPassword() {
  const { token } = useParams(); // Mengambil token dari URL
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    document.title = "Reset Password - FinTeen";
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Manual di Frontend
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter!");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    setLoading(true);

    try {
      await api.put(`/auth/reset-password/${token}`, { password: formData.password });
      toast.success("Password berhasil diubah! Silakan login.");
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.message || "Token reset tidak valid atau sudah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-500 font-sans">
      
      <Card className="w-full max-w-md shadow-lg border-blue-100 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-500 z-10">
        
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Wallet className="h-8 w-8 text-emerald-600 dark:text-emerald-500 transition-colors" />
            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 transition-colors">FinTeen</span>
          </div>
          <CardTitle className="text-2xl dark:text-slate-100 transition-colors">Buat Password Baru</CardTitle>
          <CardDescription className="dark:text-slate-400 transition-colors mt-2 px-2">
            Silakan masukkan password baru kamu. Pastikan menggunakan kombinasi yang kuat dan mudah diingat.
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-300">
            
            <div className="space-y-2">
              <Label htmlFor="password" className="dark:text-slate-300 transition-colors">Password Baru</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Minimal 6 karakter"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus-visible:ring-emerald-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="dark:text-slate-300 transition-colors">Konfirmasi Password Baru</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Ulangi password baru"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus-visible:ring-emerald-500 transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold transition-all h-11 mt-2" 
              disabled={loading}
            >
              {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : 'Simpan Password Baru'}
            </Button>
            
            <div className="text-center mt-4">
               <Link to="/login" className="text-sm text-slate-500 hover:text-emerald-600 dark:text-slate-400 dark:hover:text-emerald-400 transition-colors">
                 Batal dan kembali ke Login
               </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}