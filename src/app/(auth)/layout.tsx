import { BackgroundBeams } from '@/components/ui/background-beams'

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="z-50">{children}</div>

      <BackgroundBeams />
    </div>
  )
}
