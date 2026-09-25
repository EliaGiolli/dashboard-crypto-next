// actions.ts — `toggleFavorite` reports the new state, or why it failed.
export type ToggleFavoriteResult =
  | { ok: true; isFavorite: boolean }
  | { ok: false; error: string }

// FavoriteButton.tsx
export interface FavoriteButtonProps {
  coinId: string
  /** Only for the screen-reader part of the label. */
  coinName: string
  /** The server's view. The button layers its optimistic value on top. */
  isFavorite: boolean
}

// FavoriteSignInLink.tsx
export interface FavoriteSignInLinkProps {
  coinName: string
}
