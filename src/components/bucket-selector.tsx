'use client'

import { useQuery } from '@tanstack/react-query'
import * as React from 'react'

import { CommandSelect } from '@/components/command-select'
import { listBuckets } from '@/http/list-buckets'

export interface BucketSelectorProps {
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function BucketSelector({
  value,
  onChange,
  placeholder = 'Select bucket',
  disabled = false,
  className,
  id,
}: BucketSelectorProps) {
  const { data: buckets = [], isLoading } = useQuery({
    queryKey: ['buckets'],
    queryFn: listBuckets,
  })

  const options = React.useMemo(
    () => buckets.map((b) => ({ value: b.id, label: b.name })),
    [buckets],
  )

  return (
    <CommandSelect
      id={id}
      options={options}
      value={value}
      onChange={onChange}
      placeholder={isLoading ? 'Loading...' : placeholder}
      searchPlaceholder="Search buckets..."
      emptyText="No bucket found."
      showNoneOption
      disabled={disabled || isLoading}
      className={className}
    />
  )
}
