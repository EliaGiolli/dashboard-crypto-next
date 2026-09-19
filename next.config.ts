import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Cache Components (Next 16's unified ppr + useCache + dynamicIO flag).
  //
  // This is what makes `'use cache'` available in features/crypto/lib and what
  // turns the build into a real gate: it FAILS on uncached data access or a
  // runtime API (cookies, headers, searchParams) that is not inside a
  // <Suspense> boundary. Phase 0 deferred it until server-first fetching and
  // those boundaries existed — that is this phase.
  cacheComponents: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coin-images.coingecko.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
