import { redirect } from 'next/navigation'

import { getSessionForServer } from '@/lib/auth-server'

import { ChangePasswordForm } from '../_components/change-password-form'

export default async function SecurityPage() {
  const session = await getSessionForServer()
  if (!session?.user) {
    redirect('/login')
  }

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-foreground">
            Account Settings
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your profile and preferences.
          </p>
        </div>
      </div>
      <ChangePasswordForm />
    </div>
  )
}
