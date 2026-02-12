'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { CommandSelect } from '@/components/command-select'
import { listCategories } from '@/http/list-categories'

export interface CategorySelectorProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  kind?: 'income' | 'expense'
  className?: string
  id?: string
}

export function CategorySelector({
  value,
  onChange,
  placeholder = 'Select category',
  disabled = false,
  kind,
  className,
  id,
}: CategorySelectorProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['categories', 1, 100],
    queryFn: () => listCategories(1, 100),
  })

  const categories = data?.items ?? []

  const filteredCategories = React.useMemo(
    () => (kind ? categories.filter((c) => c.kind === kind) : categories),
    [categories, kind],
  )

  const options = React.useMemo(
    () => filteredCategories.map((c) => ({ value: c.id, label: c.name })),
    [filteredCategories],
  )

  return (
    <CommandSelect
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={isLoading ? 'Loading...' : placeholder}
      searchPlaceholder="Search categories..."
      emptyText="No category found."
      showNoneOption
      disabled={disabled || isLoading}
      className={className}
    />
  )
}
