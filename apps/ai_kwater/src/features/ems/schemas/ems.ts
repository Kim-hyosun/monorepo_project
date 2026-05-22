import { z } from 'zod'

export const costSettingSchema = z.object({
  baseRate: z.coerce.number().min(0),
  unitRate: z.coerce.number().min(0),
  peakRate: z.coerce.number().min(0),
  drDiscount: z.coerce.number().min(0).max(100),
})

export const goalConfigSchema = z.object({
  targetReductionPct: z.coerce.number().min(0).max(100),
  targetPeakKw: z.coerce.number().min(0),
  targetCostKrw: z.coerce.number().min(0),
  fiscalYear: z.coerce.number().int().min(2000).max(2100),
})

export const peakSettingSchema = z.object({
  peakStartHour: z.coerce.number().int().min(0).max(23),
  peakEndHour: z.coerce.number().int().min(0).max(23),
  peakLimitKw: z.coerce.number().min(0),
  drDispatchKw: z.coerce.number().min(0),
  enabled: z.boolean(),
})

export const tagSchema = z.object({
  tag: z.string().min(1),
  label: z.string().min(1),
  unit: z.string().min(1),
  category: z.enum(['pump', 'peak', 'dr', 'cost', 'misc']),
  enabled: z.boolean(),
})

export type CostSettingForm = z.infer<typeof costSettingSchema>
export type GoalConfigForm = z.infer<typeof goalConfigSchema>
export type PeakSettingForm = z.infer<typeof peakSettingSchema>
export type TagForm = z.infer<typeof tagSchema>
