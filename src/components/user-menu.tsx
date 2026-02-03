'use client'

import {
  Bell,
  CreditCard,
  HelpCircle,
  LogOut,
  Settings,
  Shield,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { authClient } from '@/lib/auth-client'
import { cn } from '@/lib/utils'
import { getUsernameInitial } from '@/utils/get-initials'

import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu'
import { Skeleton } from './ui/skeleton'

export function UserMenu() {
  const router = useRouter()

  const { data: session, isPending } = authClient.useSession()
  const user = session?.user

  async function handleLogout() {
    await authClient.signOut()
    router.push('/login')
  }

  if (isPending || !user) {
    return <Skeleton className="size-8 rounded-full" />
  }

  const displayName = user.name ?? user.email ?? 'User'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            'rounded-full outline-none cursor-pointer',
            'ring-border ring-2 ring-offset-2 ring-offset-background',
            'transition-shadow',
            'focus-visible:ring-ring focus-visible:ring-2',
            'hover:ring-muted-foreground/30',
          )}
          aria-label="Open user menu"
        >
          <Avatar size="default" className="size-7">
            <AvatarImage src={user.image ?? undefined} alt={displayName} />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
              {getUsernameInitial(displayName)}
            </AvatarFallback>
          </Avatar>
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="min-w-56 w-72"
      >
        <DropdownMenuLabel className="font-normal px-2 py-2">
          <div className="flex flex-col gap-1.5">
            <p className="text-sm font-medium leading-snug wrap-break-word">
              {displayName}
            </p>
            {user.email && (
              <p className="text-muted-foreground truncate text-xs leading-snug">
                {user.email}
              </p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="px-1 py-0.5">
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/account-settings" className="flex items-center gap-3">
              <Settings className="size-4 shrink-0" />
              <span className="min-w-0">Account Settings</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href="/account-settings/billing"
              className="flex items-center gap-3"
            >
              <CreditCard className="size-4 shrink-0" />
              <span className="min-w-0">Billing & Subscription</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href="/account-settings/security"
              className="flex items-center gap-3"
            >
              <Shield className="size-4 shrink-0" />
              <span className="min-w-0">Security</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link
              href="/account-settings/notifications"
              className="flex items-center gap-3"
            >
              <Bell className="size-4 shrink-0" />
              <span className="min-w-0">Notifications</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="cursor-pointer">
            <Link href="/support" className="flex items-center gap-3">
              <HelpCircle className="size-4 shrink-0" />
              <span className="min-w-0">Help & Support</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer focus:bg-destructive/10 focus:text-destructive"
          onSelect={handleLogout}
        >
          <LogOut className="size-4 shrink-0" />
          <span className="min-w-0">Logout</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
