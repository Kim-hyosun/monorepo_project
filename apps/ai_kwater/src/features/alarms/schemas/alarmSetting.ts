import { z } from 'zod'

/** 원본 modifyAlarmDialog 상태에 대응. */
export const alarmSettingSchema = z.object({
  display_name: z.string().min(1, '알람 이름을 입력해주세요'),
  value: z.coerce.number(),
  scada_send: z.coerce.number().int(),
})

export type AlarmSettingFormValues = z.infer<typeof alarmSettingSchema>
