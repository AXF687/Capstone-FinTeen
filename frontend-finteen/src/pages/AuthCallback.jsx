import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogleToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNew") === "true";

    if (token) {
      // Proses token dari Google
      loginWithGoogleToken(token, isNewUser);
    } else {
      // Jika tidak ada token, redirect ke login
      navigate("/login?error=no_token");
    }
  }, [searchParams, navigate, loginWithGoogleToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Memproses login...</p>
      </div>
    </div>
  );
}
