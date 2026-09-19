import { beforeAll, afterAll } from 'vitest'

// Integration tests run against a throwaway SQLite file, never dev.db.
process.env.DATABASE_URL = 'file:./test.db'
process.env.BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET ?? 'test-secret-at-least-32-characters-long!!'
process.env.BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'

beforeAll(async () => {
  // Schema push + seed are wired up in Phase 2, once the Better Auth
  // models exist. Kept as a single seam so tests never touch dev.db.
})

afterAll(async () => {
  // Teardown lands with the first integration test in Phase 7.
})
