import { Page } from '@/components/page'
import { Toolbar } from '@/components/toolbar'

import { CreateTransactionForm } from './_components/create-transaction-form'
import { TransactionList } from './_components/transaction-list'

export default async function TransactionsPage() {
  return (
    <Page.Root>
      <Page.Content>
        <Toolbar.Root>
          <Toolbar.Content>
            <Page.Header className="gap-0">
              <Page.Title>Transactions</Page.Title>
              <Page.Description>
                Record income, expenses, and money moved to your savings
                buckets.
              </Page.Description>
            </Page.Header>

            <CreateTransactionForm />
          </Toolbar.Content>
        </Toolbar.Root>

        <TransactionList />
      </Page.Content>
    </Page.Root>
  )
}
