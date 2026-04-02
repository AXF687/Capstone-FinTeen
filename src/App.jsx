// App.jsx - FULL VERSION WITH AUTH CALLBACK
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
import AuthCallback from "./pages/AuthCallback"; // ✅ IMPORT
import Test from "./pages/Test";

// SATPAM DALAM
function PrivateRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const butuhSetup =
    user?.profil?.saldo_awal === 0 || user?.profil?.saldo_awal == null;

  if (butuhSetup && location.pathname !== "/setup-profil") {
    return <Navigate to="/setup-profil" replace />;
  }

  if (!butuhSetup && location.pathname === "/setup-profil") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function GuestRoute({ children }) {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated) {
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
        <Route path="/" element={<GuestRoute><Landing /></GuestRoute>} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route path="/test" element={<Test />} />
        
        {/* ✅ ROUTE CALLBACK - TARUH DI SINI */}
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        <Route path="/forgot-password" element={<GuestRoute><ForgotPassword /></GuestRoute>} />
        <Route path="/reset-password/:token" element={<GuestRoute><ResetPassword /></GuestRoute>} />
        <Route path="/setup-profil" element={<PrivateRoute><SetupProfil /></PrivateRoute>} />
        
        <Route element={<PrivateRoute><MainLayout /></PrivateRoute>}>
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