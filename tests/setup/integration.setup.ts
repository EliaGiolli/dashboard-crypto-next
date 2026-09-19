import { execSync } from 'node:child_process'
import { rmSync } from 'node:fs'
import path from 'node:path'

import { beforeAll, afterAll } from 'vitest'

// Integration tests run against a throwaway SQLite file, never dev.db.
// An absolute path removes any doubt about what a relative `file:./` resolves
// against between the Prisma CLI (schema directory) and the runtime client.
const TEST_DB = path.join(process.cwd(), 'prisma', 'test.db')
const TEST_DB_URL = `file:${TEST_DB.split(path.sep).join('/')}`

process.env.DATABASE_URL = TEST_DB_URL
process.env.BETTER_AUTH_SECRET =
  process.env.BETTER_AUTH_SECRET ?? 'test-secret-at-least-32-characters-long!!'
process.env.BETTER_AUTH_URL = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'
process.env.COINGECKO_API_URL =
  process.env.COINGECKO_API_URL ?? 'https://api.coingecko.com/api/v3'

function removeTestDb() {
  // SQLite leaves -journal / -wal / -shm siblings behind.
  for (const suffix of ['', '-journal', '-wal', '-shm']) {
    try {
      rmSync(`${TEST_DB}${suffix}`, { force: true })
    } catch {
      // Windows refuses to unlink a file another handle still has open. A
      // leftover here is harmless: test.db is gitignored and the next run's
      // beforeAll clears it. Failing teardown over it would turn a green
      // suite red.
    }
  }
}

beforeAll(() => {
  removeTestDb()

  // `migrate deploy`, not `db push`: in Prisma 6.19 `db push` does not apply
  // the `datasource.url` override from prisma.config.ts, so it ignores the
  // DATABASE_URL set here and fails validation. Applying the committed
  // migrations also asserts they actually produce the current schema.
  // execSync with one command string, not execFileSync + shell:true: the
  // latter emits a DEP0190 deprecation warning on every run because an args
  // array is concatenated rather than escaped.
  execSync('npx prisma migrate deploy', {
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    stdio: 'inherit',
  })
})

afterAll(() => {
  removeTestDb()
})
