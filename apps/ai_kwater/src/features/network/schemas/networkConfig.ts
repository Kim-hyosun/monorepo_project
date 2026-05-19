import { z } from 'zod'

const ipRegex = /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/

const ipField = z.string().min(1, 'IP를 입력해주세요').regex(ipRegex, 'IP의 형식이 올바르지 않습니다')
const portField = z.string().min(1, 'Port를 입력해주세요').regex(/^\d+$/, 'Port값에 숫자를 입력해주세요')

export const networkConfigSchema = z.object({
  scada1_address: ipField,
  scada1_port: portField,
  scada2_address: ipField,
  scada2_port: portField,
  analysis1_address: ipField,
  analysis1_rm: portField,
  analysis1_nm: portField,
  analysis1_nn: portField,
  analysis2_address: ipField,
  analysis2_rm: portField,
  analysis2_nm: portField,
  analysis2_nn: portField,
})

export type NetworkConfigFormValues = z.infer<typeof networkConfigSchema>
