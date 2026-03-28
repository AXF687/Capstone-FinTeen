import { useAuthStore } from '../store/useAuthStore';
import authService from "../services/authService";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner"; 

const useAuth = () => {
    const { user, token, isAuthenticated, login, logout, updateUser } = useAuthStore();
    const navigate = useNavigate();

    const handleLogin = async ({ email, password }) => {
        try {
            const res = await authService.login({ email, password });
          
            localStorage.setItem('token', res.token);

            const dataUser = await authService.getProfil();
            const sudahSetUp = dataUser?.profil?.status && dataUser.profil.status !== "lainnya";

            login(dataUser, res.token); 
            updateUser({
                ...dataUser,
                profil: dataUser?.profil || {}, 
                profil_lengkap: sudahSetUp,
            });

            if (sudahSetUp) {
                navigate('/dashboard', { replace: true });
            } else {
                toast.info("Silakan lengkapi profil Anda terlebih dahulu.");
                navigate('/setup-profil', { replace: true }); 
            }

            return Promise.resolve();
        } catch (error) {
            console.error("Gagal login:", error);
            return Promise.reject(error);
        }
    };

    const loginWithGoogleToken = async (googleToken, isNewUser) => {
        try {
            localStorage.setItem('token', googleToken); 

            const dataUser = await authService.getProfil();
            const sudahSetUp = dataUser?.profil?.status && dataUser.profil.status !== "lainnya";

            login(dataUser, googleToken);
            updateUser({
                ...dataUser,
                profil: dataUser?.profil || {}, 
                profil_lengkap: sudahSetUp,
            });

            if (isNewUser || !sudahSetUp) {
                toast.success("Hore! Akun FinTeen berhasil dibuat. Yuk lengkapi profilmu!");
                navigate('/setup-profil', { replace: true });
            } else {
                toast.success("Login via Google berhasil!");
                navigate('/dashboard', { replace: true });
            }
        } catch (error) {
            console.error("Gagal memverifikasi akun Google:", error);
            logout(); 
            toast.error("Gagal mengambil profil Google. Silakan login ulang.");
            navigate('/login', { replace: true });
        }
    };

    const handleRegister = async ({ nama, email, password }) => {
        const res = await authService.requestOtp({ nama, email, password });
        return res; 
    };

    const handleSetupProfil = async ({ status, saldo_awal, target_bulanan }) => {
        const data = await authService.setupProfil({ status, saldo_awal, target_bulanan });
        
        if (data && data.user) {
            updateUser(data.user);
        } else {
            updateUser({
                ...user,
                profil: {
                    status,
                    saldo_awal: Number(saldo_awal),
                    target_bulanan: target_bulanan ? Number(target_bulanan) : 0,
                },
                profil_lengkap: true
            });
        }
        
        navigate('/dashboard', { replace: true });
    };

    const handleLogout = () => {
        authService.logout();
        logout(); 
        navigate('/login', { replace: true });
    };

    return {
        user, token, isAuthenticated,
        login: handleLogin,
        loginWithGoogleToken,
        register: handleRegister,
        setupProfil: handleSetupProfil,
        logout: handleLogout,
        updateUser,
    };
};

export default useAuth;