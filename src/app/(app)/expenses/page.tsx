'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

type Expense = {
  id: string
  userId: string
  categoryId: string | null
  amount: string
  description: string | null
  occurredAt: string
  merchant: string | null
  notes: string | null
  createdAt: string
  updatedAt: string
  categoryName: string | null
  categoryColor: string | null
}

type Category = {
  id: string
  name: string
  color: string | null
  kind: string
}

export default function ExpensesPage() {
  const searchParams = useSearchParams()
  const actionFromUrl = searchParams.get('action')
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(actionFromUrl === 'add')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formAmount, setFormAmount] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formCategoryId, setFormCategoryId] = useState<string>('')
  const [formOccurredAt, setFormOccurredAt] = useState(() =>
    new Date().toISOString().slice(0, 16),
  )
  const [formMerchant, setFormMerchant] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [search, setSearch] = useState('')

  async function fetchExpenses() {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams()
      if (dateFrom) params.set('dateFrom', dateFrom)
      if (dateTo) params.set('dateTo', dateTo)
      if (search) params.set('search', search)
      const res = await fetch(`/api/expenses?${params}`, {
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Failed to load expenses')
      }
      const data = await res.json()
      setExpenses(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load expenses')
    } finally {
      setLoading(false)
    }
  }

  async function fetchCategories() {
    try {
      const res = await fetch('/api/categories', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
      }
    } catch {
      // ignore
    }
  }

  useEffect(() => {
    fetchExpenses()
    fetchCategories()
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetchExpenses/fetchCategories depend on state; intentional re-run on filter change only
  }, [dateFrom, dateTo, search])

  function openCreate() {
    setEditingId(null)
    setFormAmount('')
    setFormDescription('')
    setFormCategoryId('')
    setFormOccurredAt(new Date().toISOString().slice(0, 16))
    setFormMerchant('')
    setDialogOpen(true)
  }

  function openEdit(exp: Expense) {
    setEditingId(exp.id)
    setFormAmount(exp.amount)
    setFormDescription(exp.description ?? '')
    setFormCategoryId(exp.categoryId ?? '')
    setFormOccurredAt(
      exp.occurredAt
        ? new Date(exp.occurredAt).toISOString().slice(0, 16)
        : new Date().toISOString().slice(0, 16),
    )
    setFormMerchant(exp.merchant ?? '')
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const body = {
        amount: formAmount,
        description: formDescription.trim() || undefined,
        categoryId: formCategoryId || null,
        occurredAt: new Date(formOccurredAt).toISOString(),
        merchant: formMerchant.trim() || undefined,
      }
      const url = editingId ? `/api/expenses/${editingId}` : '/api/expenses'
      const method = editingId ? 'PUT' : 'POST'
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Request failed')
      }
      setDialogOpen(false)
      await fetchExpenses()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this expense?')) return
    setError(null)
    try {
      const res = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Delete failed')
      }
      await fetchExpenses()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <div className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-zinc-100">Expenses</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          Add expense
        </button>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          aria-label="From date"
        />
        <input
          type="date"
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          aria-label="To date"
        />
        <input
          type="search"
          placeholder="Search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          aria-label="Search expenses"
        />
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
        <p className="mt-6 text-zinc-400">Loading…</p>
      ) : expenses.length === 0 ? (
        <p className="mt-6 text-zinc-400">
          No expenses yet. Add one to get started.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-lg border border-zinc-800">
          <table className="w-full text-left text-sm text-zinc-300">
            <thead className="border-b border-zinc-800 bg-zinc-900/50">
              <tr>
                <th className="px-4 py-3 font-medium text-zinc-200">Date</th>
                <th className="px-4 py-3 font-medium text-zinc-200">
                  Description
                </th>
                <th className="px-4 py-3 font-medium text-zinc-200">
                  Category
                </th>
                <th className="px-4 py-3 font-medium text-zinc-200 text-right">
                  Amount
                </th>
                <th className="px-4 py-3 w-24" aria-label="Actions" />
              </tr>
            </thead>
            <tbody>
              {expenses.map((exp) => (
                <tr
                  key={exp.id}
                  className="border-b border-zinc-800/50 hover:bg-zinc-800/30"
                >
                  <td className="px-4 py-3 text-zinc-400">
                    {new Date(exp.occurredAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <span className="font-medium text-zinc-100">
                      {exp.description || exp.merchant || '—'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className="inline-block h-2 w-2 shrink-0 rounded-full mr-1.5 align-middle"
                      style={{
                        backgroundColor: exp.categoryColor ?? undefined,
                      }}
                      aria-hidden
                    />
                    {exp.categoryName ?? 'Uncategorized'}
                  </td>
                  <td className="px-4 py-3 text-right font-medium text-zinc-100">
                    {Number(exp.amount).toLocaleString('pt-BR', {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => openEdit(exp)}
                        className="rounded px-2 py-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete(exp.id)}
                        className="rounded px-2 py-1 text-red-400 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
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
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg focus:outline-none"
            aria-describedby={undefined}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <Dialog.Title className="text-lg font-semibold text-zinc-100">
              {editingId ? 'Edit expense' : 'New expense'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="exp-amount"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Amount *
                </label>
                <input
                  id="exp-amount"
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={formAmount}
                  onChange={(e) => setFormAmount(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="exp-occurred"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Date *
                </label>
                <input
                  id="exp-occurred"
                  type="datetime-local"
                  required
                  value={formOccurredAt}
                  onChange={(e) => setFormOccurredAt(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="exp-description"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Description
                </label>
                <input
                  id="exp-description"
                  type="text"
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="What was it for?"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="exp-category"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Category
                </label>
                <select
                  id="exp-category"
                  value={formCategoryId}
                  onChange={(e) => setFormCategoryId(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  disabled={submitting}
                >
                  <option value="">Uncategorized</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label
                  htmlFor="exp-merchant"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Merchant
                </label>
                <input
                  id="exp-merchant"
                  type="text"
                  value={formMerchant}
                  onChange={(e) => setFormMerchant(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="Store name"
                  disabled={submitting}
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="rounded-md px-3 py-2 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                  >
                    Cancel
                  </button>
                </Dialog.Close>
                <button
                  type="submit"
                  disabled={submitting}
                  className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 disabled:opacity-50"
                >
                  {submitting ? 'Saving…' : editingId ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}
