// Public surface of the watchlist feature.
//
// This is the one cross-feature edge the app has: features/crypto renders the
// favorite button inside its table, and imports it from here rather than
// reaching into components/.
export { default as FavoriteButton } from './components/FavoriteButton'
