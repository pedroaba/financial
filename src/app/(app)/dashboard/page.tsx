'use client'

import { useEffect, useState } from 'react'
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

type Expense = {
  id: string
  amount: string
  description: string | null
  occurredAt: string
  categoryId: string | null
  categoryName: string | null
  categoryColor: string | null
}

const COLORS = [
  '#3b82f6',
  '#22c55e',
  '#eab308',
  '#ef4444',
  '#8b5cf6',
  '#ec4899',
  '#06b6d4',
  '#f97316',
]

function getDefaultDateRange() {
  const end = new Date()
  const start = new Date()
  start.setDate(start.getDate() - 30)
  return {
    dateFrom: start.toISOString().slice(0, 10),
    dateTo: end.toISOString().slice(0, 10),
  }
}

export default function DashboardPage() {
  const { dateFrom: defaultFrom, dateTo: defaultTo } = getDefaultDateRange()
  const [dateFrom, setDateFrom] = useState(defaultFrom)
  const [dateTo, setDateTo] = useState(defaultTo)
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    // Defer to avoid synchronous setState in effect (react-hooks/set-state-in-effect)
    queueMicrotask(() => {
      if (!cancelled) {
        setLoading(true)
        setError(null)
      }
    })
    const params = new URLSearchParams({
      dateFrom: new Date(dateFrom).toISOString(),
      dateTo: new Date(dateTo + 'T23:59:59').toISOString(),
    })
    fetch(`/api/expenses?${params}`, { credentials: 'include' })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load expenses')
        return res.json()
      })
      .then((data) => {
        if (!cancelled) setExpenses(data)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Error')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [dateFrom, dateTo])

  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0)

  const byCategory = expenses.reduce<
    Record<string, { name: string; value: number; color: string }>
  >((acc, e) => {
    const key = e.categoryId ?? 'uncategorized'
    const name = e.categoryName ?? 'Uncategorized'
    if (!acc[key]) {
      acc[key] = {
        name,
        value: 0,
        color:
          e.categoryColor ?? COLORS[Object.keys(acc).length % COLORS.length],
      }
    }
    acc[key].value += Number(e.amount)
    return acc
  }, {})
  const categoryData = Object.values(byCategory).sort(
    (a, b) => b.value - a.value,
  )

  const byDay = expenses.reduce<Record<string, number>>((acc, e) => {
    const day = e.occurredAt.slice(0, 10)
    acc[day] = (acc[day] ?? 0) + Number(e.amount)
    return acc
  }, {})
  const dayData = Object.entries(byDay)
    .map(([date, value]) => ({ date, value }))
    .sort((a, b) => a.date.localeCompare(b.date))

  if (error) {
    return (
      <main className="p-6">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div
          className="mt-4 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-400"
          role="alert"
        >
          {error}
        </div>
      </main>
    )
  }

  return (
    <main className="p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <div className="flex gap-2">
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="From date"
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="rounded-md border border-input bg-muted px-3 py-2 text-sm text-foreground focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
            aria-label="To date"
          />
        </div>
      </div>

      {loading ? (
        <p className="mt-6 text-muted-foreground">Loading…</p>
      ) : expenses.length === 0 ? (
        <div className="mt-6 rounded-lg border border-border bg-card/30 p-8 text-center text-muted-foreground">
          <p>No expenses in this period.</p>
          <p className="mt-2 text-sm">
            Add expenses to see totals and charts here.
          </p>
        </div>
      ) : (
        <>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">Total spent</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {totalSpent.toLocaleString('pt-BR', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">Transactions</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {expenses.length}
              </p>
            </div>
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <p className="text-sm font-medium text-muted-foreground">Top category</p>
              <p className="mt-1 text-2xl font-semibold text-foreground">
                {categoryData[0]?.name ?? '—'}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-8 lg:grid-cols-2">
            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h2 className="text-lg font-medium text-foreground">
                Spending over time
              </h2>
              <div className="mt-4 h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dayData}>
                    <XAxis
                      dataKey="date"
                      tick={{ fill: '#a1a1aa' }}
                      tickFormatter={(v) =>
                        new Date(v).toLocaleDateString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                        })
                      }
                    />
                    <YAxis
                      tick={{ fill: '#a1a1aa' }}
                      tickFormatter={(v) =>
                        Number(v).toLocaleString('pt-BR', {
                          maximumFractionDigits: 0,
                        })
                      }
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#27272a',
                        border: '1px solid #3f3f46',
                        borderRadius: '8px',
                      }}
                      labelStyle={{ color: '#e4e4e7' }}
                      formatter={(value: number) => [
                        value.toLocaleString('pt-BR', {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                        'Total',
                      ]}
                      labelFormatter={(label) =>
                        new Date(label).toLocaleDateString('pt-BR')
                      }
                    />
                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-card/50 p-4">
              <h2 className="text-lg font-medium text-foreground">By category</h2>
              <div className="mt-4 h-64">
                {categoryData.length === 0 ? (
                  <p className="flex h-full items-center justify-center text-muted-foreground">
                    No categories
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) =>
                          `${name} ${(percent * 100).toFixed(0)}%`
                        }
                        labelLine={{ stroke: '#71717a' }}
                      >
                        {categoryData.map((_, i) => (
                          <Cell
                            key={i}
                            fill={
                              categoryData[i].color ?? COLORS[i % COLORS.length]
                            }
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#27272a',
                          border: '1px solid #3f3f46',
                          borderRadius: '8px',
                        }}
                        formatter={(value: number) => [
                          value.toLocaleString('pt-BR', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          }),
                          'Total',
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}
