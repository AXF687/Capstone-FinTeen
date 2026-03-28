import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import useAuth from "../hooks/useAuth";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCog, Sparkles, ArrowLeft } from "lucide-react"; 
import { toast } from "sonner";

export default function SetupProfil() {
  const { setupProfil } = useAuth();
  const navigate = useNavigate(); 

  const [status, setStatus] = useState("");
  const [saldoAwal, setSaldoAwal] = useState("");
  const [target, setTarget] = useState("");

  const [displaySaldoAwal, setDisplaySaldoAwal] = useState("");
  const [displayTarget, setDisplayTarget] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    document.title = "Lengkapi Profil - FinTeen";
    const savedTheme = localStorage.getItem("finteen-theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const handleRupiahChange = (e, fieldName) => {
    const rawValue = e.target.value.replace(/\D/g, "");
    const formattedValue = rawValue
      ? new Intl.NumberFormat("id-ID").format(rawValue)
      : "";

    if (fieldName === "saldoAwal") {
      setDisplaySaldoAwal(formattedValue);
      setSaldoAwal(rawValue);
    } else {
      setDisplayTarget(formattedValue);
      setTarget(rawValue);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsLoading(true);

    try {
      await setupProfil({
        status,
        saldo_awal: Number(saldoAwal),
        target_bulanan: target ? Number(target) : 0,
      });

      toast.success(
        "Profil & Saldo Awal berhasil disimpan! Selamat datang di Dashboard.",
      );
    } catch (error) {
      const pesanError =
        error.response?.data?.message || "Gagal menyimpan profil.";
      setErrorMsg(pesanError);
      toast.error(pesanError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 transition-colors duration-500 font-sans">
      <Card className="w-full max-w-lg shadow-lg border-emerald-100 dark:border-slate-800 dark:bg-slate-900 rounded-2xl overflow-hidden transition-colors duration-500">
        
        <CardHeader className="text-center space-y-2 pb-6 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 transition-colors relative">
          
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="absolute left-4 top-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
            title="Kembali"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div className="flex justify-center mb-2">
            <div className="p-3 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-full transition-colors">
              <UserCog className="w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
            Lengkapi Profilmu
          </CardTitle>
          <CardDescription className="text-base text-slate-500 dark:text-slate-400 transition-colors">
            Satu langkah lagi! Atur saldo awalmu untuk mulai melacak keuangan di
            FinTeen.
          </CardDescription>
        </CardHeader>

        <form
          onSubmit={handleSubmit}
          className="bg-slate-50/50 dark:bg-slate-900/50 transition-colors"
        >
          <CardContent className="space-y-6 pt-6">
            {errorMsg && (
              <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg text-center font-medium transition-colors">
                {errorMsg}
              </div>
            )}

            <div className="space-y-2">
              <Label
                htmlFor="status"
                className="text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                Status Saat Ini{" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </Label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                className="flex h-11 w-full rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 px-3 py-2 text-sm text-slate-700 dark:text-slate-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 dark:focus-visible:ring-emerald-500 transition-all"
              >
                <option value="" disabled>
                  Pilih Status...
                </option>
                <option value="pelajar">Pelajar</option>
                <option value="mahasiswa">Mahasiswa</option>
                <option value="pekerja">Pekerja Muda</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="saldoAwal"
                className="text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                Saldo Awal (Rp){" "}
                <span className="text-red-500 dark:text-red-400">*</span>
              </Label>
              <Input
                id="saldoAwal"
                type="text"
                placeholder="Contoh: 1.500.000"
                value={displaySaldoAwal}
                onChange={(e) => handleRupiahChange(e, "saldoAwal")}
                required
                className="h-11 rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500 transition-colors font-medium"
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 transition-colors">
                Uang yang kamu miliki saat ini di dompet atau rekening.
              </p>
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="target"
                className="text-slate-700 dark:text-slate-300 font-semibold transition-colors"
              >
                Target Tabungan Bulanan (Rp){" "}
                <span className="text-slate-400 dark:text-slate-500 font-normal">
                  (Opsional)
                </span>
              </Label>
              <Input
                id="target"
                type="text"
                placeholder="Contoh: 300.000"
                value={displayTarget}
                onChange={(e) => handleRupiahChange(e, "target")}
                className="h-11 rounded-lg text-slate-700 dark:text-slate-200 dark:bg-slate-950 dark:border-slate-700 dark:focus-visible:ring-emerald-500 transition-colors"
              />
              <p className="text-xs text-slate-500 dark:text-slate-500 transition-colors">
                Berapa yang ingin kamu sisihkan untuk ditabung tiap bulan?
              </p>
            </div>
          </CardContent>

          <CardFooter className="pb-6 px-6 mt-6">
            <Button
              type="submit"
              className="w-full h-12 text-md bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-semibold rounded-xl transition-all"
              disabled={isLoading}
            >
              {isLoading ? (
                "Menyimpan..."
              ) : (
                <span className="flex items-center gap-2">
                  Simpan & Lanjutkan <Sparkles className="w-4 h-4" />
                </span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
