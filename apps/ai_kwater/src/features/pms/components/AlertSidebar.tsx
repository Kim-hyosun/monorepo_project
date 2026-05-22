'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Bell, BellOff, ChevronDown, ChevronRight, ZapOff, Zap } from 'lucide-react'

import { useProcessDialogStore } from '@/stores/processDialogStore'
import { cn } from '@/shared/utils/cn'
import type { PmsAlert } from '@/features/pms/types/pms'

interface Props {
  alerts: PmsAlert[]
  className?: string
}

const STATUS_COLOR: Record<string, string> = {
  경보: 'text-rose-400 border-rose-400/40',
  주의: 'text-amber-300 border-amber-300/40',
}

type FilterKey = 'all' | '경보' | '주의' | 'unread'
const FILTERS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: '경보', label: '경보' },
  { key: '주의', label: '주의' },
  { key: 'unread', label: '미확인' },
]

const FILTER_STORAGE_KEY = 'pms_alert_filter'
const SOUND_STORAGE_KEY = 'pms_alert_sound'

function playBeep() {
  if (typeof window === 'undefined') return
  try {
    type WindowWithAudio = typeof window & {
      AudioContext?: typeof AudioContext
      webkitAudioContext?: typeof AudioContext
    }
    const w = window as WindowWithAudio
    const AudioCtor = w.AudioContext ?? w.webkitAudioContext
    if (!AudioCtor) return
    const ctx = new AudioCtor()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 880
    gain.gain.value = 0.15
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 0.18)
    setTimeout(() => ctx.close(), 300)
  } catch {
    // ignore: audio context blocked or unsupported
  }
}

export function AlertSidebar({ alerts, className }: Props) {
  const openAlarmNotify = useProcessDialogStore((s) => s.openAlarmNotify)
  const autoShowAlarmIfNew = useProcessDialogStore((s) => s.autoShowAlarmIfNew)
  const autoShow = useProcessDialogStore((s) => s.alarmNotify.autoShow)
  const setAlarmAutoShow = useProcessDialogStore((s) => s.setAlarmAutoShow)

  const [filter, setFilter] = useState<FilterKey>('all')
  const [soundOn, setSoundOn] = useState(false)
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set())
  const lastMaxNumRef = useRef<number>(0)

  // localStorage hydrate
  useEffect(() => {
    if (typeof window === 'undefined') return
    const f = window.localStorage.getItem(FILTER_STORAGE_KEY) as FilterKey | null
    if (f && FILTERS.some((x) => x.key === f)) setFilter(f)
    const s = window.localStorage.getItem(SOUND_STORAGE_KEY)
    if (s === '1') setSoundOn(true)
  }, [])

  // persist filter
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(FILTER_STORAGE_KEY, filter)
  }, [filter])

  // persist sound
  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(SOUND_STORAGE_KEY, soundOn ? '1' : '0')
  }, [soundOn])

  // auto-show + beep on new alerts
  useEffect(() => {
    autoShowAlarmIfNew(alerts)
    if (alerts.length === 0) return
    const maxNum = alerts.reduce((m, a) => (a.num > m ? a.num : m), 0)
    if (lastMaxNumRef.current > 0 && maxNum > lastMaxNumRef.current && soundOn) {
      playBeep()
    }
    lastMaxNumRef.current = maxNum
  }, [alerts, autoShowAlarmIfNew, soundOn])

  const unreadCount = alerts.filter((a) => a.read !== true).length

  const filtered = useMemo(() => {
    if (filter === 'all') return alerts
    if (filter === 'unread') return alerts.filter((a) => a.read !== true)
    return alerts.filter((a) => a.status === filter)
  }, [alerts, filter])

  const grouped = useMemo(() => {
    const map = new Map<string, PmsAlert[]>()
    filtered.forEach((a) => {
      const arr = map.get(a.list) ?? []
      arr.push(a)
      map.set(a.list, arr)
    })
    return Array.from(map.entries())
  }, [filtered])

  const toggleGroup = (list: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(list)) next.delete(list)
      else next.add(list)
      return next
    })
  }

  return (
    <div
      className={cn(
        'rounded-md border border-[var(--aio-panel-border)] bg-[var(--aio-panel)] p-3',
        className,
      )}
    >
      <div className='mb-2 flex items-center justify-between'>
        <h3
          className='text-sm font-semibold text-white'
          style={{ textShadow: 'var(--aio-text-glow)' }}
        >
          경보 / 주의 이력
        </h3>
        <div className='flex items-center gap-1.5'>
          {unreadCount > 0 ? (
            <span className='rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-medium text-rose-300'>
              미확인 {unreadCount}
            </span>
          ) : null}
          <button
            type='button'
            onClick={() => setAlarmAutoShow(!autoShow)}
            aria-label={autoShow ? '자동 노출 끄기' : '자동 노출 켜기'}
            title={autoShow ? '새 알람 자동 노출 ON' : '새 알람 자동 노출 OFF'}
            className={cn(
              'rounded p-1 transition',
              autoShow
                ? 'text-[var(--aio-accent)] hover:bg-white/10'
                : 'text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
          >
            {autoShow ? <Zap size={14} /> : <ZapOff size={14} />}
          </button>
          <button
            type='button'
            onClick={() => setSoundOn((v) => !v)}
            aria-label={soundOn ? '소리 끄기' : '소리 켜기'}
            className={cn(
              'rounded p-1 transition',
              soundOn
                ? 'text-[var(--aio-accent)] hover:bg-white/10'
                : 'text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
          >
            {soundOn ? <Bell size={14} /> : <BellOff size={14} />}
          </button>
        </div>
      </div>

      <div className='mb-2 flex flex-wrap gap-1'>
        {FILTERS.map((f) => (
          <button
            key={f.key}
            type='button'
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-2 py-0.5 text-[10px] font-medium transition',
              filter === f.key
                ? 'border-[var(--aio-accent)] bg-[var(--aio-accent)]/20 text-[var(--aio-accent)]'
                : 'border-[var(--aio-panel-border)] text-[var(--aio-subtitle)] hover:bg-white/5',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className='text-xs text-[var(--aio-subtitle)]'>이력 없음</div>
      ) : (
        <ul className='space-y-2'>
          {grouped.map(([list, items]) => {
            const isCollapsed = collapsed.has(list)
            const groupUnread = items.filter((a) => a.read !== true).length
            return (
              <li key={list} className='rounded border border-white/5'>
                <button
                  type='button'
                  onClick={() => toggleGroup(list)}
                  className='flex w-full items-center justify-between gap-1 rounded-t bg-white/5 px-2 py-1 text-left text-xs hover:bg-white/10'
                >
                  <span className='flex min-w-0 items-center gap-1 text-white'>
                    {isCollapsed ? <ChevronRight size={12} /> : <ChevronDown size={12} />}
                    <span className='truncate font-medium'>{list}</span>
                  </span>
                  <span className='flex items-center gap-1 text-[10px] text-[var(--aio-subtitle)]'>
                    {groupUnread > 0 ? (
                      <span className='rounded-full bg-rose-500/30 px-1.5 py-0.5 text-rose-300'>
                        {groupUnread}
                      </span>
                    ) : null}
                    <span>{items.length}</span>
                  </span>
                </button>
                {isCollapsed ? null : (
                  <ul className='space-y-1 p-1.5'>
                    {items.map((a) => {
                      const isUnread = a.read !== true
                      return (
                        <li key={a.num}>
                          <button
                            type='button'
                            onClick={() => openAlarmNotify(a)}
                            className={cn(
                              'w-full rounded border bg-black/20 px-2 py-1.5 text-left text-xs transition hover:bg-white/5 hover:brightness-110',
                              STATUS_COLOR[a.status] ?? 'border-white/10 text-white',
                              isUnread && 'ring-1 ring-rose-400/30',
                              !isUnread && 'opacity-60',
                            )}
                          >
                            <div className='flex items-center justify-between gap-1'>
                              <span className='flex items-center gap-1.5 font-medium'>
                                {isUnread ? (
                                  <span
                                    className='inline-block h-1.5 w-1.5 rounded-full bg-rose-400'
                                    style={{ boxShadow: '0 0 6px rgba(248,113,113,0.8)' }}
                                  />
                                ) : null}
                                <span>{a.info}</span>
                              </span>
                              <span>{a.status}</span>
                            </div>
                            <div className='mt-0.5 text-[10px] text-[var(--aio-subtitle)]'>
                              {a.time}
                            </div>
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
