import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PreferencesStore } from './types';

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      favorites: [],
      toggleFavorite: (id) =>
        set((state) => ({
          favorites: state.favorites.includes(id)
            ? state.favorites.filter((f) => f !== id)
            : [...state.favorites, id],
        })),
    }),
    {
      name: 'preferences-store', // key value inside localStorage
    }
  )
);
