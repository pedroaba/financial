import { redirect } from 'next/navigation'

import { getSessionForServer } from '@/lib/auth-server'

import { NotificationsSection } from '../_components/notifications-section'

export default async function NotificationsPage() {
  const session = await getSessionForServer()
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-zinc-100">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-zinc-400">
            Manage your profile and preferences.
          </p>
        </div>
      </div>
      <NotificationsSection />
    </div>
  )
}
