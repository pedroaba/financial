'use client'

import * as React from 'react'
import { ChevronDownIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

export interface CommandSelectOption {
  value: string
  label: string
}

export interface CommandSelectProps {
  options: CommandSelectOption[]
  value: string | null
  onChange: (value: string | null) => void
  placeholder?: string
  searchPlaceholder?: string
  emptyText?: string
  showNoneOption?: boolean
  disabled?: boolean
  className?: string
  id?: string
}

export function CommandSelect({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found.',
  showNoneOption = true,
  disabled = false,
  className,
  id,
}: CommandSelectProps) {
  const [open, setOpen] = React.useState(false)

  const selectedOption = React.useMemo(
    () => options.find((o) => o.value === value) ?? null,
    [options, value],
  )

  const displayText = selectedOption?.label ?? placeholder

  const handleSelect = (selectedValue: string | null) => {
    onChange(selectedValue)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          data-empty={!selectedOption}
          disabled={disabled}
          className={cn(
            'border-input h-9 w-full justify-between rounded border bg-transparent px-3 py-1 text-left text-base font-normal shadow-none outline-none transition-[color,box-shadow] hover:bg-transparent hover:shadow-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] md:text-sm',
            'data-[empty=true]:text-muted-foreground',
            className,
          )}
        >
          <span className="truncate">{displayText}</span>
          <ChevronDownIcon className="ml-2 size-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-(--radix-popover-trigger-width) rounded-md border border-input bg-background p-0 shadow-md"
        align="start"
      >
        <Command className="rounded-md border-0 bg-transparent">
          <CommandInput placeholder={searchPlaceholder} autoFocus />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            <CommandGroup>
              {showNoneOption && (
                <CommandItem
                  value="__none__"
                  onSelect={() => handleSelect(null)}
                >
                  —
                </CommandItem>
              )}
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => handleSelect(option.value)}
                >
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
