'use client'

import { LoginForm } from '../components/LoginForm'

export function LoginPage() {
  return (
    <main className='flex min-h-screen items-center justify-center'>
      <div className='flex flex-col items-center gap-6'>
        <h1 className='text-2xl font-bold'>Admin Login</h1>
        <LoginForm />
      </div>
    </main>
  )
}
