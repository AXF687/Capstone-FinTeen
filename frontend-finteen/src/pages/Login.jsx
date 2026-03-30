import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Loader2 } from "lucide-react";
import LogoImage from "../assets/finteenLogo.png";

export default function Login() {
  const { login, loginWithGoogleToken } = useAuth();
  const location = useLocation();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    document.title = "Login - FinTeen";
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tokenFromGoogle = urlParams.get("token");
    const errorFromGoogle = urlParams.get("error");
    const isNewUser = urlParams.get("isNew") === "true"; 

    if (tokenFromGoogle) {
      window.history.replaceState({}, document.title, "/login");
      loginWithGoogleToken(tokenFromGoogle, isNewUser);
    }

    if (errorFromGoogle) {
      window.history.replaceState({}, document.title, "/login");
      if (errorFromGoogle === "email_exists") {
        toast.error("Email sudah terdaftar! Silakan langsung login pakai password.", { id: "google-err-exist" });
      } else {
        toast.error("Login dengan Google gagal atau dibatalkan.", { id: "google-err-fail" });
      }
    }
  }, [location, loginWithGoogleToken]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      await login({ email: formData.email, password: formData.password });
      toast.success("Login berhasil!", { id: "login-success" });
    } catch (error) {
      const pesanError = error.response?.data?.message || "Gagal login. Periksa email dan password.";
      setErrorMsg(pesanError);
      toast.error(pesanError, { id: "login-err" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    const apiUrl = "https://capstone-finteen-production.up.railway.app/api";
    window.location.href = `${apiUrl}/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-500 relative font-sans">
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <Link to="/">
          <Button variant="ghost" size="icon" className="text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-lg border-blue-100 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-500 z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            <img src={LogoImage} alt="Logo FinTeen" className="w-14 h-14 object-contain" />
            <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">FinTeen</h1>
          </div>
          <CardTitle className="text-2xl dark:text-slate-100 transition-colors">Selamat Datang Kembali</CardTitle>
          <CardDescription className="dark:text-slate-400 transition-colors">Login untuk melanjutkan mengelola keuanganmu</CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-center transition-colors">{errorMsg}</div>}

            <div className="space-y-2">
              <Label htmlFor="email" className="dark:text-slate-300 transition-colors">Email</Label>
              <Input id="email" type="email" placeholder="nama@email.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus-visible:ring-emerald-500 transition-colors" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="dark:text-slate-300 transition-colors">Password</Label>
                <Link to="/forgot-password" className="text-xs text-emerald-600 hover:underline dark:text-emerald-400 font-medium transition-colors">Lupa Password?</Link>
              </div>
              <div className="relative">
                <Input id="password" type={showPassword ? "text" : "password"} placeholder="Masukkan password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus-visible:ring-emerald-500 transition-colors pr-10" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold transition-all" disabled={loading}>
              {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Login"}
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-slate-200 dark:border-slate-700 transition-colors" /></div>
              <div className="relative flex justify-center text-xs uppercase"><span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400 transition-colors">Atau lanjut dengan</span></div>
            </div>

            <Button type="button" variant="outline" onClick={handleGoogleLogin} className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold">
              <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" /><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
              Google
            </Button>

            <p className="text-center text-sm text-slate-600 dark:text-slate-400 transition-colors pt-2">
              Belum punya akun? <Link to="/register" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium transition-colors">Daftar di sini</Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
