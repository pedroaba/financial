'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Bucket = {
  id: string
  userId: string
  name: string
  institution: string | null
  goalAmount: string | null
  balance?: string
  createdAt: string
  updatedAt: string
}

type Transaction = {
  id: string
  userId: string
  bucketId: string
  type: 'deposit' | 'withdraw'
  amount: string
  occurredAt: string
  notes: string | null
  createdAt: string
  updatedAt: string
}

export default function BucketDetailPage() {
  const params = useParams()
  const bucketId = params.bucketId as string
  const [bucket, setBucket] = useState<Bucket | null>(null)
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formType, setFormType] = useState<'deposit' | 'withdraw'>('deposit')
  const [formAmount, setFormAmount] = useState('')
  const [formOccurredAt, setFormOccurredAt] = useState(() =>
    new Date().toISOString().slice(0, 16),
  )
  const [formNotes, setFormNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function fetchBucket() {
    try {
      const res = await fetch(`/api/investments/buckets/${bucketId}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Failed to load bucket')
      }
      const data = await res.json()
      setBucket(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load bucket')
    }
  }

  async function fetchTransactions() {
    try {
      const res = await fetch(
        `/api/investments/buckets/${bucketId}/transactions`,
        { credentials: 'include' },
      )
      if (!res.ok) throw new Error('Failed to load transactions')
      const data = await res.json()
      setTransactions(data)
    } catch {
      setTransactions([])
    }
  }

  useEffect(() => {
    setLoading(true)
    setError(null)
    Promise.all([fetchBucket(), fetchTransactions()]).finally(() =>
      setLoading(false),
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetch on bucketId change only; fetchBucket/fetchTransactions are stable
  }, [bucketId])

  function openAdd(type: 'deposit' | 'withdraw') {
    setFormType(type)
    setFormAmount('')
    setFormOccurredAt(new Date().toISOString().slice(0, 16))
    setFormNotes('')
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch(
        `/api/investments/buckets/${bucketId}/transactions`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({
            type: formType,
            amount: formAmount,
            occurredAt: new Date(formOccurredAt).toISOString(),
            notes: formNotes.trim() || undefined,
          }),
        },
      )
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Request failed')
      }
      setDialogOpen(false)
      await fetchBucket()
      await fetchTransactions()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading && !bucket) {
    return (
      <div className="p-6">
        <p className="text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (error && !bucket) {
    return (
      <div className="p-6">
        <div
          className="rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
        <Link
          href="/investments"
          className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to investments
        </Link>
      </div>
    )
  }

  const balance = bucket?.balance ?? '0'
  const goalAmount = bucket?.goalAmount ? Number(bucket.goalAmount) : null
  const balanceNum = Number(balance)
  const progress =
    goalAmount != null && goalAmount > 0
      ? Math.min(100, (balanceNum / goalAmount) * 100)
      : null

  return (
    <div className="p-6">
      <Link
        href="/investments"
        className="text-sm text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        ← Back to investments
      </Link>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {bucket?.name}
          </h1>
          {bucket?.institution && (
            <p className="text-sm text-muted-foreground">{bucket.institution}</p>
          )}
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => openAdd('deposit')}
            className="rounded-md bg-green-600 px-3 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-background"
          >
            Deposit
          </button>
          <button
            type="button"
            onClick={() => openAdd('withdraw')}
            className="rounded-md bg-secondary px-3 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
          >
            Withdraw
          </button>
        </div>
      </div>

      {error && (
        <div
          className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      <div className="mt-6 rounded-lg border border-border bg-card/50 p-4">
        <p className="text-sm font-medium text-muted-foreground">Balance</p>
        <p className="mt-1 text-3xl font-semibold text-foreground">
          {balanceNum.toLocaleString('pt-BR', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </p>
        {progress != null && goalAmount != null && (
          <div className="mt-4">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress to goal</span>
              <span>{progress.toFixed(0)}%</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Goal:{' '}
              {goalAmount.toLocaleString('pt-BR', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </p>
          </div>
        )}
      </div>

      <h2 className="mt-8 text-lg font-medium text-foreground">Transactions</h2>
      {transactions.length === 0 ? (
        <p className="mt-2 text-muted-foreground">No transactions yet.</p>
      ) : (
        <div className="mt-4 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-sm text-foreground">
            <thead className="border-b border-border bg-card/50">
              <tr>
                <th className="px-4 py-3 font-medium text-foreground">Date</th>
                <th className="px-4 py-3 font-medium text-foreground">Type</th>
                <th className="px-4 py-3 font-medium text-foreground text-right">
                  Amount
                </th>
                <th className="px-4 py-3 font-medium text-foreground">Notes</th>
              </tr>
            </thead>
            <tbody>
              {[...transactions].reverse().map((tx) => (
                <tr
                  key={tx.id}
                  className="border-b border-border/50 hover:bg-muted/30"
                >
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(tx.occurredAt).toLocaleString('pt-BR')}
                  </td>
                  <td className="px-4 py-3 capitalize">{tx.type}</td>
                  <td
                    className={`px-4 py-3 text-right font-medium ${
                      tx.type === 'deposit' ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    {tx.type === 'deposit' ? '+' : '-'}
                    {Number(tx.amount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{tx.notes ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-border bg-card p-6 shadow-lg focus:outline-none"
            aria-describedby={undefined}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <Dialog.Title className="text-lg font-semibold text-foreground">
              {formType === 'deposit' ? 'Deposit' : 'Withdraw'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="tx-amount"
                  className="block text-sm font-medium text-foreground"
                >
                  Amount *
                </label>
                <input
                  id="tx-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-muted px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="tx-occurred"
                  className="block text-sm font-medium text-foreground"
                >
                  Date *
                </label>
                <input
                  id="tx-occurred"
                  type="datetime-local"
                  required
                  value={formOccurredAt}
                  onChange={(e) => setFormOccurredAt(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-muted px-3 py-2 text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="tx-notes"
                  className="block text-sm font-medium text-foreground"
                >
                  Notes
                </label>
                <input
                  id="tx-notes"
                  type="text"
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-muted px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  disabled={submitting}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  {submitting
                    ? 'Saving…'
                    : formType === 'deposit'
                      ? 'Deposit'
                      : 'Withdraw'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
