'use client'

import Link from 'next/link'
import { Button } from '@monorepo/ui'

export default function HomePage() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-center gap-6 p-8'>
      <h1 className='text-3xl font-bold'>Admin App</h1>
      <p className='text-gray-600'>shared package: @monorepo/ui</p>
      <div className='flex gap-3'>
        <Link href='/login'>
          <Button variant='secondary'>Go to Login</Button>
        </Link>
        <Link href='/users'>
          <Button>Go to Users</Button>
        </Link>
      </div>
    </main>
  )
}
