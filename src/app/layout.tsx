import './globals.css'

import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

import { Toaster } from '@/components/ui/sonner'
import { ReactQueryProvider } from '@/lib/react-query-provider'
import { cn } from '@/lib/utils'

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
})

export const metadata: Metadata = {
  title: {
    template: '%s | Financial Management',
    default: 'Financial Management',
  },
  description: 'Financial Management, Budgeting, and Tracking',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={cn(geist.className, 'dark')}>
      <body>
        <NuqsAdapter>
          <ReactQueryProvider>{children}</ReactQueryProvider>
        </NuqsAdapter>

        <Toaster />
      </body>
    </html>
  )
}
