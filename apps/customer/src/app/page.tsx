'use client'

import { Button } from '@monorepo/ui'

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 p-8'>
      <h1 className='text-3xl font-bold'>Customer App</h1>
      <p className='text-gray-600'>also uses @monorepo/ui — same Button as admin</p>
      <div className='flex gap-3'>
        <Button>Primary</Button>
        <Button variant='secondary'>Secondary</Button>
        <Button variant='ghost'>Ghost</Button>
      </div>
    </main>
  )
}
