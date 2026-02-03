interface AccountSettingsLayoutProps {
  children: React.ReactNode
}

export default async function AccountSettingsLayout({
  children,
}: AccountSettingsLayoutProps) {
  return (
    <div className="flex min-h-0 flex-1">
      <main className="min-w-0 flex-1 overflow-auto">{children}</main>
    </div>
  )
}
