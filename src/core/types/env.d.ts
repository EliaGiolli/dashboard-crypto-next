/**
 * Ambient typing for the variables this app reads from `process.env`.
 *
 * The authoritative definition is the Zod schema in
 * `src/core/schema/parserSchema.ts`, which validates them at startup; this
 * only stops `process.env.X` from being typed `string | undefined` in the
 * few places it is read directly.
 *
 * Nothing here is NEXT_PUBLIC_. The two `NEXT_PUBLIC_API_URL*` variables the
 * client hooks used are gone with those hooks — the CoinGecko endpoint is
 * server-side now, so it never reaches the browser bundle.
 */
namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL: string;
    COINGECKO_API_URL: string;
    BETTER_AUTH_SECRET: string;
    BETTER_AUTH_URL: string;
  }
}
