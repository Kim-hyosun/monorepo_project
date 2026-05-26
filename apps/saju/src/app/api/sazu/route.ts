import { NextResponse } from 'next/server'
import { SazuApiError } from '@sazuapp/client'

import { getSazuClient } from '@/lib/sazu'
import { sajuInputSchema } from '@/lib/schema'

export const runtime = 'nodejs'

/**
 * POST /api/sazu
 * body: SajuInput (Zod 검증)
 * 응답: { ok: true, data: CalculateResult } | { ok: false, error: { code, message, status } }
 */
export async function POST(req: Request) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { ok: false, error: { code: 'BAD_JSON', message: '요청 본문이 JSON 이 아닙니다.', status: 400 } },
      { status: 400 }
    )
  }

  const parsed = sajuInputSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: '입력값을 확인해 주세요.',
          status: 400,
          issues: parsed.error.issues.map((i) => ({ path: i.path.join('.'), message: i.message })),
        },
      },
      { status: 400 }
    )
  }

  const input = parsed.data
  const [y, m, d] = input.birthDate.split('-').map(Number)
  let birthHour: number | null = null
  let birthMinute = 0
  if (!input.timeUnknown && input.birthTime) {
    const [hh, mm] = input.birthTime.split(':').map(Number)
    birthHour = hh
    birthMinute = mm
  }

  try {
    const sazu = getSazuClient()
    const result = await sazu.calculate({
      birthYear: y,
      birthMonth: m,
      birthDay: d,
      birthHour,
      birthMinute,
      isFemale: input.gender === 'female',
      isLunar: input.calendar === 'lunar',
      birthCity: input.birthCity || undefined,
      locale: 'ko',
      detail: 'standard',
    })
    return NextResponse.json({ ok: true, data: result })
  } catch (err) {
    if (err instanceof SazuApiError) {
      // SDK 분류 — 호출부에서 사용자에게 안내할 메시지 결정
      const userMessage = err.isAuthError
        ? 'API 키 인증에 실패했습니다. 서버 환경변수를 확인해 주세요.'
        : err.isRateLimited
          ? `요청 한도 초과. ${err.retryAfterSec ?? 60}초 후 다시 시도해 주세요.`
          : err.isTransient
            ? '서비스가 일시적으로 응답하지 않습니다. 잠시 후 다시 시도해 주세요.'
            : err.message
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: err.code ?? 'SAZU_API_ERROR',
            message: userMessage,
            status: err.status,
            responseId: err.responseId,
            retryAfterSec: err.retryAfterSec,
          },
        },
        { status: err.status >= 400 && err.status < 600 ? err.status : 502 }
      )
    }
    // 환경변수 누락 등 setup 에러
    const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
    return NextResponse.json(
      { ok: false, error: { code: 'SETUP_ERROR', message, status: 500 } },
      { status: 500 }
    )
  }
}
