'use client'

import { usePathname } from 'next/navigation'

import { findRouteMeta } from '@/shared/navigation/routes'

export default function PagePlaceholder() {
  const pathname = usePathname()
  const meta = findRouteMeta(pathname)
  const title = meta?.label ?? pathname

  return (
    <div className='flex h-full min-h-[60vh] flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12'>
      <span className='text-muted-foreground text-xs tracking-wider uppercase'>
        {meta?.group ?? 'route'}
      </span>
      <h2 className='text-2xl font-semibold'>{title}</h2>
      <p className='text-muted-foreground text-sm'>
        경로 <code className='bg-muted rounded px-1.5 py-0.5 text-xs'>{pathname}</code> 마이그레이션 대기 중
      </p>
    </div>
  )
}
