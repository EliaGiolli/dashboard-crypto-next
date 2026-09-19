import { execFileSync } from 'node:child_process'
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
    rmSync(`${TEST_DB}${suffix}`, { force: true })
  }
}

beforeAll(() => {
  removeTestDb()

  // Create the schema in the fresh file. `db push` rather than `migrate deploy`
  // because the tests care about the current schema, not its history.
  execFileSync('npx', ['prisma', 'db', 'push', '--skip-generate'], {
    env: { ...process.env, DATABASE_URL: TEST_DB_URL },
    stdio: 'inherit',
    shell: true,
  })
})

afterAll(() => {
  removeTestDb()
})
