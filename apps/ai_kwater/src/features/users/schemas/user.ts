import { z } from 'zod'

export const addUserSchema = z
  .object({
    userid: z.string().min(1, '아이디를 입력해주세요'),
    name: z.string().min(1, '이름을 입력해주세요'),
    password: z.string().min(1, '암호를 입력해주세요'),
    password_confirm: z.string().min(1, '암호 확인을 입력해주세요'),
    partname: z.string().min(1, '부서명을 입력해주세요'),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: '암호가 일치하지 않습니다',
    path: ['password_confirm'],
  })

export type AddUserFormValues = z.infer<typeof addUserSchema>

export const modifyUserSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  partname: z.string().min(1, '부서명을 입력해주세요'),
})

export type ModifyUserFormValues = z.infer<typeof modifyUserSchema>

export const modifyPasswordSchema = z
  .object({
    password: z.string().min(1, '새 암호를 입력해주세요'),
    password_confirm: z.string().min(1, '암호 확인을 입력해주세요'),
  })
  .refine((data) => data.password === data.password_confirm, {
    message: '암호가 일치하지 않습니다',
    path: ['password_confirm'],
  })

export type ModifyPasswordFormValues = z.infer<typeof modifyPasswordSchema>
