import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useAuthStore } from "./store/useAuthStore";
import { Toaster } from "@/components/ui/sonner";

// Layout & Pages
import MainLayout from "./layouts/MainLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Profil from "./pages/Profil";

import Dashboard from "./pages/dashboard/Dashboard";
import Landing from "./pages/landing/Landing";
import SetupProfil from "./pages/SetupProfil";
import Transaksi from "./pages/transaksi/Transaksi";
import Hutang from "./pages/hutang/Hutang";
import Tabungan from "./pages/tabungan/Tabungan";
import Analisis from "./pages/analisis/Analisis";

// 🌟 SATPAM DALAM (Menggunakan Ide Brilian Anda: Saldo Awal == 0)
function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // 💡 LOGIKA SANG RAJA: Jika saldo_awal = 0 atau belum ada, berarti belum setup!
  const butuhSetup =
    user?.profil?.saldo_awal === 0 || user?.profil?.saldo_awal == null;

  // Jika butuh setup TAPI user mencoba masuk ke halaman selain setup-profil
  if (butuhSetup && location.pathname !== "/setup-profil") {
    return <Navigate to="/setup-profil" replace />;
  }

  // Jika TIDAK butuh setup (saldo > 0) TAPI user iseng buka halaman setup-profil
  if (!butuhSetup && location.pathname === "/setup-profil") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
    // 💡 LOGIKA SANG RAJA: Arahkan berdasarkan saldo_awal
    const butuhSetup =
      user?.profil?.saldo_awal === 0 || user?.profil?.saldo_awal == null;
    return (
      <Navigate to={butuhSetup ? "/setup-profil" : "/dashboard"} replace />
    );
  }

  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" richColors />
      <Routes>
        {/* Rute Tamu */}
        <Route
          path="/"
          element={
            <GuestRoute>
              <Landing />
            </GuestRoute>
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />
        <Route
          path="/reset-password/:token"
          element={
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          }
        />

        {/* Rute Setup Profil */}
        <Route
          path="/setup-profil"
          element={
            <PrivateRoute>
              <SetupProfil />
            </PrivateRoute>
          }
        />

        {/* Rute Utama */}
        <Route
          element={
            <PrivateRoute>
              <MainLayout />
            </PrivateRoute>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/transaksi" element={<Transaksi />} />
          <Route path="/hutang" element={<Hutang />} />
          <Route path="/tabungan" element={<Tabungan />} />
          <Route path="/analisis" element={<Analisis />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
