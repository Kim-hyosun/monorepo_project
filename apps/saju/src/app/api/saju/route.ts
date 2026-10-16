import { NextResponse } from 'next/server'

import { sajuInputSchema } from '@/lib/schema'
import type { ManseApiResult } from '@/lib/types'

export const runtime = 'nodejs'
const MANSE_API_URL = 'https://sajuapi.vercel.app/api/saju'

/**
 * POST /api/saju
 * 요청 본문은 검증 후 변경 없이 만세력 API로 전달한다.
 * 응답: { ok: true, data: ManseApiResult } | { ok: false, error: { code, message, status } }
 */
export async function POST(req: Request) {
    let rawBody: string
    let body: unknown
    try {
        rawBody = await req.text()
        body = JSON.parse(rawBody)
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

    try {
        const response = await fetch(MANSE_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': 'Lets_enjoy_Saju_just_for_fun',
            },
            body: JSON.stringify({
                birthDate: parsed.data.birthDate,
                birthTime: parsed.data.birthTime ?? '12:00',
                timeUnknown: parsed.data.timeUnknown,
                gender: parsed.data.gender,
            }),
            cache: 'no-store',
        })

        if (!response.ok) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: 'MANSE_API_ERROR',
                        message: `사주 API 요청에 실패했습니다. (${response.status})`,
                        status: response.status,
                    },
                },
                { status: response.status >= 400 && response.status < 600 ? response.status : 502 }
            )
        }

        const data: unknown = await response.json()
        if (!isManseApiResult(data)) {
            return NextResponse.json(
                {
                    ok: false,
                    error: {
                        code: 'INVALID_MANSE_API_RESPONSE',
                        message: '사주 API 응답 형식이 올바르지 않습니다.',
                        status: 502,
                    },
                },
                { status: 502 }
            )
        }

        return NextResponse.json({ ok: true, data })
    } catch (err) {
        const message = err instanceof Error ? err.message : '알 수 없는 오류가 발생했습니다.'
        return NextResponse.json(
            { ok: false, error: { code: 'UPSTREAM_ERROR', message, status: 502 } },
            { status: 502 }
        )
    }
}

function isManseApiResult(value: unknown): value is ManseApiResult {
    if (typeof value !== 'object' || value === null) return false
    const result = value as Record<string, unknown>
    return typeof result.compactData === 'string' && typeof result.interpretation === 'string'
}
