import { z } from 'zod'

export const cgSimulationSchema = z.object({
  turbidity: z.coerce.number().min(0, '탁도는 0 이상').max(1000, '탁도 범위 초과'),
  alkalinity: z.coerce.number().min(0).max(500),
  ph: z.coerce.number().min(0).max(14),
})

export type CgSimulationFormValues = z.infer<typeof cgSimulationSchema>
