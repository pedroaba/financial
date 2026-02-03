'use client'

import { Bell, Github, Shield, User } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/account-settings/general', label: 'General', icon: User },
  {
    href: '/account-settings/accounts',
    label: 'Connected Accounts',
    icon: Github,
  },
  { href: '/account-settings/security', label: 'Security', icon: Shield },
  {
    href: '/account-settings/notifications',
    label: 'Notifications',
    icon: Bell,
  },
] as const

export function SettingsSidebar() {
  const pathname = usePathname()

  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-zinc-800 bg-zinc-950">
      <ScrollArea className="flex-1">
        <nav className="flex flex-col gap-0.5 p-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 px-2 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'border-b-2 border-zinc-100 text-zinc-100'
                    : 'text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-200 border-b-2 border-transparent',
                )}
              >
                <Icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>
    </aside>
  )
}
