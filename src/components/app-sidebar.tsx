'use client'

import {
  DollarSign,
  LayoutDashboard,
  Settings,
  Tags,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/expenses', label: 'Expenses', icon: Wallet },
  { href: '/categories', label: 'Categories', icon: Tags },
  { href: '/investments', label: 'Investments', icon: TrendingUp },
  { href: '/account-settings', label: 'Account Settings', icon: Settings },
] as const

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" side="left">
      <SidebarHeader className="h-14 min-h-14 flex-row items-center justify-center border-b border-sidebar-border px-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg" tooltip="Finance">
              <Link
                href="/dashboard"
                className="group-data-[collapsible=icon]:justify-center"
              >
                <DollarSign className="size-4 shrink-0 hidden group-data-[collapsible=icon]:inline-flex" />
                <span className="font-semibold text-sidebar-foreground group-data-[collapsible=icon]:hidden">
                  Finance
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                    >
                      <Link href={item.href}>
                        <Icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarRail />
      </SidebarFooter>
    </Sidebar>
  )
}
