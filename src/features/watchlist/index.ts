// Public surface of the watchlist feature.
//
// The cross-feature edge the table needs: features/crypto renders the
// favorite button inside its table, and imports it from here rather than
// reaching into components/.
//
// NOTE: this barrel re-exports the `server-only` watchlist query, so it must
// be imported from Server Components and Server Functions only.
// `FavoriteButton` imports the Server Function relatively, which is the
// project convention anyway.
export { FavoriteButton } from './components/FavoriteButton'
export { FavoriteSignInLink } from './components/FavoriteSignInLink'
export { toggleFavorite } from './actions'
export { getWatchlist } from './lib/queries'
export type {
  FavoriteButtonProps,
  FavoriteSignInLinkProps,
  ToggleFavoriteResult,
} from './types'
