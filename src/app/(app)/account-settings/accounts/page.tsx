import { redirect } from 'next/navigation'

import { getLinkedAccounts } from '@/app/(app)/account-settings/actions'
import { Page, PageHeader } from '@/components/page'
import { getSessionForServer } from '@/lib/auth-server'

import { ConnectedAccountsSection } from '../_components/connected-accounts-section'
import { DisplayNameEdit } from '../general/_components/display-name-edit'

export default async function ConnectedAccountsPage() {
  const [session, accounts] = await Promise.all([
    getSessionForServer(),
    getLinkedAccounts(),
  ])

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

      <Page.Content>
        <DisplayNameEdit />
      </Page.Content>
    </Page.Root>
  )
}
