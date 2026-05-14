'use client'

import { useParams } from 'next/navigation'

export default function UserDetailPage() {
  const params = useParams<{ id: string }>()
  return (
    <main className='p-8'>
      <h1 className='text-2xl font-bold'>User Detail</h1>
      <p className='text-muted-foreground mt-2'>id: {params.id}</p>
    </main>
  )
}
