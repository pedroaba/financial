import { SidebarTrigger } from './ui/sidebar'
import { UserMenu } from './user-menu'

export function AppHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b border-sidebar-border bg-background/95 px-4 backdrop-blur supports-backdrop-filter:bg-background/60">
      <SidebarTrigger />
      <div className="ml-auto flex items-center">
        <UserMenu />
      </div>
    </header>
  )
}
