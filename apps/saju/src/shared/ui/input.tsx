import * as React from 'react'

import { cn } from '@/shared/utils/cn'

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, type, ...props }, ref) {
  return (
    <input
      ref={ref}
      type={type}
      data-slot='input'
      className={cn(
        'border-input bg-background placeholder:text-muted-foreground focus-visible:ring-ring file:text-foreground flex h-10 w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-1 aria-invalid:ring-destructive/40',
        className
      )}
      {...props}
    />
  )
})
