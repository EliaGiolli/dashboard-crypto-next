import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest'

// `updateTag` only works inside a real Server Action request, and the session
// comes from request headers. Both are stubbed; the Server Function itself and
// the database underneath it are real.
const { updateTag, getCurrentUser } = vi.hoisted(() => ({
  updateTag: vi.fn(),
  getCurrentUser: vi.fn(),
}))

vi.mock('next/cache', () => ({ updateTag }))
vi.mock('@/features/auth', () => ({ getCurrentUser }))

const { toggleFavorite } = await import('@/features/watchlist/actions')
const { prisma } = await import('@/core/lib/prisma')

let userId: string

beforeAll(async () => {
  await prisma.$connect()
})

beforeEach(async () => {
  const user = await prisma.user.create({
    data: { name: 'watcher', email: 'watcher@example.com' },
  })
  userId = user.id
  getCurrentUser.mockReset().mockResolvedValue(user)
  updateTag.mockReset()
})

afterEach(async () => {
  // Cascades to Watchlist.
  await prisma.user.deleteMany()
})

afterAll(async () => {
  await prisma.$disconnect()
})

describe('toggleFavorite', () => {
  it('creates a row, then deletes it on the second call', async () => {
    await expect(toggleFavorite('bitcoin')).resolves.toEqual({
      ok: true,
      isFavorite: true,
    })
    expect(await prisma.watchlist.findMany({ where: { userId } })).toEqual([
      expect.objectContaining({ userId, coinId: 'bitcoin' }),
    ])

    await expect(toggleFavorite('bitcoin')).resolves.toEqual({
      ok: true,
      isFavorite: false,
    })
    expect(await prisma.watchlist.count({ where: { userId } })).toBe(0)
  })

  it('expires only the signed-in user’s cached list', async () => {
    await toggleFavorite('bitcoin')

    expect(updateTag).toHaveBeenCalledTimes(1)
    expect(updateTag).toHaveBeenCalledWith(`watchlist:${userId}`)
  })

  it('keeps one row per coin when two toggles race past the delete', async () => {
    // Both calls see an empty list and both try to add. The upsert is what
    // keeps the @@unique([userId, coinId]) constraint from surfacing.
    const results = await Promise.all([
      toggleFavorite('ethereum'),
      toggleFavorite('ethereum'),
    ])

    expect(results.every((result) => result.ok)).toBe(true)
    expect(await prisma.watchlist.count({ where: { userId } })).toBeLessThanOrEqual(1)
  })

  it('refuses when nobody is signed in, and writes nothing', async () => {
    getCurrentUser.mockResolvedValue(null)

    await expect(toggleFavorite('bitcoin')).resolves.toEqual({
      ok: false,
      error: 'Accedi per salvare i preferiti.',
    })
    expect(await prisma.watchlist.count()).toBe(0)
    expect(updateTag).not.toHaveBeenCalled()
  })

  // Server Functions are reachable by a direct POST, so the argument is
  // whatever the caller sent.
  it.each([[''], ['../etc/passwd'], [42], [null], [{ coinId: 'bitcoin' }]])(
    'rejects %j before touching the database',
    async (input) => {
      await expect(toggleFavorite(input)).resolves.toEqual({
        ok: false,
        error: 'Criptovaluta non valida.',
      })
      expect(await prisma.watchlist.count()).toBe(0)
      expect(getCurrentUser).not.toHaveBeenCalled()
    }
  )
})
