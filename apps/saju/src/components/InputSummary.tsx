'use client'

import type { InputShape, TimezoneShape } from '@/lib/types'

interface Props {
  input?: Record<string, unknown>
  timezone?: Record<string, unknown>
}

/**
 * API 가 보정해서 돌려준 입력 정보 + timezone(진태양시) 요약.
 * 사용자가 어떻게 해석되었는지 투명하게 보여준다.
 */
export function InputSummary({ input, timezone }: Props) {
  const i = input ? extractInput(input) : null
  const tz = timezone ? extractTimezone(timezone) : null
  if (!i && !tz) return null

  return (
    <div className='bg-card text-card-foreground rounded-xl border p-4 text-xs shadow-sm'>
      <div className='mb-2 text-sm font-semibold'>입력 / 보정 정보</div>
      <dl className='grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4'>
        {i ? (
          <>
            <Row label='생년월일'>
              {i.birthYear}.{pad(i.birthMonth)}.{pad(i.birthDay)}
            </Row>
            <Row label='출생 시각'>
              {i.birthHour === null || i.birthHour === undefined
                ? '시간 모름'
                : `${pad(i.birthHour)}:${pad(i.birthMinute ?? 0)}`}
            </Row>
            <Row label='달력'>{i.isLunar ? '음력' : '양력'}</Row>
            <Row label='성별'>{i.isFemale ? '여성' : '남성'}</Row>
            {i.birthCity ? <Row label='출생 도시'>{i.birthCity}</Row> : null}
            {i.correctedHour !== undefined ? (
              <Row label='보정 시각'>
                {pad(i.correctedHour)}:{pad(i.correctedMinute ?? 0)}
              </Row>
            ) : null}
            {i.isInternationalAge !== undefined ? (
              <Row label='나이 계산'>{i.isInternationalAge ? '만 나이' : '한국 나이'}</Row>
            ) : null}
          </>
        ) : null}
        {tz ? (
          <>
            <Row label='UTC 오프셋'>+{tz.utcOffset / 60}h</Row>
            <Row label='진태양시 보정'>
              {tz.correctionMinutes === 0
                ? '없음'
                : `${tz.correctionMinutes > 0 ? '+' : ''}${tz.correctionMinutes}분`}
            </Row>
          </>
        ) : null}
      </dl>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <>
      <dt className='text-muted-foreground'>{label}</dt>
      <dd className='text-foreground font-medium'>{children}</dd>
    </>
  )
}

function pad(n: number): string {
  return String(n).padStart(2, '0')
}

function extractInput(v: Record<string, unknown>): InputShape | null {
  const birthYear = typeof v.birthYear === 'number' ? v.birthYear : undefined
  const birthMonth = typeof v.birthMonth === 'number' ? v.birthMonth : undefined
  const birthDay = typeof v.birthDay === 'number' ? v.birthDay : undefined
  if (birthYear === undefined || birthMonth === undefined || birthDay === undefined) return null
  return {
    birthYear,
    birthMonth,
    birthDay,
    birthHour:
      typeof v.birthHour === 'number' ? v.birthHour : v.birthHour === null ? null : undefined,
    birthMinute: typeof v.birthMinute === 'number' ? v.birthMinute : undefined,
    isLunar: v.isLunar === true,
    isFemale: v.isFemale === true,
    birthCity: typeof v.birthCity === 'string' ? v.birthCity : undefined,
    isInternationalAge: typeof v.isInternationalAge === 'boolean' ? v.isInternationalAge : undefined,
    correctedHour: typeof v.correctedHour === 'number' ? v.correctedHour : undefined,
    correctedMinute: typeof v.correctedMinute === 'number' ? v.correctedMinute : undefined,
  }
}

function extractTimezone(v: Record<string, unknown>): TimezoneShape | null {
  const city = typeof v.city === 'string' ? v.city : undefined
  const utcOffset = typeof v.utcOffset === 'number' ? v.utcOffset : undefined
  const correctionMinutes = typeof v.correctionMinutes === 'number' ? v.correctionMinutes : undefined
  if (!city || utcOffset === undefined || correctionMinutes === undefined) return null
  return { city, utcOffset, correctionMinutes }
}
