'use client'

import * as Dialog from '@radix-ui/react-dialog'
import Link from 'next/link'
import { useEffect, useState } from 'react'

type Bucket = {
  id: string
  userId: string
  name: string
  institution: string | null
  goalAmount: string | null
  createdAt: string
  updatedAt: string
}

export default function InvestmentsPage() {
  const [buckets, setBuckets] = useState<Bucket[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [formName, setFormName] = useState('')
  const [formInstitution, setFormInstitution] = useState('')
  const [formGoalAmount, setFormGoalAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function fetchBuckets() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/investments/buckets', {
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Failed to load buckets')
      }
      const data = await res.json()
      setBuckets(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load buckets')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBuckets()
  }, [])

  function openCreate() {
    setFormName('')
    setFormInstitution('')
    setFormGoalAmount('')
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/investments/buckets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: formName.trim(),
          institution: formInstitution.trim() || undefined,
          goalAmount: formGoalAmount.trim() || undefined,
        }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Request failed')
      }
      setDialogOpen(false)
      await fetchBuckets()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Investments</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background"
        >
          Create bucket
        </button>
      </div>

      {error && (
        <div
          className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      )}

      {loading ? (
        <p className="mt-6 text-muted-foreground">Loading…</p>
      ) : buckets.length === 0 ? (
        <p className="mt-6 text-muted-foreground">
          No buckets yet. Create one to track savings (e.g. Nubank-style
          caixinhas).
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {buckets.map((bucket) => (
            <li key={bucket.id}>
              <Link
                href={`/investments/${bucket.id}`}
                className="block rounded-lg border border-border bg-card/50 p-4 transition-colors hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <span className="font-medium text-foreground">{bucket.name}</span>
                {bucket.institution && (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    {bucket.institution}
                  </span>
                )}
                {bucket.goalAmount && (
                  <span className="mt-1 block text-sm text-muted-foreground">
                    Goal:{' '}
                    {Number(bucket.goalAmount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </span>
                )}
                <span className="mt-2 block text-sm text-muted-foreground">
                  View details →
                </span>
              </Link>
            </li>
          ))}
        </ul>
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
              New bucket
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="bucket-name"
                  className="block text-sm font-medium text-foreground"
                >
                  Name *
                </label>
                <input
                  id="bucket-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-muted px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="e.g. Emergency fund"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="bucket-institution"
                  className="block text-sm font-medium text-foreground"
                >
                  Institution (optional)
                </label>
                <input
                  id="bucket-institution"
                  type="text"
                  value={formInstitution}
                  onChange={(e) => setFormInstitution(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-muted px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="e.g. Nubank"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="bucket-goal"
                  className="block text-sm font-medium text-foreground"
                >
                  Goal amount (optional)
                </label>
                <input
                  id="bucket-goal"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formGoalAmount}
                  onChange={(e) => setFormGoalAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-input bg-muted px-3 py-2 text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
                  placeholder="0.00"
                  disabled={submitting}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
                >
                  {submitting ? 'Creating…' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
