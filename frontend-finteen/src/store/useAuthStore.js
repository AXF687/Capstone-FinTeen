import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Fungsi Login: Cukup set state, Zustand akan otomatis menyimpannya ke localStorage
      login: (userData, token) => {
        set({ user: userData, token, isAuthenticated: true });
      },

      // Fungsi Logout: Cukup bersihkan state, Zustand akan otomatis membersihkan localStorage
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      // Fungsi Update: Cukup update state, Zustand otomatis me-replace data lama di localStorage
      updateUser: (data) => set((state) => ({ 
        user: { ...state.user, ...data } 
      })),
    }),
    {
      name: 'finteen-auth-storage', // 🌟 Nama unik untuk key di localStorage
      storage: createJSONStorage(() => localStorage), // 🌟 Menyuruh Zustand pakai localStorage
    }
  )
);