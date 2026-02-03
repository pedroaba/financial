import { redirect } from 'next/navigation'

import { Page, PageHeader } from '@/components/page'
import { getSessionForServer } from '@/lib/auth-server'

import { DisplayNameEdit } from '../general/_components/display-name-edit'
import { EmailEdit } from './_components/email-edit'

export default async function ConnectedAccountsPage() {
  const [session] = await Promise.all([getSessionForServer()])

  if (!session?.user) {
    redirect('/login')
  }

  return (
    <Page.Root>
      <PageHeader.Root>
        <PageHeader.Title>Account Settings</PageHeader.Title>
        <PageHeader.Description>
          Manage your profile and preferences.
        </PageHeader.Description>
      </PageHeader.Root>

      <Page.Content className="space-y-4">
        <DisplayNameEdit displayName={session.user.name ?? ''} />
        <EmailEdit email={session.user.email ?? ''} />
      </Page.Content>
    </Page.Root>
  )
}
