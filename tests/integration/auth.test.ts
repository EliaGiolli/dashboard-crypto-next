import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

// Better Auth's `nextCookies()` plugin writes through next/headers, and
// `auth.api.*` takes a Headers object. Neither exists outside a Next request,
// so both are stubbed; everything below this line is the real library talking
// to a real (throwaway) SQLite file.
vi.mock('next/headers', () => ({
  headers: async () => new Headers(),
  cookies: async () => ({
    get: () => undefined,
    set: () => {},
    delete: () => {},
  }),
}))

const { auth } = await import('@/core/lib/auth')
const { prisma } = await import('@/core/lib/prisma')
const { APIError } = await import('better-auth/api')

const EMAIL = 'integration@example.com'
const PASSWORD = 'correct-horse-battery'

async function signUp(email = EMAIL, password = PASSWORD) {
  return auth.api.signUpEmail({
    body: { email, password, name: email.split('@')[0] },
    headers: new Headers(),
  })
}

beforeAll(async () => {
  // Fail loudly here rather than with a confusing error inside a test.
  await prisma.$connect()
})

afterEach(async () => {
  await prisma.user.deleteMany()
})

describe('sign-up', () => {
  it('creates a user and stores the credential on an Account row', async () => {
    await signUp()

    const user = await prisma.user.findUnique({
      where: { email: EMAIL },
      include: { accounts: true },
    })

    expect(user).not.toBeNull()
    expect(user!.name).toBe('integration')

    // The whole point of the migration: User has no password column, the hash
    // lives on Account, and it is a hash rather than the plaintext.
    expect(user).not.toHaveProperty('password')
    expect(user!.accounts).toHaveLength(1)
    expect(user!.accounts[0].providerId).toBe('credential')
    expect(user!.accounts[0].password).toBeTruthy()
    expect(user!.accounts[0].password).not.toBe(PASSWORD)
  })

  it('rejects a duplicate email instead of throwing a Prisma constraint error', async () => {
    await signUp()

    await expect(signUp()).rejects.toBeInstanceOf(APIError)
    expect(await prisma.user.count()).toBe(1)
  })
})

describe('sign-in', () => {
  it('rejects a wrong password', async () => {
    await signUp()

    await expect(
      auth.api.signInEmail({
        body: { email: EMAIL, password: 'not-the-password' },
        headers: new Headers(),
      })
    ).rejects.toBeInstanceOf(APIError)
  })

  it('issues a session cookie that resolves back to the user', async () => {
    await signUp()

    const response = await auth.api.signInEmail({
      body: { email: EMAIL, password: PASSWORD },
      headers: new Headers(),
      asResponse: true,
    })

    const cookie = response.headers
      .getSetCookie()
      .map((value) => value.split(';')[0])
      .join('; ')

    expect(cookie).not.toBe('')

    const session = await auth.api.getSession({
      headers: new Headers({ cookie }),
    })

    expect(session?.user.email).toBe(EMAIL)

    // The session is a real row, not a bearer-the-user-id cookie: the old
    // implementation let anyone set `session=<any user id>` by hand.
    expect(await prisma.session.count()).toBe(1)
  })

  it('does not resolve a session from a forged cookie holding a raw user id', async () => {
    const { user } = await signUp()

    const session = await auth.api.getSession({
      headers: new Headers({ cookie: `better-auth.session_token=${user.id}` }),
    })

    expect(session).toBeNull()
  })
})
