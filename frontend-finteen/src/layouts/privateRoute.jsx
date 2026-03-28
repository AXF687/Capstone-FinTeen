import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

export default function PrivateRoute() {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  // 1. CEK KTP: Jika belum login, tendang ke halaman login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // 2. CEK KELENGKAPAN: Profil dianggap belum lengkap jika status kosong atau "lainnya"
  const belumSetup = !user?.profil?.status || user?.profil?.status === "lainnya";

  // 3. CEGAT USER BARU: Jika profil BELUM lengkap, dan dia mencoba masuk ke halaman selain "/setup-profil"
  if (belumSetup && location.pathname !== "/setup-profil") {
    return <Navigate to="/setup-profil" replace />;
  }

  // 4. CEGAT USER LAMA: Jika profil SUDAH lengkap, tapi dia iseng buka halaman "/setup-profil" lagi
  if (!belumSetup && location.pathname === "/setup-profil") {
    return <Navigate to="/dashboard" replace />;
  }

  // 5. AMAN: Silakan masuk ke halaman yang dituju
  return <Outlet />;
}