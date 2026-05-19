'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { cn } from '@/shared/utils/cn'
import {
  aioRoutes,
  emsRoutes,
  pmsRoutes,
  pocRoutes,
  type RouteMeta,
} from '@/shared/navigation/routes'

const groups: { title: string; items: RouteMeta[] }[] = [
  { title: 'AIO', items: aioRoutes },
  { title: 'PMS', items: pmsRoutes },
  { title: 'EMS', items: emsRoutes },
  { title: 'PoC', items: pocRoutes },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className='bg-muted/30 sticky top-0 h-screen w-64 shrink-0 overflow-y-auto border-r'>
      <div className='p-4'>
        <Link href='/' className='block text-base font-semibold'>
          AI Kwater
        </Link>
        <p className='text-muted-foreground mt-1 text-xs'>성남정수장 마이그레이션</p>
      </div>

      <nav className='space-y-4 px-3 pb-8'>
        {groups.map((group) => (
          <div key={group.title}>
            <p className='text-muted-foreground px-2 py-1 text-[10px] font-semibold tracking-wider uppercase'>
              {group.title}
            </p>
            <ul className='space-y-0.5'>
              {group.items.map((route) => {
                const active = pathname === route.path
                return (
                  <li key={route.path}>
                    <Link
                      href={route.path}
                      className={cn(
                        'block rounded px-2 py-1.5 text-xs transition-colors',
                        active
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted text-foreground/80'
                      )}
                    >
                      {route.label}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  )
}
