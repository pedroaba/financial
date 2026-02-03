'use client'

import * as React from 'react'

import { cn } from '@/lib/utils'

interface SettingBlockProps {
  title: string
  description: string
  hint?: string
  children: React.ReactNode
  action?: React.ReactNode
  className?: string
}

/**
 * Vercel-style setting block: title, description, content, optional hint and action (e.g. Save).
 */
export function SettingBlock({
  title,
  description,
  hint,
  children,
  action,
  className,
}: SettingBlockProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-4 border-b border-zinc-800 py-8 first:pt-0 last:border-b-0',
        className,
      )}
    >
      <div className="flex items-start justify-between gap-6">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="text-sm font-medium text-zinc-100">{title}</h3>
          <p className="text-sm text-zinc-400">{description}</p>
          <div className="mt-3 max-w-md">{children}</div>
          {hint && <p className="text-muted-foreground text-xs">{hint}</p>}
        </div>
        {action && <div className="shrink-0 pt-0.5">{action}</div>}
      </div>
    </div>
  )
}
