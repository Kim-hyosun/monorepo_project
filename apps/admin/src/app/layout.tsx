import type { Metadata } from 'next'
import Providers from './providers'
import '@/styles/globals.css'
import { Geist } from 'next/font/google'
import { cn } from '@/shared/utils/cn'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'Admin',
  description: 'Monorepo admin app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko' className={cn('font-sans', geist.variable)} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
