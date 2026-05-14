import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
  password: z.string().min(8, '비밀번호는 8자 이상이어야 합니다'),
})

export type LoginInput = z.infer<typeof loginSchema>

export const loginDefaults: LoginInput = {
  email: '',
  password: '',
}
