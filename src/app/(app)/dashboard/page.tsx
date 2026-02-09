import { Page, PageHeader } from '@/components/page'

export default async function DashboardPage() {
  return (
    <Page.Root>
      <Page.Content>
        <PageHeader.Root>
          <PageHeader.Title>Dashboard</PageHeader.Title>
          <PageHeader.Description>
            Manage your dashboard and track your progress.
          </PageHeader.Description>
        </PageHeader.Root>
      </Page.Content>
    </Page.Root>
  )
}
