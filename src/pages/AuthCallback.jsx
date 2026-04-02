import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithGoogleToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const isNewUser = searchParams.get("isNew") === "true";
    const error = searchParams.get("error");

    if (error) {
      navigate("/login?error=google_failed", { replace: true });
      return;
    }

    if (token) {
      loginWithGoogleToken(token, isNewUser);
    } else {
      navigate("/login", { replace: true });
    }
  }, [searchParams, navigate, loginWithGoogleToken]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-4" />
        <p className="text-slate-600">Memproses login...</p>
      </div>
    </div>
  );
}