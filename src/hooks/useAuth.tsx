import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  nickname: string | null;
  isAuthenticated: boolean;
  login: (nickname: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      nickname: null,
      isAuthenticated: false,
      login: (nickname: string) => set({ nickname, isAuthenticated: true }),
      logout: () => set({ nickname: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
