import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import Providers from './providers'
import { cn } from '@/shared/utils/cn'
import '@/styles/globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '사주 만세력',
  description: '재미로만 즐겨봅시다.',
  icons: { icon: '/icon.png' },
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
