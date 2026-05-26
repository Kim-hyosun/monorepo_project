import type { Metadata } from 'next'
import { Geist } from 'next/font/google'

import Providers from './providers'
import { cn } from '@/shared/utils/cn'
import '@/styles/globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: '사주 만세력',
  description: '생년월일과 시간을 입력하면 사주 원국·오행·요약 분석을 보여줍니다',
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
