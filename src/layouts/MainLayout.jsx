import { useState, useEffect, useMemo } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import {
  Menu,
  Search,
  Bell,
  Moon,
  Sun,
  X,
  ChevronRight,
  CheckCircle2,
  AlertCircle,
  LogOut,
  User,
  Loader2,
  ArrowRightLeft,
  Calculator,
  Target,
  PieChart,
} from "lucide-react";
import Sidebar from "./Sidebar";
import { useAuthStore } from "../store/useAuthStore";
import api from "../services/api";

export default function MainLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("finteen-theme");
    if (
      savedTheme === "dark" ||
      (!savedTheme && window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("finteen-theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("finteen-theme", "dark");
      setIsDark(true);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Selamat Pagi";
    if (hour < 15) return "Selamat Siang";
    if (hour < 18) return "Selamat Sore";
    return "Selamat Malam";
  };

  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);

  useEffect(() => {
    const fetchSmartNotifs = async () => {
      try {
        const generatedNotifs = [];
        let notifId = 1;

        try {
          const resAnalisis = await api.get("/analisis");
          const { totalPemasukan, totalPengeluaran, saldo } = resAnalisis.data;

          if (saldo < 0) {
            generatedNotifs.push({
              id: notifId++,
              title: "Awas Defisit!",
              desc: `Pengeluaranmu (Rp ${totalPengeluaran.toLocaleString("id-ID")}) sudah melebihi pemasukan. Segera rem pengeluaranmu!`,
              time: "Peringatan Sistem",
              read: false,
              type: "danger",
            });
          } else if (
            totalPemasukan > 0 &&
            totalPengeluaran > totalPemasukan * 0.8
          ) {
            generatedNotifs.push({
              id: notifId++,
              title: "Pengeluaran Cukup Tinggi",
              desc: "Kamu sudah memakai lebih dari 80% uangmu bulan ini. Hati-hati overbudget!",
              time: "Peringatan Sistem",
              read: false,
              type: "warning",
            });
          } else if (saldo > 0 && totalPemasukan > 0) {
            generatedNotifs.push({
              id: notifId++,
              title: "Keuangan Stabil",
              desc: "Arus kas kamu bulan ini terpantau aman dan sehat. Pertahankan kebiasaan baik ini!",
              time: "Pembaruan Sistem",
              read: false,
              type: "success",
            });
          }
        } catch (error) {
          console.warn("Gagal meracik notif analisis:", error.message);
        }

        try {
          const resTabungan = await api.get("/target-tabungan");
          const tabunganAktif = resTabungan.data;

          if (Array.isArray(tabunganAktif) && tabunganAktif.length > 0) {
            generatedNotifs.push({
              id: notifId++,
              title: "Pengingat Tabungan",
              desc: `Kamu memiliki ${tabunganAktif.length} target tabungan impian. Jangan lupa sisihkan sisa uangmu ya!`,
              time: "Pengingat FinTeen",
              read: false,
              type: "info",
            });
          }
        } catch (error) {
          console.warn("Gagal meracik notif tabungan:", error.message);
        }

        if (generatedNotifs.length === 0) {
          generatedNotifs.push({
            id: notifId++,
            title: "Selamat datang di FinTeen!",
            desc: "Yuk mulai catat transaksi pertamamu untuk melihat analisis keuangan yang cerdas.",
            time: "Baru saja",
            read: false,
            type: "info",
          });
        }

        setNotifs(generatedNotifs);
      } catch (error) {
        console.error("Kesalahan sistem notifikasi:", error);
      }
    };

    if (user) {
      fetchSmartNotifs();
    }
  }, [user]);

  const unreadCount = notifs.filter((n) => !n.read).length;
  const markAllAsRead = () =>
    setNotifs(notifs.map((n) => ({ ...n, read: true })));
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = () => {
    logout(); // Dari useAuthStore
    // 🌟 TAMBAHKAN BARIS INI:
    localStorage.removeItem("token");
    navigate("/login");
  };

  // ==========================================
  // 🌟 FITUR GLOBAL SMART SEARCH (OPTIMIZED)
  // ==========================================
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isFetchingData, setIsFetchingData] = useState(false);

  // State untuk menyimpan data agar tidak terus-menerus memanggil API saat mengetik
  const [searchData, setSearchData] = useState({
    transactions: [],
    hutang: [],
    tabungan: [],
  });

  // Pintasan statis (Pencarian Menu)
  const quickLinks = [
    {
      name: "Lihat Dashboard",
      desc: "Menu",
      path: "/dashboard",
      icon: ChevronRight,
    },
    {
      name: "Catat Transaksi",
      desc: "Aksi",
      path: "/transaksi",
      icon: ArrowRightLeft,
    },
    {
      name: "Simulasi Cicilan",
      desc: "Menu",
      path: "/simulasi",
      icon: Calculator,
    },
    { name: "Kelola Tabungan", desc: "Menu", path: "/tabungan", icon: Target },
    {
      name: "Analisis Pengeluaran",
      desc: "Menu",
      path: "/analisis",
      icon: PieChart,
    }, // 🌟 FIX BUG SINTAKS PIECHART
  ];

  // 🌟 SHORTCUT KEYBOARD: Ctrl+K / Cmd+K untuk Buka, ESC untuk Tutup
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape" && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchOpen]);

  // Mengambil data dari API SEKALI SAJA ketika Modal Search dibuka
  useEffect(() => {
    if (isSearchOpen && searchData.transactions.length === 0) {
      const fetchSearchData = async () => {
        setIsFetchingData(true);
        try {
          const [resTrx, resHutang, resTabungan] = await Promise.all([
            api.get("/transaksi?limit=100"), // Mengambil riwayat yang lebih panjang
            api.get("/hutang"),
            api.get("/target-tabungan"),
          ]);
          setSearchData({
            transactions: resTrx.data.transactions || [],
            hutang: resHutang.data || [],
            tabungan: resTabungan.data || [],
          });
        } catch (error) {
          console.error("Gagal memuat data pencarian:", error);
        } finally {
          setIsFetchingData(false);
        }
      };
      fetchSearchData();
    }
  }, [isSearchOpen, searchData.transactions.length]);

  // Proses Filtering Data secara LOKAL (Instan, Tanpa Loading)
  const combinedResults = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    const filteredQuickLinks = quickLinks.filter((link) =>
      link.name.toLowerCase().includes(query),
    );

    if (query.length < 2) return filteredQuickLinks; // Minimal 2 huruf baru mencari di database

    let dynamicResults = [];

    // 1. Filter Transaksi
    searchData.transactions.forEach((t) => {
      if (
        t.kategori.toLowerCase().includes(query) ||
        (t.catatan && t.catatan.toLowerCase().includes(query))
      ) {
        dynamicResults.push({
          id: `trx-${t._id}`,
          name: t.catatan ? `${t.kategori} - ${t.catatan}` : t.kategori,
          desc: `Rp ${t.nominal.toLocaleString("id-ID")} (${t.tipe})`,
          path: "/transaksi",
          icon: ArrowRightLeft,
          color: t.tipe === "pemasukan" ? "text-emerald-500" : "text-red-500",
        });
      }
    });

    // 2. Filter Tabungan
    searchData.tabungan.forEach((tb) => {
      if (tb.namaTarget.toLowerCase().includes(query)) {
        dynamicResults.push({
          id: `tab-${tb._id}`,
          name: tb.namaTarget,
          desc: `Target Tabungan: Rp ${tb.nominalTarget.toLocaleString("id-ID")}`,
          path: "/tabungan",
          icon: Target,
          color: "text-blue-500",
        });
      }
    });

    // 3. Filter Hutang/Simulasi
    searchData.hutang.forEach((h) => {
      if (String(h?.totalPinjaman || "").includes(query)) {
        dynamicResults.push({
          id: `hut-${h._id}`,
          name: `Simulasi Pinjaman Rp ${h.totalPinjaman.toLocaleString("id-ID")}`,
          desc: `Cicilan Rp ${h.cicilanPerBulan.toLocaleString("id-ID")} selama ${h.lamaBulan} bln`,
          path: "/hutang", // Pastikan rute ini sesuai di App.jsx Anda
          icon: Calculator,
          color: "text-orange-500",
        });
      }
    });

    return [...filteredQuickLinks, ...dynamicResults];
  }, [searchQuery, searchData]);

  const handleSearchNavigate = (path) => {
    navigate(path);
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-950 transition-colors duration-300 font-sans">
      <aside className="hidden md:block h-full z-20">
        <Sidebar />
      </aside>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative z-50 w-64 h-full transform transition-transform duration-300">
            <Sidebar closeMobileMenu={() => setIsMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex flex-col flex-1 w-full h-full overflow-hidden relative">
        <header className="flex items-center justify-between px-4 sm:px-6 py-4 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300 z-20">
          <button
            className="md:hidden text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="hidden sm:block ml-2 md:ml-0">
            <p className="text-sm font-bold text-slate-800 dark:text-slate-100 transition-colors">
              {getGreeting()},{" "}
              {user?.nama ? user.nama.split(" ")[0] : "Pengguna"}! 👋
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 transition-colors">
              {today}
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 ml-auto relative">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-emerald-400 dark:hover:bg-slate-700 transition-colors"
              title="Ganti Tema"
            >
              {isDark ? (
                <Sun className="w-5 h-5" />
              ) : (
                <Moon className="w-5 h-5" />
              )}
            </button>

            {/* TOMBOL PENCARIAN & SHORTCUT */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors hidden sm:flex items-center gap-2"
              title="Cari (Ctrl+K)"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* NOTIFIKASI */}
            <div className="relative">
              <button
                onClick={() => {
                  setIsNotifOpen(!isNotifOpen);
                  if (unreadCount > 0) markAllAsRead();
                }}
                className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900 transition-colors"></span>
                )}
              </button>

              {isNotifOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsNotifOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl z-40 overflow-hidden transition-colors">
                    <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-950/50">
                      <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                        Notifikasi
                      </h3>
                      <button
                        onClick={markAllAsRead}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        Tandai dibaca
                      </button>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifs.map((notif) => (
                        <div
                          key={notif.id}
                          className={`p-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors cursor-pointer ${!notif.read ? "bg-emerald-50/50 dark:bg-emerald-900/10" : ""}`}
                        >
                          <div className="flex gap-3">
                            <div className="mt-0.5">
                              {notif.type === "danger" ? (
                                <AlertCircle className="w-5 h-5 text-red-500" />
                              ) : notif.type === "warning" ? (
                                <AlertCircle className="w-5 h-5 text-orange-500" />
                              ) : notif.type === "success" ? (
                                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                              ) : (
                                <Bell className="w-5 h-5 text-blue-500" />
                              )}
                            </div>
                            <div>
                              <p
                                className={`text-sm font-medium ${!notif.read ? "text-slate-900 dark:text-white" : "text-slate-700 dark:text-slate-300"}`}
                              >
                                {notif.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                                {notif.desc}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="w-px h-6 bg-slate-200 dark:bg-slate-800 mx-1"></div>

            {/* PROFIL */}
            <div className="relative">
              <div
                className="flex items-center gap-2 pl-1 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-1.5 rounded-full lg:rounded-xl transition-colors"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="text-right hidden lg:block">
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                    {user?.nama || "User"}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                    {user?.profil?.status || user?.status || "Pelajar"}
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-500/20 rounded-full border-2 border-emerald-500 flex items-center justify-center text-emerald-700 dark:text-emerald-400 font-bold transition-colors">
                  {user?.nama ? user.nama.charAt(0).toUpperCase() : "U"}
                </div>
              </div>

              {isProfileOpen && (
                <>
                  <div
                    className="fixed inset-0 z-30"
                    onClick={() => setIsProfileOpen(false)}
                  ></div>
                  <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-40 overflow-hidden transition-colors py-1">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        navigate("/profil");
                      }}
                      className="w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-3"
                    >
                      <User className="w-4 h-4 text-slate-400" /> Profil Saya
                    </button>
                    <div className="border-t border-slate-100 dark:border-slate-800 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-3"
                    >
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* 🌟 SEARCH MODAL */}
        {isSearchOpen && (
          <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4">
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
              onClick={() => setIsSearchOpen(false)}
            />

            <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[80vh]">
              <div className="flex items-center px-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="Cari transaksi, tabungan, hutang, atau menu..."
                  className="w-full bg-transparent border-none focus:ring-0 text-slate-800 dark:text-slate-100 placeholder-slate-400 h-14 px-4 text-base sm:text-lg outline-none"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                {isFetchingData ? (
                  <Loader2 className="w-5 h-5 text-emerald-500 animate-spin mr-2" />
                ) : (
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="p-1 rounded-md text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="p-2 overflow-y-auto flex-1">
                <p className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {searchQuery ? "Hasil Pencarian" : "Pintasan Cepat"}
                </p>

                {combinedResults.length > 0 ? (
                  combinedResults.map((item, idx) => {
                    const Icon = item.icon || ChevronRight;
                    return (
                      <button
                        key={item.id || idx}
                        onClick={() => handleSearchNavigate(item.path)}
                        className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-emerald-50 dark:hover:bg-slate-800/60 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-3 w-full">
                          <div className="p-2 bg-slate-100 dark:bg-slate-950 rounded-lg group-hover:bg-white dark:group-hover:bg-slate-700 transition-colors shrink-0">
                            <Icon
                              className={`w-4 h-4 ${item.color || "text-emerald-600 dark:text-emerald-400"}`}
                            />
                          </div>
                          <div className="truncate">
                            <p className="font-medium text-slate-800 dark:text-slate-200 truncate">
                              {item.name}
                            </p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {item.desc}
                            </p>
                          </div>
                        </div>
                      </button>
                    );
                  })
                ) : !isFetchingData ? (
                  <div className="text-center py-10">
                    <Search className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                    <p className="text-slate-500 dark:text-slate-400 text-sm">
                      Tidak ada data atau fitur yang cocok dengan "{searchQuery}
                      "
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="bg-slate-50 dark:bg-slate-950/50 border-t border-slate-100 dark:border-slate-800 px-4 py-3 text-xs text-slate-500 dark:text-slate-400 flex justify-between shrink-0">
                <span>
                  Cari catatan, kategori, nominal hutang, atau nama target
                </span>
                <span className="hidden sm:inline-block border border-slate-200 dark:border-slate-700 px-2 rounded-md font-mono">
                  ESC untuk menutup
                </span>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 scroll-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
