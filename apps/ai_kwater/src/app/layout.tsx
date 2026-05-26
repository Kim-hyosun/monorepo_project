import type { Metadata } from 'next'
import Providers from './providers'
import '@/styles/globals.css'
import { Geist } from 'next/font/google'
import { cn } from '@/shared/utils/cn'

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

export const metadata: Metadata = {
  title: 'AI Kwater',
  description: 'AI Kwater app (migrated from 성남정수장)',
  // app/icon.png 컨벤션이 자동 적용되지만, 명시해두면 새 app 셋업 시 패턴 참고 쉬움.
  // 다른 favicon 원할 시: apps/<app>/src/app/icon.{png|svg|ico} 파일만 교체하면 됨.
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
