'use client'

import { useMemo } from 'react'

import { Button } from '@/shared/ui/button'

interface Props {
  page: number
  pageCount: number
  onChange: (page: number) => void
}

const VISIBLE_PAGES = 10

export function SimplePagination({ page, pageCount, onChange }: Props) {
  const pages = useMemo(() => {
    if (pageCount <= VISIBLE_PAGES) return Array.from({ length: pageCount }, (_, i) => i)
    const leftCount = 5
    const rightCount = 4
    if (page <= leftCount) return Array.from({ length: VISIBLE_PAGES }, (_, i) => i)
    if (page >= pageCount - leftCount) {
      const start = pageCount - (leftCount + rightCount) - 1
      return Array.from({ length: VISIBLE_PAGES }, (_, i) => start + i)
    }
    return Array.from({ length: VISIBLE_PAGES }, (_, i) => page - rightCount + i)
  }, [page, pageCount])

  if (pageCount <= 1) return null

  return (
    <div className='flex items-center justify-center gap-1'>
      <Button
        size='sm'
        variant='outline'
        disabled={page === 0}
        onClick={() => onChange(Math.max(0, page - 1))}
      >
        이전
      </Button>
      {pages.map((n) => (
        <Button
          key={n}
          size='sm'
          variant={n === page ? 'default' : 'ghost'}
          onClick={() => onChange(n)}
        >
          {n + 1}
        </Button>
      ))}
      <Button
        size='sm'
        variant='outline'
        disabled={page === pageCount - 1}
        onClick={() => onChange(Math.min(pageCount - 1, page + 1))}
      >
        다음
      </Button>
    </div>
  )
}
