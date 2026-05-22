'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import { useUpdateSongsuAiOperation } from '@/features/ems/queries/emsQueries'
import type { AiOperationConfig, AiOperationMode } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  pyeongtaek: AiOperationConfig
  songsan: AiOperationConfig
}

export function AiOperationToggle({ pyeongtaek, songsan }: Props) {
  const update = useUpdateSongsuAiOperation()

  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>AI 운영</h3>
      <div className='grid grid-cols-2 gap-3'>
        <Block
          label='평택'
          config={pyeongtaek}
          onChange={(config) => update.mutate({ station: 'pyeongtaek', config })}
          disabled={update.isPending}
        />
        <Block
          label='송산'
          config={songsan}
          onChange={(config) => update.mutate({ station: 'songsan', config })}
          disabled={update.isPending}
        />
      </div>
    </AioPanel>
  )
}

function Block({
  label,
  config,
  onChange,
  disabled,
}: {
  label: string
  config: AiOperationConfig
  onChange: (config: AiOperationConfig) => void
  disabled?: boolean
}) {
  return (
    <div className='rounded-md border border-[var(--aio-panel-border)] bg-black/30 p-3'>
      <div className='mb-3 flex items-center justify-between'>
        <span className='text-sm font-semibold text-white' style={{ textShadow: 'var(--aio-text-glow)' }}>
          {label}
        </span>
        <button
          type='button'
          onClick={() => onChange({ ...config, enabled: !config.enabled })}
          disabled={disabled}
          className={cn(
            'rounded-full px-4 py-1 text-xs font-semibold transition disabled:opacity-50',
            config.enabled
              ? 'bg-emerald-400/30 text-emerald-200 ring-1 ring-emerald-300'
              : 'bg-white/10 text-white/60',
          )}
          style={config.enabled ? { textShadow: '0 0 6px #34d399' } : undefined}
        >
          {config.enabled ? 'ON' : 'OFF'}
        </button>
      </div>
      <div className='flex gap-2'>
        {(['auto', 'semi'] as AiOperationMode[]).map((m) => {
          const active = config.mode === m
          return (
            <button
              key={m}
              type='button'
              onClick={() => onChange({ ...config, mode: m })}
              disabled={disabled}
              className={cn(
                'flex-1 rounded px-2 py-1 text-xs font-medium transition disabled:opacity-50',
                active
                  ? 'bg-[var(--aio-accent)]/30 text-white'
                  : 'bg-white/5 text-white/70 hover:bg-white/10',
              )}
            >
              {m === 'auto' ? '자동' : '반자동'}
            </button>
          )
        })}
      </div>
    </div>
  )
}
