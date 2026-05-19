import { z } from 'zod'

export const loginSchema = z.object({
  userid: z.string().min(1, '아이디를 입력해주세요'),
  password: z.string().min(1, '암호를 입력해주세요'),
})

export type LoginFormValues = z.infer<typeof loginSchema>
