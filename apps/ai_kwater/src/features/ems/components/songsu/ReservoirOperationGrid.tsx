'use client'

import { AioPanel } from '@/shared/components/AioPanel'
import type { SongsuReservoir, SongsuValve } from '@/features/ems/types/ems'
import { cn } from '@/shared/utils/cn'

interface Props {
  reservoirs: SongsuReservoir[]
}

export function ReservoirOperationGrid({ reservoirs }: Props) {
  return (
    <AioPanel className='p-4'>
      <h3 className='mb-3 text-sm font-semibold text-[var(--aio-subtitle)]'>펌프 운영현황</h3>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[680px] text-xs'>
          <thead className='text-[var(--aio-subtitle)]'>
            <tr>
              <th className='w-24 py-2 text-left'>배수지</th>
              <th className='py-2 text-right'>유입</th>
              <th className='py-2 text-center'>밸브-IN</th>
              <th className='py-2 text-center'>수위 (상/하)</th>
              <th className='py-2 text-center'>밸브-OUT</th>
              <th className='py-2 text-right'>유출</th>
            </tr>
          </thead>
          <tbody className='text-white'>
            {reservoirs.flatMap((r) =>
              r.lines.map((line, lineIdx) => (
                <tr key={`${r.name}-${lineIdx}`} className='border-t border-[var(--aio-panel-border)]'>
                  <td className='py-2'>
                    {lineIdx === 0 ? (
                      <div className='flex items-baseline gap-2'>
                        <span className='font-semibold text-white' style={{ textShadow: 'var(--aio-text-glow)' }}>
                          {r.name}
                        </span>
                        {r.headerValue !== null ? (
                          <span className='text-[var(--aio-subtitle)]'>
                            {r.headerValue.toFixed(2)}
                          </span>
                        ) : null}
                      </div>
                    ) : (
                      <span className='ml-2 text-[var(--aio-subtitle)]'>line {lineIdx + 1}</span>
                    )}
                  </td>
                  <td className='py-2 text-right'>
                    <NumberCell value={line.inflow} unit='m³/h' />
                  </td>
                  <td className='py-2'>
                    <ValvePair valves={line.valvesIn} />
                  </td>
                  <td className='py-2'>
                    <WaterLevels levels={line.waterLevels} />
                  </td>
                  <td className='py-2'>
                    <ValvePair valves={line.valvesOut} />
                  </td>
                  <td className='py-2 text-right'>
                    <NumberCell value={line.outflow} unit='m³/h' />
                  </td>
                </tr>
              )),
            )}
          </tbody>
        </table>
      </div>
    </AioPanel>
  )
}

function NumberCell({ value, unit }: { value: number | null; unit: string }) {
  if (value === null) return <span className='text-white/40'>—</span>
  return (
    <span>
      <span>{value.toFixed(1)}</span>
      <span className='ml-0.5 text-[var(--aio-subtitle)]'>{unit}</span>
    </span>
  )
}

function ValvePair({ valves }: { valves: [SongsuValve | null, SongsuValve | null] }) {
  return (
    <div className='flex justify-center gap-1'>
      {valves.map((v, i) => {
        if (!v) {
          return (
            <span key={i} className='inline-block w-10 text-center text-white/30'>
              —
            </span>
          )
        }
        return (
          <span
            key={i}
            className={cn(
              'inline-flex w-10 items-center justify-center rounded border px-1 py-0.5 text-[10px]',
              v.state === 'on'
                ? 'border-emerald-300 bg-emerald-400/20 text-emerald-200'
                : 'border-white/20 bg-black/30 text-white/40',
            )}
          >
            {v.state === 'on' ? `${v.opening.toFixed(0)}%` : 'OFF'}
          </span>
        )
      })}
    </div>
  )
}

function WaterLevels({ levels }: { levels: [number | null, number | null] }) {
  return (
    <div className='flex flex-col items-center gap-0.5 text-[10px]'>
      {levels.map((l, i) =>
        l === null ? (
          <span key={i} className='text-white/30'>
            —
          </span>
        ) : (
          <span
            key={i}
            className='rounded border border-[var(--aio-panel-border)] bg-black/40 px-2 py-0.5'
          >
            <span className='text-white'>{l.toFixed(1)}</span>
            <span className='ml-0.5 text-[var(--aio-subtitle)]'>m</span>
          </span>
        ),
      )}
    </div>
  )
}
