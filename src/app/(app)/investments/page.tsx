import { Page, PageHeader } from '@/components/page'

export default async function InvestmentsPage() {
  return (
    <Page.Root>
      <Page.Content>
        <PageHeader.Root>
          <PageHeader.Title>Investments</PageHeader.Title>
          <PageHeader.Description>
            Manage your investments and track your returns.
          </PageHeader.Description>
        </PageHeader.Root>
      </Page.Content>
    </Page.Root>
  )
}
