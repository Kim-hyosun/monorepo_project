import { z } from 'zod'

/** 사용자 입력 폼 스키마 — SajuForm + API route 양쪽에서 사용. */
export const sajuInputSchema = z.object({
  /** 생년월일 (YYYY-MM-DD) */
  birthDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '생년월일은 YYYY-MM-DD 형식입니다')
    .refine((v) => !Number.isNaN(Date.parse(v)), '유효한 날짜를 입력하세요'),
  /** 출생 시각 (HH:MM, 24h). 모르면 '시간 모름' 체크 → undefined */
  birthTime: z
    .string()
    .regex(/^\d{2}:\d{2}$/, '시각은 HH:MM 형식입니다')
    .optional(),
  /** 시간 모름 토글 */
  timeUnknown: z.boolean().default(false),
  /** 성별 */
  gender: z.enum(['male', 'female']),
  /** 양력 / 음력. SDK 는 isLunar boolean 만 받음 (윤달 미지원 — 향후 calendar.convert 로 보완) */
  calendar: z.enum(['solar', 'lunar']).default('solar'),
  /** 출생 도시 (선택, 진태양시 보정용) */
  birthCity: z.string().max(60).optional(),
})

export type SajuInput = z.infer<typeof sajuInputSchema>
