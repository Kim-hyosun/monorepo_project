import type { Metadata } from 'next'
import Providers from './providers'
import '@/styles/globals.css'

export const metadata: Metadata = {
  title: 'Customer',
  description: 'Monorepo customer app',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
