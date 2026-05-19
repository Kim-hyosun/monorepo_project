'use client'

import type { ReactNode } from 'react'

interface Props {
  title: string
  description?: string
  actions?: ReactNode
}

export function PageHeader({ title, description, actions }: Props) {
  return (
    <div className='flex items-start justify-between gap-4'>
      <div>
        <h2 className='text-xl font-semibold'>{title}</h2>
        {description ? <p className='text-muted-foreground mt-1 text-sm'>{description}</p> : null}
      </div>
      {actions ? <div className='flex items-center gap-2'>{actions}</div> : null}
    </div>
  )
}
