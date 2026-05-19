'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'

import { ModeToggleBar, type OperationMode } from '@/shared/components/ModeToggleBar'
import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/utils/cn'

interface StepInfo {
  current: 3 | 4
  threePath: string
  fourPath: string | null
}

interface Props {
  title: string
  step?: StepInfo
  mode?: OperationMode | null
  onModeChange?: (mode: OperationMode) => void
  isModifyMode?: boolean
  onModifyToggle?: () => void
  onSave?: () => void
  saveDisabled?: boolean
  extra?: ReactNode
  variant?: 'light' | 'dark'
}

export function ProcessPageHeader({
  title,
  step,
  mode,
  onModeChange,
  isModifyMode,
  onModifyToggle,
  onSave,
  saveDisabled,
  extra,
  variant = 'light',
}: Props) {
  const pathname = usePathname()
  const isDark = variant === 'dark'

  return (
    <div
      className={cn(
        'flex flex-wrap items-center gap-3 rounded-lg border p-3',
        isDark
          ? 'border-[var(--aio-panel-border)] bg-[var(--aio-panel)] text-white'
          : '',
      )}
      style={
        isDark ? { backgroundImage: 'var(--aio-divider-gradient)', backgroundBlendMode: 'overlay' } : undefined
      }
    >
      <h2
        className={cn('text-lg font-semibold', isDark ? 'text-white' : '')}
        style={isDark ? { textShadow: 'var(--aio-text-glow)' } : undefined}
      >
        {title}
      </h2>

      {step ? (
        <div
          className={cn(
            'flex items-center gap-1 rounded-md border p-1',
            isDark ? 'border-[var(--aio-panel-border)]' : '',
          )}
        >
          <StepButton href={step.threePath} active={pathname === step.threePath} isDark={isDark}>
            3단계
          </StepButton>
          {step.fourPath ? (
            <StepButton href={step.fourPath} active={pathname === step.fourPath} isDark={isDark}>
              4단계
            </StepButton>
          ) : null}
        </div>
      ) : null}

      <div className='flex flex-1 items-center justify-end gap-2'>
        {extra}
        {mode !== undefined && onModeChange ? (
          <div className='flex items-center gap-2'>
            <span
              className={cn('text-xs', isDark ? 'text-[var(--aio-subtitle)]' : 'text-muted-foreground')}
            >
              AI 운전모드
            </span>
            <ModeToggleBar
              value={mode}
              onChange={onModeChange}
              disabled={isModifyMode}
              variant={variant}
            />
          </div>
        ) : null}

        {onModifyToggle ? (
          isModifyMode ? (
            <>
              <Button size='sm' variant='outline' onClick={onModifyToggle}>
                취소
              </Button>
              {onSave ? (
                <Button size='sm' onClick={onSave} disabled={saveDisabled}>
                  저장
                </Button>
              ) : null}
            </>
          ) : (
            <Button size='sm' variant='secondary' onClick={onModifyToggle}>
              수정
            </Button>
          )
        ) : null}
      </div>
    </div>
  )
}

function StepButton({
  href,
  active,
  children,
  isDark,
}: {
  href: string
  active: boolean
  children: ReactNode
  isDark: boolean
}) {
  if (active) {
    return (
      <span
        className={cn(
          'rounded px-3 py-1 text-xs font-medium',
          isDark
            ? 'bg-[var(--aio-accent)]/30 text-white'
            : 'bg-primary text-primary-foreground',
        )}
        style={isDark ? { textShadow: 'var(--aio-text-glow)' } : undefined}
      >
        {children}
      </span>
    )
  }
  return (
    <Link
      href={href}
      className={cn(
        'rounded px-3 py-1 text-xs font-medium',
        isDark ? 'text-[var(--aio-subtitle)] hover:bg-white/10' : 'hover:bg-muted',
      )}
    >
      {children}
    </Link>
  )
}
