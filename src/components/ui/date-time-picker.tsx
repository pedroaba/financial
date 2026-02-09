'use client'

import * as React from 'react'
import { format } from 'date-fns'
import { CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

/**
 * Converts a datetime string (ISO or "yyyy-MM-ddThh:mm") to a Date.
 */
function parseDateTimeValue(value: string | undefined): Date | undefined {
  if (!value || value.trim() === '') return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date
}

/**
 * Returns "yyyy-MM-ddThh:mm" for the given Date (local time).
 * Used for form state and datetime-local compatibility.
 */
function toDateTimeLocalString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

/**
 * Parses "HH:mm" or "H:mm" and applies to the given date.
 */
function setTimeOnDate(date: Date, timeStr: string): Date {
  const [hours = 0, minutes = 0] = timeStr.split(':').map(Number)
  const next = new Date(date)
  next.setHours(hours, minutes, 0, 0)
  return next
}

export interface DateTimePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  id?: string
}

export function DateTimePicker({
  value,
  onChange,
  placeholder = 'Pick date and time',
  disabled = false,
  className,
  id,
}: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  const date = React.useMemo(
    () => parseDateTimeValue(value),
    [value],
  )

  const timeStr = React.useMemo(() => {
    if (!date) return '00:00'
    const pad = (n: number) => n.toString().padStart(2, '0')
    return `${pad(date.getHours())}:${pad(date.getMinutes())}`
  }, [date])

  const displayText = date
    ? format(date, 'PPP') + ' ' + format(date, 'p')
    : placeholder

  const handleSelectDate = (selected: Date | undefined) => {
    if (!selected) {
      onChange?.(toDateTimeLocalString(new Date()))
      return
    }
    const withTime = timeStr
      ? setTimeOnDate(selected, timeStr)
      : selected
    onChange?.(toDateTimeLocalString(withTime))
  }

  const handleTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextTime = e.target.value
    const base = date ?? new Date()
    const next = setTimeOnDate(base, nextTime)
    onChange?.(toDateTimeLocalString(next))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="ghost"
          data-empty={!date}
          disabled={disabled}
          className={cn(
            'border-input h-9 w-full justify-start rounded border bg-transparent px-3 py-1 text-left text-base font-normal shadow-none outline-none transition-[color,box-shadow] hover:bg-transparent hover:shadow-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm',
            'data-[empty=true]:text-muted-foreground',
            className,
          )}
        >
          <CalendarIcon className="mr-2 size-4 shrink-0 opacity-70" />
          {displayText}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-auto border-input bg-background p-0 shadow-md"
        align="start"
      >
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelectDate}
        />
        <div className="border-t border-input p-3">
          <label
            htmlFor={`${id ?? 'time'}-input`}
            className="mb-1.5 block text-sm font-medium"
          >
            Time
          </label>
          <Input
            id={`${id ?? 'time'}-input`}
            type="time"
            value={timeStr}
            onChange={handleTimeChange}
            className="w-full"
          />
        </div>
      </PopoverContent>
    </Popover>
  )
}
