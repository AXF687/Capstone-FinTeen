import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../services/authService";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, ShieldCheck, Loader2 } from "lucide-react";
import LogoImage from "../assets/finteenLogo.png";

export default function Register() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    document.title = "Register - FinTeen";
  }, []);

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      toast.error("Password minimal 6 karakter!", { id: "reg-val-pass" });
      return;
    }
    if (!formData.email.endsWith("@gmail.com")) {
      toast.error("Pendaftaran wajib menggunakan akun @gmail.com!", { id: "reg-val-email" });
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await authService.requestOtp(formData);
      toast.success("Kode OTP telah dikirim ke email Anda!", { id: "otp-sent" });
      setStep(2); 
    } catch (error) {
      const pesanError = error.response?.data?.message || "Gagal mengirim OTP.";
      setErrorMsg(pesanError);
      toast.error(pesanError, { id: "otp-err" });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpCode = otp.join("");
    
    if (otpCode.length < 6) {
      return toast.error("Masukkan 6 digit kode OTP secara lengkap!", { id: "otp-val-len" });
    }

    setLoading(true);
    setErrorMsg("");

    try {
      await authService.verifyOtp({ email: formData.email, otp: otpCode });
      toast.success("Akun berhasil dibuat!", { id: "reg-success" });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      const pesanError = error.response?.data?.message || "OTP salah atau kadaluarsa.";
      setErrorMsg(pesanError);
      toast.error(pesanError, { id: "otp-fail" });
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1); 
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleGoogleRegister = () => {
    const apiUrl = "https://capstone-finteen-production.up.railway.app/api";
    window.location.href = `${apiUrl}/auth/google?state=register`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-500 relative font-sans">
    
      <div className="absolute top-4 left-4 sm:top-6 sm:left-6 z-10">
        <Link to="/login">
          <Button
            variant="ghost"
            size="icon"
            className="text-slate-500 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800 rounded-full transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
      </div>

      <Card className="w-full max-w-md shadow-lg border-blue-100 dark:border-slate-800 dark:bg-slate-900 transition-colors duration-500 z-10">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-1 mb-3">
            <img src={LogoImage} alt="Logo FinTeen" className="w-14 h-14 object-contain" />
            <h1 className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
              FinTeen
            </h1>
          </div>
          <CardTitle className="text-2xl dark:text-slate-100 transition-colors">
            {step === 1 ? "Buat Akun Baru" : "Verifikasi Email"}
          </CardTitle>
          <CardDescription className="dark:text-slate-400 transition-colors">
            {step === 1 
              ? "Mulai kelola keuanganmu dengan lebih cerdas" 
              : "Masukkan 6 digit kode yang dikirim ke email Anda"
            }
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMsg && (
            <div className="mb-4 p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-center transition-colors">
              {errorMsg}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nama" className="dark:text-slate-300 transition-colors">Nama Lengkap</Label>
                <Input
                  id="nama"
                  type="text"
                  placeholder="Nama Lengkap Kamu"
                  value={formData.nama}
                  onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                  required
                  className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus-visible:ring-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="dark:text-slate-300 transition-colors">Email (Wajib @gmail.com)</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 dark:focus-visible:ring-emerald-500 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="dark:text-slate-300 transition-colors">Password</Label>
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
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 focus:outline-none transition-colors"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold transition-all" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Daftar Sekarang"}
              </Button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-slate-200 dark:border-slate-700 transition-colors" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-slate-900 px-2 text-slate-500 dark:text-slate-400 transition-colors">
                    Atau daftar dengan
                  </span>
                </div>
              </div>

              <Button type="button" variant="outline" onClick={handleGoogleRegister} className="w-full bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-semibold">
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Google
              </Button>

              <p className="text-center text-sm text-slate-600 dark:text-slate-400 transition-colors pt-2">
                Sudah punya akun?{" "}
                <Link to="/login" className="text-emerald-600 dark:text-emerald-400 hover:underline font-medium transition-colors">
                  Masuk di sini
                </Link>
              </p>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-6">
              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <ShieldCheck className="w-8 h-8 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    ref={(el) => (inputRefs.current[index] = el)}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 text-center text-2xl font-bold bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 focus:outline-none dark:bg-slate-950 dark:border-slate-700 dark:text-white transition-all shadow-sm"
                  />
                ))}
              </div>

              <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11" disabled={loading}>
                {loading ? <Loader2 className="w-5 h-5 animate-spin mx-auto" /> : "Verifikasi & Masuk"}
              </Button>

              <div className="text-center mt-4">
                <button 
                  type="button"
                  onClick={() => setStep(1)} 
                  className="inline-flex items-center text-sm text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4 mr-1" /> Salah ketik email? Kembali
                </button>
              </div>
            </form>
          )}

        </CardContent>
      </Card>
    </div>
  );
}
