// 원본: 성남정수장/src/store/pms/* + components/pms/component/Monitor*.vue
// 펌프/모터 진동/전류/온도 모니터링 도메인. 4 amp 채널 + 진동 + 온도 시계열.

export type MotorStatus = 'normal' | 'warning' | 'error' | 'off'

export interface PumpMotor {
  id: string
  index: number
  name: string
  /** 송수펌프 / 송수모터 / 가압펌프 등 분류 */
  category: string
  status: MotorStatus
  alarm: boolean
  /** 4채널 amp 현재값 */
  motor_de_amp_val: number
  motor_nde_amp_val: number
  pump_de_amp_val: number
  pump_nde_amp_val: number
  /** 진동 / 온도 현재값 */
  vibration_val: number
  temperature_val: number
  /** 60분 시계열 */
  motor_de_amp: Array<[number, number]>
  motor_nde_amp: Array<[number, number]>
  pump_de_amp: Array<[number, number]>
  pump_nde_amp: Array<[number, number]>
  vibration: Array<[number, number]>
  temperature: Array<[number, number]>
}

export interface PmsAlert {
  num: number
  time: string
  list: string
  info: string
  status: string
  /** 사용자가 확인한 알람 여부 (선택). 미존재 시 false 처리 */
  read?: boolean
}

export interface ProcessStatus {
  index: number
  title: string
  normal: number
  err: number
  img: string
}

export interface PmsMotorsResponse {
  motors: PumpMotor[]
}

export interface PmsMotorDetailResponse {
  motor: PumpMotor
}

export interface PmsAlertsResponse {
  alerts: PmsAlert[]
}

export interface PmsProcessStatusResponse {
  process: ProcessStatus[]
}
