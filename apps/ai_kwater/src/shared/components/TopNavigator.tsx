'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/shared/utils/cn'

const PROCESS_LINKS: { path: string; label: string }[] = [
  { path: '/receivingAlgorithm', label: '착수' },
  { path: '/cgAlgorithm', label: '응집' },
  { path: '/mtccAlgorithm', label: '혼화' },
  { path: '/sedimentationAlgorithm', label: '침전' },
  { path: '/filterAlgorithm', label: '여과' },
  { path: '/gacAlgorithm', label: 'GAC' },
  { path: '/ozoneAlgorithm', label: '오존' },
  { path: '/disinfectionAlgorithm', label: '소독' },
]

interface Props {
  variant?: 'light' | 'dark'
}

export function TopNavigator({ variant = 'light' }: Props) {
  const pathname = usePathname()
  const isDark = variant === 'dark'

  return (
    <nav
      className={cn(
        'flex flex-wrap items-center gap-2 rounded-md border p-2',
        isDark
          ? 'border-[var(--aio-panel-border)] bg-[var(--aio-panel)]'
          : 'bg-muted/30',
      )}
    >
      {PROCESS_LINKS.map((link) => {
        const active = pathname.startsWith(link.path)
        return (
          <Link
            key={link.path}
            href={link.path}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              isDark
                ? active
                  ? 'bg-[var(--aio-accent)]/30 text-white'
                  : 'text-[var(--aio-subtitle)] hover:bg-white/10'
                : active
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted',
            )}
            style={isDark && active ? { textShadow: 'var(--aio-text-glow)' } : undefined}
          >
            {link.label}
          </Link>
        )
      })}
    </nav>
  )
}
