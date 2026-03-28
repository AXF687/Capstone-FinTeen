import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { toast } from 'sonner';
import authService from '../services/authService';
import { User, Shield, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function Profil() {
  const { user, updateUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profil');
  const [loading, setLoading] = useState(false);

  const [profilForm, setProfilForm] = useState({
    nama: user?.nama || '',
    email: user?.email || '',
    status: user?.profil?.status || 'pelajar',
    target_bulanan: user?.profil?.target_bulanan || 0,
  });

  const [displayTarget, setDisplayTarget] = useState('');

  const [passForm, setPassForm] = useState({
    passwordLama: '',
    passwordBaru: '',
    konfirmasi: ''
  });

  useEffect(() => { 
    document.title = "Pengaturan Profil - FinTeen"; 
    
    if (user?.profil?.target_bulanan) {
      setDisplayTarget(new Intl.NumberFormat('id-ID').format(user.profil.target_bulanan));
    }
  }, [user]);

  const handleTargetChange = (e) => {
    let inputValue = e.target.value;
    const cleanNumber = inputValue.replace(/\D/g, '');

    if (cleanNumber === '') {
      setDisplayTarget('');
      setProfilForm({ ...profilForm, target_bulanan: 0 });
      return;
    }

    const formattedDisplay = new Intl.NumberFormat('id-ID').format(cleanNumber);
    setDisplayTarget(formattedDisplay);
    setProfilForm({ ...profilForm, target_bulanan: cleanNumber });
  };

  const handleSaveProfil = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authService.setupProfil({ 
        ...profilForm, 
        target_bulanan: Number(profilForm.target_bulanan) 
      });
      updateUser(res.user);
      toast.success("Data profil berhasil diperbarui!");
    } catch (error) {
      toast.error("Gagal memperbarui profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passForm.passwordBaru !== passForm.konfirmasi) {
      return toast.error("Konfirmasi password baru tidak cocok!");
    }
    setLoading(true);
    try {
      await authService.changePassword({ passwordLama: passForm.passwordLama, passwordBaru: passForm.passwordBaru });
      toast.success("Password berhasil diubah!");
      setPassForm({ passwordLama: '', passwordBaru: '', konfirmasi: '' });
    } catch (error) {
      toast.error(error.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-700 dark:text-emerald-400 text-2xl font-bold uppercase">
          {user?.nama?.charAt(0) || 'U'}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">{user?.nama}</h1>
          <p className="text-slate-500 dark:text-slate-400">{user?.email}</p>
        </div>
      </div>

      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto">
        <button 
          onClick={() => setActiveTab('profil')} 
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'profil' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <User className="w-4 h-4" /> Informasi Pribadi
        </button>
        <button 
          onClick={() => setActiveTab('keamanan')} 
          className={`px-4 py-3 font-medium text-sm flex items-center gap-2 whitespace-nowrap transition-colors ${activeTab === 'keamanan' ? 'border-b-2 border-emerald-500 text-emerald-600 dark:text-emerald-400' : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'}`}
        >
          <Shield className="w-4 h-4" /> Keamanan Akun
        </button>
      </div>

      <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-200 dark:border-slate-800 min-h-[300px]">
      
        {activeTab === 'profil' && (
          <form onSubmit={handleSaveProfil} className="space-y-4 max-w-xl animate-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label>Nama Tampilan</Label>
              <Input value={profilForm.nama} onChange={(e) => setProfilForm({...profilForm, nama: e.target.value})} required className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"/>
            </div>
            <div className="space-y-2">
              <Label>Alamat Email</Label>
              <Input 
                type="email"
                value={profilForm.email} 
                disabled
                readOnly
                className="bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 opacity-70 cursor-not-allowed border-slate-200 dark:border-slate-800"
              />
              <p className="text-xs text-slate-500">
                Email terikat dengan identitas keamanan akun dan tidak dapat diubah.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Status Saat Ini</Label>
              <select value={profilForm.status} onChange={(e) => setProfilForm({...profilForm, status: e.target.value})} className="flex h-10 w-full rounded-md border border-slate-200 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:border-slate-700 dark:text-slate-100">
                <option value="pelajar" className="dark:bg-slate-900">Pelajar</option>
                <option value="mahasiswa" className="dark:bg-slate-900">Mahasiswa</option>
                <option value="pekerja" className="dark:bg-slate-900">Pekerja</option>
                <option value="lainnya" className="dark:bg-slate-900">Lainnya</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label>Target Menabung Bulanan (Rp)</Label>
              <div className="relative">
                <Input 
                  type="text" 
                  value={displayTarget} 
                  onChange={handleTargetChange} 
                  placeholder="0"
                  className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100 pl-10"
                />
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 text-sm font-medium">
                  Rp
                </span>
              </div>
            </div>
            <Button type="submit" disabled={loading} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
              {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />} Simpan Profil
            </Button>
          </form>
        )}

        {activeTab === 'keamanan' && (
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-xl animate-in slide-in-from-right-4 duration-300">
            {!user?.googleId ? (
              <>
                <div className="space-y-2">
                  <Label>Password Lama</Label>
                  <Input type="password" required value={passForm.passwordLama} onChange={(e) => setPassForm({...passForm, passwordLama: e.target.value})} className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"/>
                </div>
                <div className="space-y-2">
                  <Label>Password Baru (Min. 6 Karakter)</Label>
                  <Input type="password" minLength="6" required value={passForm.passwordBaru} onChange={(e) => setPassForm({...passForm, passwordBaru: e.target.value})} className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"/>
                </div>
                <div className="space-y-2">
                  <Label>Konfirmasi Password Baru</Label>
                  <Input type="password" required value={passForm.konfirmasi} onChange={(e) => setPassForm({...passForm, konfirmasi: e.target.value})} className="dark:bg-slate-950 dark:border-slate-700 dark:text-slate-100"/>
                </div>
                <Button type="submit" disabled={loading} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white w-full sm:w-auto">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Shield className="w-4 h-4 mr-2" />} Update Password
                </Button>
              </>
            ) : (
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg text-sm border border-blue-200 dark:border-blue-900/50">
                Akun kamu terhubung menggunakan <strong>Google OAuth</strong>. Keamanan password dikelola langsung oleh Google, sehingga kamu tidak perlu (dan tidak bisa) mengubah password di aplikasi ini.
              </div>
            )}
          </form>
        )}

      </div>
    </div>
  );
}