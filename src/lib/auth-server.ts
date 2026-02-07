import { headers } from 'next/headers'

import { auth } from '@/lib/better-auth/auth'

/**
 * Get the current session on the server (RSC / Server Actions).
 * Use for redirect logic in layout or protected routes.
 * On session query failure (e.g. stale cookie, DB error), returns null so the app can redirect to login.
 */
export async function getSessionForServer() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    })

    return session
  } catch (error) {
    // Session query can fail when: cookie points to missing/expired session, or DB is temporarily unavailable.
    // Treat as "no session" so layout redirects to login instead of throwing.
    if (process.env.NODE_ENV === 'development') {
      console.warn('[getSessionForServer] Session lookup failed:', error)
    }

    return null
  }
}
