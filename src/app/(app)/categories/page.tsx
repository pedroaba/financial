'use client'

import * as Dialog from '@radix-ui/react-dialog'
import { useEffect, useState } from 'react'

type Category = {
  id: string
  userId: string
  name: string
  color: string | null
  icon: string | null
  kind: string
  createdAt: string
  updatedAt: string
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formName, setFormName] = useState('')
  const [formColor, setFormColor] = useState('')
  const [formKind, setFormKind] = useState<'expense' | 'income' | 'investment'>(
    'expense',
  )
  const [submitting, setSubmitting] = useState(false)

  async function fetchCategories() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/categories', { credentials: 'include' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Failed to load categories')
      }
      const data = await res.json()
      setCategories(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  function openCreate() {
    setEditingId(null)
    setFormName('')
    setFormColor('')
    setFormKind('expense')
    setDialogOpen(true)
  }

  function openEdit(cat: Category) {
    setEditingId(cat.id)
    setFormName(cat.name)
    setFormColor(cat.color ?? '')
    setFormKind((cat.kind as 'expense' | 'income' | 'investment') ?? 'expense')
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      const body = {
        name: formName.trim(),
        color: formColor.trim() || undefined,
        kind: formKind,
      }
      const url = editingId ? `/api/categories/${editingId}` : '/api/categories'
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
      await fetchCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Request failed')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id: string, name: string) {
    if (
      !window.confirm(
        `Delete category "${name}"? Expenses using it will become uncategorized.`,
      )
    ) {
      return
    }
    setError(null)
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.message ?? 'Delete failed')
      }
      await fetchCategories()
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Delete failed')
    }
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-zinc-100">Categories</h1>
        <button
          type="button"
          onClick={openCreate}
          className="rounded-md bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:ring-offset-2 focus:ring-offset-zinc-950"
        >
          Add category
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
        <p className="mt-6 text-zinc-400">Loading…</p>
      ) : categories.length === 0 ? (
        <p className="mt-6 text-zinc-400">
          No categories yet. Create one to organize your expenses.
        </p>
      ) : (
        <ul className="mt-6 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 p-4"
            >
              <div className="min-w-0">
                <span
                  className="mr-2 inline-block h-3 w-3 shrink-0 rounded-full"
                  style={{
                    backgroundColor: cat.color || undefined,
                  }}
                  aria-hidden
                />
                <span className="font-medium text-zinc-100">{cat.name}</span>
                <span className="ml-2 text-xs text-zinc-500 capitalize">
                  {cat.kind}
                </span>
              </div>
              <div className="flex shrink-0 gap-2">
                <button
                  type="button"
                  onClick={() => openEdit(cat)}
                  className="rounded px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-500"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(cat.id, cat.name)}
                  className="rounded px-2 py-1 text-sm text-red-400 hover:bg-red-500/10 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <Dialog.Content
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl border border-zinc-800 bg-zinc-900 p-6 shadow-lg focus:outline-none"
            aria-describedby={undefined}
            onPointerDownOutside={(e) => e.preventDefault()}
          >
            <Dialog.Title className="text-lg font-semibold text-zinc-100">
              {editingId ? 'Edit category' : 'New category'}
            </Dialog.Title>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label
                  htmlFor="cat-name"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Name
                </label>
                <input
                  id="cat-name"
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="e.g. Food"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="cat-color"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Color (hex, optional)
                </label>
                <input
                  id="cat-color"
                  type="text"
                  value={formColor}
                  onChange={(e) => setFormColor(e.target.value)}
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  placeholder="#3b82f6"
                  disabled={submitting}
                />
              </div>
              <div>
                <label
                  htmlFor="cat-kind"
                  className="block text-sm font-medium text-zinc-300"
                >
                  Kind
                </label>
                <select
                  id="cat-kind"
                  value={formKind}
                  onChange={(e) =>
                    setFormKind(
                      e.target.value as 'expense' | 'income' | 'investment',
                    )
                  }
                  className="mt-1 block w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                  disabled={submitting}
                >
                  <option value="expense">Expense</option>
                  <option value="income">Income</option>
                  <option value="investment">Investment</option>
                </select>
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
