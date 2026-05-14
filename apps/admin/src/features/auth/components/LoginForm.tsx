'use client'

import { Button } from '@monorepo/ui'
import { useLoginForm } from '../hooks/useLoginForm'
import { useLoginMutation } from '../queries/useLoginMutation'

export function LoginForm() {
  const form = useLoginForm()
  const login = useLoginMutation()

  return (
    <form
      onSubmit={form.handleSubmit((values) => login.mutate(values))}
      className='flex w-80 flex-col gap-3'
    >
      <input
        type='email'
        placeholder='Email'
        className='rounded border border-gray-300 px-3 py-2'
        {...form.register('email')}
      />
      {form.formState.errors.email && (
        <p className='text-sm text-red-500'>{form.formState.errors.email.message}</p>
      )}
      <input
        type='password'
        placeholder='Password'
        className='rounded border border-gray-300 px-3 py-2'
        {...form.register('password')}
      />
      {form.formState.errors.password && (
        <p className='text-sm text-red-500'>{form.formState.errors.password.message}</p>
      )}
      <Button type='submit' disabled={login.isPending}>
        {login.isPending ? 'Logging in...' : 'Login'}
      </Button>
    </form>
  )
}
