import { create } from 'zustand';
//Types
import { UserStore } from '@/types/storeTypes';

export const useUserStore = create<UserStore>((set) => ({
    user: null,
    setUser: (u) => set({ user: u}),
    logout: () => set({ user: null }),
})) 