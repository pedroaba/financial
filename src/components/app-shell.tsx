'use client'

import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'

import { AppHeader } from './app-header'
import { AppSidebar } from './app-sidebar'

interface AppShellProps {
  children: React.ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <AppHeader />

        <main className="flex-1">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
