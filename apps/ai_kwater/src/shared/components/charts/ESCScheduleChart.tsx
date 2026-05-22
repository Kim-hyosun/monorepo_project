'use client'

import { AioPanel } from '@/shared/components/AioPanel'

export interface ScheduleEntry {
  /** 슬러지 배출/역세 등의 인덱스 (y축 카테고리) */
  index: number
  label: string
  start: number // ms
  end: number // ms
  /** 색상 종류: scheduled (예정) | active (진행중) | done (완료) */
  state: 'scheduled' | 'active' | 'done'
}

interface Props {
  entries: ScheduleEntry[]
  title?: string
  height?: number
}

const STATE_COLOR: Record<ScheduleEntry['state'], string> = {
  scheduled: '#5cafff',
  active: '#fbbf24',
  done: '#34d399',
}

const STATE_LABEL: Record<ScheduleEntry['state'], string> = {
  scheduled: '예정',
  active: '진행중',
  done: '완료',
}

/**
 * 원본 성남정수장/components/aio/sedimentation/chart/ESCScheduleChart.vue 의
 * 슬러지 배출/역세 schedule timeline.
 * Highcharts xrange 모듈 사이드이펙트 import 가 v11에서 신뢰성 떨어져 정적 SVG 로 재구현.
 */
export default function ESCScheduleChart({
  entries,
  title = '배출 / 역세 일정',
  height = 220,
}: Props) {
  if (entries.length === 0) {
    return (
      <AioPanel className='p-4'>
        <h3 className='mb-2 text-sm font-semibold text-[var(--aio-subtitle)]'>{title}</h3>
        <div className='text-xs text-[var(--aio-subtitle)]'>일정 없음</div>
      </AioPanel>
    )
  }

  const labels = Array.from(new Set(entries.map((e) => e.label)))
  const minStart = Math.min(...entries.map((e) => e.start))
  const maxEnd = Math.max(...entries.map((e) => e.end))
  const span = maxEnd - minStart || 1

  const rowH = 28
  const padTop = 24
  const padBottom = 24
  const labelW = 100
  const contentH = labels.length * rowH

  const fmtTime = (ms: number) => {
    const d = new Date(ms)
    return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  const gridTicks = [
    { ratio: 0, label: fmtTime(minStart) },
    { ratio: 0.5, label: fmtTime(minStart + span / 2) },
    { ratio: 1, label: fmtTime(maxEnd) },
  ]

  return (
    <AioPanel className='p-4'>
      <div className='mb-3 flex items-center justify-between'>
        <h3 className='text-sm font-semibold text-[var(--aio-subtitle)]'>{title}</h3>
        <div className='flex gap-2 text-[10px]'>
          {(['done', 'active', 'scheduled'] as ScheduleEntry['state'][]).map((s) => (
            <span key={s} className='flex items-center gap-1 text-[var(--aio-subtitle)]'>
              <span
                className='inline-block h-2 w-2 rounded'
                style={{ background: STATE_COLOR[s] }}
              />
              {STATE_LABEL[s]}
            </span>
          ))}
        </div>
      </div>

      <div className='relative' style={{ height: Math.max(height, contentH + padTop + padBottom) }}>
        <svg
          width='100%'
          height='100%'
          viewBox={`0 0 1000 ${contentH + padTop + padBottom}`}
          preserveAspectRatio='none'
          style={{ display: 'block', overflow: 'visible' }}
        >
          {gridTicks.map((t, i) => {
            const x = labelW + (1000 - labelW) * t.ratio
            return (
              <g key={`g-${i}`}>
                <line
                  x1={x}
                  y1={padTop}
                  x2={x}
                  y2={padTop + contentH}
                  stroke='rgba(139,194,240,0.15)'
                  strokeDasharray='3 3'
                />
                <text
                  x={x}
                  y={padTop + contentH + 14}
                  fill='#c3eaff'
                  fontSize='10'
                  textAnchor='middle'
                >
                  {t.label}
                </text>
              </g>
            )
          })}

          {labels.map((label, rowIdx) => {
            const y = padTop + rowIdx * rowH + rowH / 2
            return (
              <g key={`row-${rowIdx}`}>
                <text x={labelW - 6} y={y + 4} fill='#c3eaff' fontSize='11' textAnchor='end'>
                  {label}
                </text>
                <line x1={labelW} y1={y} x2={1000} y2={y} stroke='rgba(139,194,240,0.06)' />
              </g>
            )
          })}

          {entries.map((e, i) => {
            const rowIdx = labels.indexOf(e.label)
            const y = padTop + rowIdx * rowH + rowH / 2 - 8
            const startRatio = (e.start - minStart) / span
            const endRatio = (e.end - minStart) / span
            const x = labelW + (1000 - labelW) * startRatio
            const w = Math.max(4, (1000 - labelW) * (endRatio - startRatio))
            return (
              <rect
                key={`bar-${i}`}
                x={x}
                y={y}
                width={w}
                height={16}
                rx={3}
                fill={STATE_COLOR[e.state]}
                opacity={0.9}
              >
                <title>
                  {e.label} · {STATE_LABEL[e.state]} · {fmtTime(e.start)} ~ {fmtTime(e.end)}
                </title>
              </rect>
            )
          })}
        </svg>
      </div>
    </AioPanel>
  )
}
