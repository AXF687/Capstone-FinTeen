import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token) => {
        set({ user: userData, token, isAuthenticated: true });
      },

      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
      },

      updateUser: (data) => set((state) => ({ 
        user: { ...state.user, ...data } 
      })),
    }),
    {
      name: 'finteen-auth-storage', 
      storage: createJSONStorage(() => localStorage), 
    }
  )
);