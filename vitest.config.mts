import path from 'node:path'

import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    tsconfigPaths: true,
    alias: {
      // `server-only` throws by design when it is pulled into a client module
      // graph, and Vitest is neither graph. Stubbing it lets the node project
      // import the real `core/lib/auth` and `features/auth/lib/session`.
      'server-only': path.resolve(__dirname, 'tests/setup/server-only.stub.ts'),
    },
  },
  test: {
    projects: [
      {
        // Pure functions, hooks, and client/sync-server components.
        // NOTE: async Server Components are NOT supported here — they are
        // covered by the Playwright suite instead.
        extends: true,
        test: {
          name: 'unit',
          environment: 'jsdom',
          setupFiles: ['./tests/setup/unit.setup.ts'],
          include: ['src/**/*.test.{ts,tsx}', 'tests/unit/**/*.test.{ts,tsx}'],
        },
      },
      {
        // Server Functions against a real (throwaway) SQLite database.
        extends: true,
        test: {
          name: 'integration',
          environment: 'node',
          setupFiles: ['./tests/setup/integration.setup.ts'],
          include: ['tests/integration/**/*.test.ts'],
          fileParallelism: false,
        },
      },
    ],
  },
})
