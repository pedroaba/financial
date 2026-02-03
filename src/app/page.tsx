import { redirect } from 'next/navigation'

import { getSessionForServer } from '@/lib/auth-server'

export default async function HomePage() {
  const result = await getSessionForServer()
  if (result?.user) {
    redirect('/dashboard')
  }

  redirect('/login')
}
