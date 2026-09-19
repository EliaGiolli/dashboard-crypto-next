export interface PreferencesStore {
  favorites: string[];
  toggleFavorite: (id: string) => void;
  currency: 'usd' | 'eur';
  setCurrency: (c: 'usd' | 'eur') => void;
}
