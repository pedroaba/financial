import { redirect } from 'next/navigation'

import { AppShell } from '@/components/app-shell'
import { getSessionForServer } from '@/lib/auth-server'

export default async function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const result = await getSessionForServer()
  if (!result?.user) {
    redirect('/login')
  }

  return <AppShell>{children}</AppShell>
}
