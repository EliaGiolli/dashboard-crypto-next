import { z } from 'zod'

/**
 * A CoinGecko coin id: a lowercase slug such as `bitcoin` or
 * `wrapped-bitcoin`.
 *
 * `toggleFavorite` is reachable by a direct POST, so its argument is untrusted
 * input. Anything not shaped like a CoinGecko id is rejected before it can
 * reach the database.
 */
export const coinIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(100)
  .regex(/^[a-z0-9-]+$/)
