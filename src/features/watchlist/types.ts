/**
 * The store's `currency` / `setCurrency` fields are gone: nothing ever read
 * them, and the selection is now a `?currency=` search param, which the
 * server needs anyway to key the cached CoinGecko call — and which makes a
 * chosen currency shareable in a URL.
 *
 * `favorites` survives until Phase 4 moves it into the `Watchlist` table.
 */
export interface PreferencesStore {
  favorites: string[];
  toggleFavorite: (id: string) => void;
}
