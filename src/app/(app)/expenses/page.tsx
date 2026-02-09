import { Page, PageHeader } from '@/components/page'

export default async function ExpensesPage() {
  return (
    <Page.Root>
      <Page.Content>
        <PageHeader.Root>
          <PageHeader.Title>Expenses</PageHeader.Title>
          <PageHeader.Description>
            Manage your expenses and track your spending.
          </PageHeader.Description>
        </PageHeader.Root>
      </Page.Content>
    </Page.Root>
  )
}
